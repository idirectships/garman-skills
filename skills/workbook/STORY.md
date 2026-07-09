<!-- MIT License — Copyright (c) 2026 Garman Unified Systems — https://idirectships.com -->

# The origin of workbook

We built workbook after watching good decisions die in a chat log.

The pattern was always the same. We'd ask the AI to plan something real — a
migration, an architecture, a launch — and it would come back doing exactly what
we taught it to do: surface the tradeoffs. Seven of them. Each with two or three
options, each option with its own pros and cons, all stacked into one enormous
message. It was thorough. It was also unusable. By the time you'd read option C
of question 5, you'd forgotten what you decided on question 2. The choices
weren't hard because the thinking was bad; they were hard because you were being
asked to hold nine parallel decisions in your head at once, in a medium that
scrolls away the moment you reply.

And when you *did* reply — "okay, A, then B, skip the third one, and for the
database let's go Postgres" — that answer was now the only record of the
decision. It lived in the middle of a conversation that would be compacted,
cleared, or buried by the next thing. Ask again next week and nobody could point
to where it was decided or why. The reasoning had been done and then thrown away.

The mistake was treating a set of decisions like a paragraph. Decisions aren't
prose — they're a form. So we stopped answering questions inside the chat and
started rendering them as one.

workbook takes the questions the AI *would* have dumped into a message and emits
a single self-contained HTML page: every question with its teaching, every
option with collapsible pros and cons, the recommended choice marked, a notes
field and an ask-back field per question, a running decision log, and a progress
meter down the side. You open it, think at your own pace, and click one button
to generate a clean markdown summary you paste back. The AI reads your answers
and acts.

Two things fall out of that shape. First, the decision stops competing with the
reading — you see all nine at once, laid out spatially, and answer them the way
you'd fill out a form, not the way you'd win an argument. Second, the paste-back
is a *record*. The workbook file sits in the repo, dated and named; the summary
is durable text. The reasoning survives the session that produced it.

No CDN, no emoji, no motion, system fonts, warm-dark palette — because a decision
sheet should feel like an instrument, not a landing page. workbook is what
happens when you stop making people read their choices and start letting them
see them.
