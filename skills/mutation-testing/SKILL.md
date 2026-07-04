---
name: mutation-testing
description: "Set up mutation testing to verify that tests actually exercise their claims, not just the happy path. Activate when user says 'set up mutation testing', 'mutation score', 'test the tests', 'is this code falsifiable', 'is this provably correct', 'add mutation gate', 'verify the tests actually work', or when a new classifier / validator / gate / parser / schema enforcer / auth checker is added without existing mutation config."
argument-hint: "[path-to-falsifier-code] [optional: language — python | js | rust | go | java | dotnet]"
allowed-tools: [Agent, Read, Bash, Glob, Grep, Write]
---

<!-- MIT License — Copyright (c) 2026 Garman Unified Systems — https://idirectships.com -->

# Mutation Testing — Falsifier Code SOP

Mutation testing verifies that your tests actually exercise correctness claims — not just that code runs without crashing.

**The core problem:** A test suite with 100% pass rate can still be useless if it never checks the actual decision boundary. Mutation testing injects small code faults (flip `>` to `>=`, delete a return statement, change a constant) and checks whether any test fails. If tests stay green after a fault injection, the tests are not checking what they claim to check.

---

## What & Why — The Falsifier Concept

**Falsifier code** is code whose correctness is the foundation of a downstream claim. If the code makes a wrong decision, the claim is wrong — silently.

Examples across project types:
- ML classifier: detects data contamination, content toxicity, category membership
- Payment validator: gates a transaction as "valid"
- Moderation rule matcher: decides "this content is blocked"
- Schema parser / type enforcer: decides "this shape is correct"
- Authentication checker: decides "this token is genuine"
- Compiler / type checker: decides "this program is well-typed"
- Business rule engine: decides "this order qualifies for a discount"

Falsifiers ARE the system's testable hypotheses about itself. Without mutation testing, a falsifier can have 100% test pass and still be silently broken.

### The Four Lessons (a production case study)

1. **"Tests pass" ≠ "tests work."** Mutation testing is the only way to confirm tests exercise the actual claim. A production classifier had 36 passing tests and a 0.363 mutation score. The cheat-tell classifier had 44 passing tests and a 0.388 score. Both were structurally unfalsifiable despite green CI.

2. **Falsifier code is the highest-leverage mutation target.** Don't spend mutation budget on utility/helper code. Identify falsifiers first, mutate them first. The ROI gap between mutating a decision boundary vs. a logging function is 10×.

3. **Heavy-IO / ML tests must be split into unit (mocked, fast) and integration (real, slow) BEFORE the first mutation run.** Per-mutant pytest invocation × 30-90s model load = 25-50 hour wall time on a single classifier. Mocked unit tests run at ~200 mutations/sec. This split is a prerequisite, not an optimization.

4. **Spec drift is real — research-validate tool flags and claims before executing.** This session caught a fabricated `--in-diff` flag and an unverified "88.5% detection rate" claim before running. Both would have failed silently at first execution. Verify CLI flags against current docs; verify quantitative claims against source material.

---

## Language → Tool Table

| Language | Primary Tool | Fallback | Notes |
|---|---|---|---|
| Python | `mutmut` 3.5.0 | `cosmic-ray` 8.4 | mutmut is faster + simpler config; cosmic-ray has operator-level control |
| JavaScript / TypeScript | Stryker.js | — | `npx stryker init` scaffolds config; first-class TS support |
| Java / Kotlin | PIT (pitest) | — | Maven/Gradle plugin; run via `mvn test-compile org.pitest:pitest-maven:mutationCoverage` |
| Rust | `cargo-mutants` | — | `cargo install cargo-mutants && cargo mutants` |
| Go | `go-mutesting` | — | `go install github.com/zimmski/go-mutesting/...@latest` |
| .NET (C# / F#) | Stryker.NET | — | `dotnet tool install -g dotnet-stryker` |

**Version note:** all versions listed as of 2026. Verify with `pip show mutmut`, `npx stryker --version`, etc. before using — tool APIs shift across major versions.

---

## Falsifier Identification Checklist

Before choosing what to mutate, answer these questions about the code under review:

1. **Does it gate a claim?** ("This transaction is valid", "This token is genuine", "This content is safe") — if yes, it's a falsifier.
2. **Does a wrong output change a downstream truth?** If the function returns the wrong category, does something bad happen silently? — if yes, it's a falsifier.
3. **Does it have a finite set of valid outputs that represent decisions?** (boolean, enum, score above/below threshold) — decision boundary code is the highest-value mutation target.
4. **Is it load-bearing for a published or auditable claim?** (thesis claim, compliance requirement, SLA, "99% accuracy") — if the claim depends on this code being correct, it's a falsifier.
5. **Would a wrong answer be caught by any downstream test?** If no downstream test catches a bad output from this function, mutation testing is the ONLY check.
6. **Is this code path exercised under both true and false conditions in current tests?** If tests only exercise the "happy path," even non-falsifiers can have a low mutation score.
7. **Has this code been modified recently without a corresponding test update?** A code change that doesn't change tests is a mutation that survived — worth investigating.

Score: if 3+ answers are "yes," treat this as falsifier code and prioritize it for mutation testing.

---

## Pre-flight: Test Segregation (Required for ML / IO / Heavy-Load Code)

Before running any mutation tool against code with slow external dependencies (model loads, DB calls, HTTP requests, file I/O):

**The problem:** mutation tools invoke your test suite once per mutant. If each test invocation takes 30s (model load), and you have 300 mutants, that's 150 minutes minimum — before accounting for retry and timeout overhead.

**The fix:** split tests into two directories before the first mutation run.

```
tests/
  <component>/
    unit/          # mocked fixtures, pure logic, fast (<1s per test)
    integration/   # real models/DB/HTTP, slow, gated separately
```

### Unit test rules
- Mock every external dependency (models, DB connections, HTTP calls, file I/O)
- Mocks must exercise the PRODUCTION code path — mock the dependency, not the function under test
- If you're mocking `classifier.predict()`, you're testing the mock, not the classifier
- Target: full pass in <10s for the entire unit suite

### Integration test rules
- Use real dependencies; no mocks
- Gate with a marker or separate invocation: `pytest -m integration` or `pytest tests/component/integration/`
- Keep out of mutation scope
- Still run in normal CI on push/PR

### Example pattern (reference implementation)
```
tests/classifiers/
  unit/
    test_provenance_unit.py     # mocked BERT, tests logic branches
    test_cheat_tell_unit.py     # mocked distilbert, tests decision thresholds
  integration/
    test_provenance_real.py     # real BERT, validates end-to-end
    test_cheat_tell_real.py     # real distilbert, validates end-to-end
```

---

## Workflow — 6 Phases

### Phase 1: Identify Falsifier Code

Run the falsifier checklist above. List every function/module that scores 3+. This is your mutation target list.

```bash
# Quick scan for decision-making patterns (Python example)
grep -rn "return True\|return False\|raise.*Error\|> threshold\|== expected" <src_path>
```

### Phase 2: Segregate Tests

Split existing tests into `unit/` and `integration/` per the pre-flight rules above. Verify unit suite completes in <10s. Do not proceed until segregation is done if any test involves real external dependencies.

### Phase 3: Install and Configure the Tool

**Python (mutmut):**
```bash
pip install mutmut  # or: uv add --dev mutmut

# pyproject.toml
[tool.mutmut]
paths_to_mutate = "src/your_falsifier/"
tests_dir = "tests/your_component/unit/"
timeout_multiplier = 5.0   # generous; prevents false survivors from slow CI
```

**JS/TS (Stryker):**
```bash
npx stryker init   # interactive config wizard
# stryker.config.json: set mutate to your falsifier paths, testRunner to jest/mocha
```

**Rust:**
```bash
cargo install cargo-mutants
# Cargo.toml: add [[test]] targets for fast unit tests
```

### Phase 4: Baseline Run

Run mutation testing against your falsifier code and record the initial score.

```bash
# Python
mutmut run --paths-to-mutate src/falsifier.py
mutmut results          # summary
mutmut show <id>        # inspect a surviving mutant

# JS/TS
npx stryker run

# Rust
cargo mutants -p your-crate --file src/falsifier.rs
```

Record the baseline. Expected ranges for new code without targeted tests: 0.30–0.50. Don't be surprised by a low number — that's the point of the exercise.

### Phase 5: Strengthen to ≥ 0.80

For each surviving mutant, add or modify a test that kills it. Focus on:
- Branch coverage: test both sides of every `if`
- Boundary conditions: test at threshold values, not just well inside them
- Output validation: assert the specific value, not just that the function returned without error

```bash
# Python: show surviving mutants to understand what to target
mutmut show $(mutmut results | grep "survived" | awk '{print $2}')
```

Iterate: run → inspect survivors → add targeted tests → re-run → check score.

### Phase 6: CI / Idle-Queue Gate

Add a mutation gate to CI that runs on changes to falsifier paths:

```yaml
# GitHub Actions example (Python)
name: Mutation Gate
on:
  pull_request:
    paths: ['src/falsifiers/**', 'tests/*/unit/**']
jobs:
  mutation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: {python-version: '3.12'}
      - run: pip install mutmut
      # Pre-flight: verify CI runner has required toolchain
      # (e.g., Rust for libcst on Python mutation; JVM for PIT; Node for Stryker)
      - run: python -c "import libcst" 2>/dev/null || pip install libcst
      - run: mutmut run --paths-to-mutate src/falsifiers/
      - run: |
          SCORE=$(python -c "
          import subprocess, json
          r = subprocess.run(['mutmut', 'results', '--json'], capture_output=True, text=True)
          d = json.loads(r.stdout)
          print(d.get('score', 0))
          ")
          echo "Mutation score: $SCORE"
          python -c "import sys; sys.exit(0 if float('$SCORE') >= 0.60 else 1)"
```

**CI runner prerequisite check:** Before adding a mutation gate to CI, verify the runner has the tool's dependencies:
- mutmut on Python 3.12+: may need Rust toolchain for `libcst` compilation (`rustup install stable`)
- PIT: requires JVM 11+
- Stryker.NET: requires .NET SDK matching your target framework
- cargo-mutants: requires stable Rust toolchain on the runner

If the CI runner is missing a prereq, mutation gate silently fails or errors — not a signal about your tests.

---

## Thresholds

| Score | Status | Action |
|---|---|---|
| ≥ 0.80 | Passing — credible falsifier | Ship; add to idle-queue nightly check |
| 0.60–0.79 | Needs strengthening | CI fails; fix before merge |
| < 0.60 | Structurally unfalsifiable | P0 block — tests are not checking the claim |

For falsifiers backing a published or auditable claim (compliance, thesis, SLA), the minimum is 0.80 before the claim is considered proven.

---

## Common Failure Modes

1. **"Tests pass" but mutation score < 0.40.** Tests exercise the function but only assert it doesn't raise. Add assertions on return values and output shapes.

2. **Timeout multiplier too low.** Mutants time out and are counted as "killed" — inflating the score. Set `timeout_multiplier = 5.0` or higher for slow tests. A mutant killed by timeout is not a mutant killed by a meaningful test.

3. **Equivalent mutants accepted.** Some mutations produce code that is logically equivalent (e.g., `x + 0` → `x`). The tool counts these as survivors. Manually inspect surviving mutants before concluding the tests are weak — some survivors are correct.

4. **Mutation only on lines with test coverage.** Tools like mutmut only mutate lines that are covered by at least one test. Lines with 0 coverage produce 0 mutants — the uncovered code is invisible to mutation testing. Run `pytest --cov` first to find uncovered lines.

5. **CI runner missing toolchain.** Mutation fails at install time, not test time. Check runner prerequisites before concluding tests are broken.

6. **Running mutation against utility code instead of falsifiers.** Mutation budget is finite. Mutating `format_date()` or `build_filename()` while the decision boundary has no mutation coverage is wasted effort. Target falsifiers first.

7. **Ignoring timeouts as false signals.** A test suite that takes 90s per mutant should be fixed (test segregation) before mutation testing is meaningful. Don't interpret timeout-killed mutants as real coverage.

---

## Pre-Execution Research Step

Before running a mutation tool for the first time on a project, verify:

1. **Tool flags are real.** Check current docs (Context7 or `mutmut --help`, `stryker --help`, etc.). CLI flags change across major versions. Fabricated flags fail silently or with cryptic errors.

2. **Version compatibility.** Confirm tool version against your language runtime version. mutmut 3.x requires Python 3.10+; older versions differ.

3. **Quantitative claims in specs.** If a spec says "expected score ~85%," verify with current docs or a prior baseline. Don't treat spec numbers as ground truth without a source.

```bash
# Python: verify mutmut flags before using
mutmut --help | grep -E "paths|tests|timeout|runner"

# Check installed version
pip show mutmut | grep Version
```

---

## Anti-Patterns

- **Padding test count without targeting mutants.** Adding 10 tests that all hit the happy path improves test count but not mutation score.
- **Running mutation against utility code instead of falsifiers.** The decision boundary is the point.
- **Ignoring timeouts.** Timeout-killed mutants are not proof of test quality. Fix the speed problem first.
- **Trusting test pass count as a proxy for correctness.** This is the root cause of every mutation testing failure mode described in this doc.
- **Skipping test segregation for slow test suites.** Wall-clock doom: a single 90s integration test × 300 mutants = 7.5 hours before you see results.
- **Running mutation once and never again.** Falsifiers accumulate code changes. Add a nightly idle-queue job or CI gate so regression is caught before it compounds.

---

## References

- mutmut docs: https://mutmut.readthedocs.io/
- Stryker (JS/TS): https://stryker-mutator.io/
- PIT (Java): https://pitest.org/
- cargo-mutants (Rust): https://mutants.rs/
