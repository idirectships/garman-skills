<!-- MIT License — Copyright (c) 2026 Garman Unified Systems — https://idirectships.com -->

# The origin of neutral-audit

We built neutral-audit after noticing that the *question* we asked an agent
decided the answer before it read a single line.

"Find the bugs in this file" came back with bugs. "Is this code secure?" came
back with security issues. "Is this well written?" came back with praise. We ran
the same clean, boring, correct file through all three prompts and got three
different verdicts — not because the code changed, but because each prompt
carried an implicit contract about what a good answer looked like. An agent asked
to find bugs treats "no bugs" as a failure to deliver. So it delivers. It invents
a plausible concern to satisfy the shape of the request, and now you're chasing a
problem that was authored by your own phrasing.

This is upstream of every code-review mistake we'd made. We had a whole practice
for *filtering* false findings after the fact — argue about them, refute them,
referee them. But a lot of the noise never needed to exist. It was manufactured
at the prompt, by asking a leading question of a model that reads leading
questions as instructions. You can't neutrally evaluate code through a lens that's
already tinted.

So neutral-audit removes the lens. It spawns an agent with one job: observe and
report — not find problems, not confirm correctness. Read the code component by
component, say what each part does and how, note what genuinely stands out, and
if something *could* be an issue, report it as an observation ("this could break
if X") rather than a finding ("this is a bug"). If nothing stands out, say so
plainly — and "nothing stands out" is allowed to be the answer, which is the
whole point. There's no quota to fill and no premise to satisfy.

What you get back is a description of what's actually there instead of a
projection of what the prompt implied should be there. That turns out to be the
right *first* move: understand the code cold, then decide whether it's worth
hunting. We use it before a dedicated defect-finding pass (observe, then argue),
after context compaction (re-ground in what the code does before touching it), and any time
"what does this even do?" matters more than "what's wrong with it?"

The lesson was small and permanent: if you want to know what code does, don't ask
a question that already knows the answer.
