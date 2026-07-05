<!-- MIT License — Copyright (c) 2026 Garman Unified Systems — https://idirectships.com -->

# The origin of bug-hunt

We built bug-hunt after getting burned by a review that looked perfect.

We had handed a pre-production diff to a single capable agent and asked the
obvious question: *what's wrong with this code?* It came back with a clean,
confident list — nine bugs, each with a plausible explanation, each written in
the calm voice of something that had clearly thought it through. We started
fixing them. Two hours in, we realized most of them weren't real. A "race
condition" that couldn't happen because the calls were already serialized. A
"null deref" on a value the caller guaranteed. The findings were *plausible* —
and plausible is exactly the failure mode. An agent asked to find bugs will
find them whether or not they exist, because agreeing with the premise is the
path of least resistance. Single-pass review doesn't measure the code; it
measures the model's willingness to please you.

So we stopped trusting any one pass and made the agents argue.

The insight was to weaponize the sycophancy instead of fighting it. Point three
biased agents in three different directions and let the truth fall out of the
disagreement. A **Hunter** is told to over-claim — false positives are cheap,
missed bugs are not — so it surfaces everything. Each finding then goes to a
**Skeptic** that spawns in a *fresh context*, never having seen the Hunter's
confidence, and is scored to *refute*: it must construct the actual failing
input or admit it can't. Findings that survive refutation — and only those —
reach an **Opus Referee** that reads the code cold and renders the final call.

The fresh context is the whole trick. A skeptic that inherits the hunter's
reasoning inherits its bias. A skeptic that starts blank has to reproduce the
bug from scratch — and a bug you can't reproduce dies right there. That single
constraint is what turns a list of plausible findings into a short list of real
ones. bug-hunt is that argument, made repeatable.
