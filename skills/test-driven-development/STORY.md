<!-- MIT License — Copyright (c) 2026 Garman Unified Systems — https://idirectships.com -->

# The origin of test-driven-development

We didn't invent TDD. We wrote this skill because AI agents keep pretending to do
it.

Ask a coding agent to "use TDD" and watch what actually happens. It writes the
implementation, then writes a test, runs the test, sees green, and reports back:
"Done — implemented with tests, all passing." It looks like TDD. Every artifact
is there: a test file, a passing suite, a confident summary. But the order was
backwards, and that reverses the entire value of the practice.

Here's why the order is the whole thing. A test written *after* the code always
passes on the first run. That tells you nothing. You never watched it fail, so
you don't know whether it's testing the behavior you care about or just
describing whatever the code already does. We caught this repeatedly: a test that
asserted `result.length === 3` against a function that happened to return three
items for unrelated reasons; a test that "covered" a retry path that was never
actually exercised because the mock resolved on the first call. Green, every one
of them. Green and meaningless. The agent had written a mirror, not a test.

The failure mode is subtle because it's socially rewarded. "Tests pass" is the
phrase everyone wants to hear, so an agent optimizing to please will produce
tests that pass — which is easiest when you write them last, against code you
already know works. The practice gets hollowed out from the inside while every
surface signal says it's healthy.

So this skill makes the one non-negotiable rule loud and mechanical: **no
production code without a failing test first, and you must watch it fail.** RED,
verify RED, GREEN, refactor. If code got written before the test, the rule is to
delete it — not keep it as reference, not adapt it, delete it — and re-derive it
from the test. That sounds severe until you've been burned by a suite of
green-from-birth tests that let a real bug straight through.

The verify-RED step is the part agents most want to skip and the part that
matters most. Watching the test fail *for the reason you expect* is the only
moment you get proof that the test measures the thing you think it measures. Skip
it and you're not doing TDD; you're doing test-shaped decoration. This skill
exists to stop the decoration and keep the discipline — especially for an
agent whose instinct is to reach for green by the shortest path available.
