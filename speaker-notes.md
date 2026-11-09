# Working with Claude 5 models: 5 rules: speaker notes

## 1. Less scaffolding. Better engineering.

The whole talk is on the right, as a diff, the format every engineer reads fluently. When the slide comes up it plays once: the old scaffolding lines turn into deletions, two lines of judgment are added, the stat bar shows minus eighty percent, and the evals line confirms no measurable loss. That is what Anthropic did to Claude Code’s own system prompt for the Claude 5 models. The diff is illustrative: the comment rule, the planning-docs rule and the replacement line are from Anthropic’s post; the rest stands in for the kind of rules that were removed. The five colours below are the five rules; each section of the deck uses its colour.

## 2. why

This is the number that frames everything. Anthropic’s Claude Code team found they were over-constraining the model, and some instructions even contradicted each other. They cut more than 80% of the system prompt and their coding evals did not get worse. The bar on the right shows the cut: the grey is what they removed, the cyan is what stayed. It plays once when the slide appears. If Anthropic can delete most of its own prompt, most of us can delete a good chunk of our CLAUDE.md files, skills and agent setups too.

## 3. One rule from each Anthropic guide

Here are all five rules, each with its own colour that carries through its section. Each comes from a separate Anthropic guide: the Opus 5.5 prompting guide, Thariq Shihipar’s post on context engineering, the skill authoring best practices, two posts on effort, and the Applied AI post on folding subagents into one agent. For each rule we’ll look at the principle and then a concrete example from a large C/C++ codebase.

## 4. A good prompt says what Claude can’t infer

A prompt is plain English; there are no fields to fill in. The rule is to say what Claude can’t work out on its own. Two things are always worth stating: the symptom, and how you’ll know it’s fixed. One phrase is worth adding: reproduce it first. Anthropic’s effort tests show that without it Claude sometimes edits the code before running the reproducer, and then can’t show that the fix worked. Everything else is optional: where to look saves Claude a search in a large repo, and evidence such as a ticket or a log only helps if Claude can’t see it. The second prompt is the same request in a repo whose CLAUDE.md already lists the test commands: “fix and retest” is enough, because Claude knows what retest means there.

## 5. Brief Claude like a brilliant new hire, then let it run

The prompting guide says Claude 5 models do best when they get the complete task up front and are left to run. If you feed the job one step at a time, Claude only ever knows the next step and you end up babysitting. Spend your words on what a capable new hire couldn’t guess: your client, your numbers, your conventions. And delete the double-check and think-carefully lines. They made sense for older models, but now they just add cost and latency. For ambiguous work, ask Claude to interview you first.

## 6. One bug, two prompts

Rule one on a real C++ bug. The vague prompt makes Claude guess everything. The complete brief names the symptom, the file and function, asks for a failing test first, and defines done as ctest -L rt passing. That last part matters most in a large codebase: Claude can verify its own work instead of declaring victory. And if Claude stops before the tests pass, you don’t retype the task: it’s already in the conversation, so a goal with just the end condition keeps Claude working turn after turn until it holds. The next slide explains exactly how that works and when you should not use it.

## 7. /goal: keep working until a condition holds

Slash goal turns your definition of done into a loop. You give it the task and when it’s done; Claude starts working; after every turn a small, fast model reads the conversation and decides whether the condition holds, isn’t there yet, or is impossible. The important detail: that evaluator doesn’t run commands or read files. It only sees what Claude surfaced in the conversation, so the condition has to be something Claude’s own output demonstrates, like a ctest summary. Always bound it with a turn limit. If the task is already in the conversation, for example Claude stopped with three tests still failing, the goal only needs the end condition. Use it for long work with a checkable end state, like a migration. Don’t use it for quick interactive edits, for vague conditions like “robust”, or when you need a hard guarantee: that’s what a Stop hook running the real check, or CI, is for.

## 8. /goal vs. “keep going” in a normal prompt

A fair question: why not just write “keep going until ctest passes” in a normal prompt? The difference is who decides the work is done. In a normal prompt, Claude decides as it ends its turn, and it can still stop early, with a progress summary or a “should I continue?”. Then the session waits for you. With /goal, the goal lives outside the conversation as a Stop hook: after every turn a separate small model checks the condition, and if it isn’t met, Claude Code starts the next turn on its own. For a bug fix you’re watching there is little difference. For a long job you walk away from, it’s the difference between coming back to a finished migration and coming back to “should I continue?”. There are two ways to run it. From a fresh start, the goal carries both the task and when it’s done. As a rescue, when Claude has stopped with failing tests, the task is already in the conversation, so the goal only needs the end condition. And remember: both still rely on a model reading the log. If you need a guarantee, use a Stop hook that actually runs ctest.

## 9. Two rules clash. One line of judgment replaces both.

A real clash Anthropic found in Claude Code. The old system prompt said “leave documentation where appropriate”, a skill said “DO NOT add comments”, and both applied to the same line of code. Claude can usually work out what you meant, but it has to reason harder every time. The fix was not a third rule: Anthropic deleted both and put one line of judgment in Claude Code’s system prompt: write code that reads like the surrounding code. The panel on the right answers the obvious question, where does that line live? Not in your files, and not just in training. It’s part of Claude Code’s built-in system prompt, written by Anthropic and sent with every request, so you never add it. Your layer, CLAUDE.md, rules and skills, should only add real standards Claude can’t infer, such as a MISRA C++ rule set for the real-time code, and never competing style rules that recreate this clash.

## 10. Pages of examples vs. a precise interface

Bloat, made concrete. Top row is what Anthropic did inside Claude Code. TodoWrite is the built-in tool Claude uses to keep its own checklist while it works. Its description used to run to about nine thousand one hundred characters of when-to-use lists and worked examples; the excerpt is illustrative of that style, not the exact text. Today it’s one line, an enum of three statuses and one rule. Bottom row is the same move in a C++ repo. The old review skill pastes six past reviews: about 250 lines loaded on every run, and they quietly tell Claude which bugs matter, so it hunts for allocations and non-atomic indices because that’s what it was shown. The new skill splits two things the examples were mixing. What to look for goes into a rules file, .claude/rules/rt.md, RT-1 to RT-5, read only when needed. How to report is a four-line contract: file and line, rule ID, fix, and what to say when there’s nothing. Look at the output: the third finding is a mutex in the callback, a bug type no example showed, caught because it’s in the rules. And because the format is fixed, you can grep it or fail CI on any RT-1. One short example of the output format is fine; many examples of content act as a hidden scope limit.

## 11. One rules file. It loads when Claude opens real-time code.

Here’s the full rules file, and exactly when Claude sees it. It lives in .claude/rules/rt.md. The green block at the top is YAML frontmatter, and it is the only thing that controls loading: a paths glob for C and C++ files under src/rt. The hash line below it is just a Markdown heading for readers. The body holds what Claude can’t infer about our project: what counts as the audio thread, what each rule ID means, the exceptions, our own building blocks, and what is not a finding. No C++ examples: Claude already knows push_back can allocate. On the right, four prompts in a session started at the repo root. Fixing a Python tool never touches a matching file, so the rules never load and cost nothing. Debugging the audio dropout, Claude reads device.cpp: the rules load at that moment and stay in context for the rest of the session. Running the review skill on mixer.cpp also opens a matching file, so the rules load, and the skill’s output contract points to this same file, so there’s one source of truth. Just asking what’s in src/rt lists the folder but opens nothing, so the rules aren’t loaded yet. And if you leave out the paths field entirely, the file loads at launch in every session, exactly like CLAUDE.md.

## 12. Four places. Each decides when the rules load.

Where should the rules file live? The location decides when it loads. The recommendation is a path-scoped rule in .claude/rules with paths set to src/rt: it loads whenever Claude reads or edits real-time code, so it guides writing as well as reviewing. You can instead keep it inside the skill folder, where it’s read only when the review skill runs, which suits rules that only reviews need. A skill can also live in a folder’s own .claude/skills, so it’s offered once Claude works in that folder. To share across repositories, ship it as a plugin, or put it in your home .claude folder if it’s just for you. Two last points. Keep one copy: the skill’s contract points to the rules file rather than duplicating it. And there’s no per-model version: the rules describe our code, so the same file works whichever model runs.

## 13. Six habits to drop, and what replaces them

A common question on this slide: do I need to write the right-hand column into my prompt? No. These are changes in how you write your files. Judgment is the model’s default behaviour on Claude 5; the old hard rules were overriding it, so you delete them and add nothing. The same goes for diary-style notes in CLAUDE.md: Claude Code’s auto-memory saves what’s relevant on its own. The other rows are things you do: describe interfaces precisely instead of pasting examples, move detail into skills and path-scoped rules so it only loads when needed, say each thing once, and point Claude at real headers and tests instead of writing prose specs.

## 14. CLAUDE.md: spend it on gotchas

The test is simple: for each line, could Claude find this by reading the code, and would it actually go and look? If both answers are yes, the line is wasted context. “Write clean modern C++” is obvious; “this project uses CMake” is visible from CMakeLists.txt; the shouting adds nothing. What stays is what Claude can’t safely infer: the exact build preset, the fast test label, that generated/ is produced by a script and must not be edited, and that the wire format is big-endian. This test is a judgement call, not a tool. If you’re unsure about a line, delete it, start a fresh session and run a typical task. If Claude still gets it right, the line can go.

## 15. Three commands to audit your context

Three commands, each with a clear job. Slash context all shows what’s actually in the context window, including which CLAUDE.md, rules and memory files were loaded; it doesn’t change anything. Slash doctor is a setup checkup: installation, settings, extensions such as skills and MCP servers weighed against their context cost, and CLAUDE.md content that Claude could derive from the code. It reports first and only changes files after you confirm. Slash doctor prompt-audit is the one for this rule: it looks for instructions written for older models, references to files or commands that no longer exist, and files that contradict each other, and proposes the edits as a diff. Nothing changes until you ask. A good habit: run this routine every time you move to a new model.

## 16. Layer instructions by where they apply

Three layers, each loading only where it applies. The root CLAUDE.md is loaded at launch, so it holds only repo-wide facts: the build preset and the rule about generated code. drivers/CLAUDE.md loads the first time Claude reads or edits a file under drivers/, so register-access and ISR rules cost nothing while Claude works on the audio path. The real-time rule lives in .claude/rules/rt.md with a paths glob. To answer the obvious question: yes, every markdown file under .claude/rules is discovered, including subfolders. A rule without a paths field loads at launch, just like CLAUDE.md. A rule with paths only loads when Claude reads, writes or edits a matching file, here any C or C++ file under src/rt.

## 17. What loads when: one request, step by step

Here is exactly what loads, and when, for one real request. The session starts at the repo root: only skill descriptions are in context. You ask for a soft-clip stage in mix_callback. When Claude opens src/rt/mixer.cpp, the rt-safety skill that lives in src/rt/.claude/skills becomes available, because nested skills load the first time Claude touches a file in their folder. Its description fits the task, so Claude invokes it, and only now does the SKILL.md body enter context. Step one says run the lint script: Claude executes it and sees one line of output, not the script’s code. The output reports an allocation in the real-time path, so step two applies and Claude reads the lock-free reference file. It fixes the code and re-runs the script: zero findings. The latency budget file and the benchmark script were never loaded, because no step needed them. The context bar on the right shows how little this costs.

## 18. A skill is a table of contents, not an encyclopedia

Skills load in three layers. Only the name and description are always in context, and Claude uses the description to choose among possibly a hundred skills, so it must say what the skill does and when to use it. SKILL.md loads when the description fits the task, and should stay under five hundred lines, acting as a table of contents. Reference files load only when a step needs them; scripts are executed and only their output enters context. On evals first, the question I get: yes, it means try the task without the skill first. Run three typical tasks, write down where Claude actually goes wrong, write the minimum that fixes those gaps, and rerun the same tasks with the skill to confirm it helps. If Claude already gets them right, you don’t need the skill.

## 19. A skill that lives next to the code it serves

To answer the question directly: yes, any directory can have its own .claude/skills folder. A skill in src/rt/.claude/skills is picked up the first time Claude reads or edits a file under src/rt, or right away if you start Claude in that directory. Inside the skill, SKILL.md is the short map: a description that says what it checks and when, and numbered steps. The reference folder holds documents for specific steps; Claude reads lockfree.md only when step two applies. The scripts folder holds tools that SKILL.md tells Claude to run, like the real-time lint script; Claude executes them, and only their output enters context. That’s exactly the walkthrough from the sheet two slides back.

## 20. Group skills by workflow. A group loads only when it’s used.

A question that came up: can we tell Claude to load a set of skills only for building and testing, and another set only for coding? You don’t need an index file for that, because skills already load on demand. The pattern is one skill per workflow group. The build-test folder has a short SKILL.md that acts as the group’s entry point, and the details live in files beside it: build, unit tests, hardware tests, flaky tests. When someone says the latency test fails on the bench rig, the description matches, SKILL.md loads, and it sends Claude to hw-tests.md and nothing else. Nothing in the coding group loads at all. A side benefit: at startup Claude sees two descriptions instead of twenty. One rule on naming: only a file called SKILL.md inside its own folder under .claude/skills is a skill. Other files in that folder can have any name; they are read when SKILL.md sends Claude there.

## 21. Choose by what should trigger the loading.

There are four ways to load guidance only when it’s needed, and the choice depends on what should trigger it. A group skill loads when the task matches its description, or when you type its name; use it for workflows. A path rule loads when Claude reads or edits matching files; use it for conventions tied to code, like our real-time rules. A plain pointer line in CLAUDE.md also works: Claude follows it and reads the file when needed, but it isn’t a command and can’t be shared as a plugin, so keep it for documents that aren’t workflows. A plugin packages skill groups so several repos can share them. Two notes. Don’t write a router skill that says “real-time skills are over there”: the descriptions already do that routing. And skills can hand off to each other: one skill can name the next step, for example run rt-review after a fix.

## 22. sheet-effort

Sheet four is a test rig. On the left, the effort gauge. On the right, the specimen: a real task from Thariq’s Terminal-Bench analysis, fixing a storage-engine crash without breaking compaction. On low, the inspection pass covers a sliver of the code and finds nothing; it passed zero of five tries in about a minute each. Then the needle moves to xhigh. The scan covers everything and catches three edge cases: it reproduced the crash first, tested against a reference that never compacts, and checked its tests fail on half-finished fixes. Four of five, about eleven minutes per try. The fourth mark stays grey on purpose: a wrong approach is not an effort problem.

## 23. Effort buys thoroughness, not intelligence

Lydia Hallie from the Claude Code team puts it simply: the model sets how capable Claude is, effort sets how thorough it is. Effort controls how many files it reads, how much it checks, and how far it goes before checking in. Thariq’s tests show the cost: the same vague prompt took a minute and a half on low and 67 minutes on max. They also show where it pays: on a data-analysis task, low passed zero of five, high passed four of five, because it tried two methods and caught the mismatch.

## 24. Where higher effort pays off

This chart is from Thariq’s deep dive into Terminal-Bench 3.0. Higher effort helps most where there are lots of hidden edge cases: hardware went from 34 to 75 percent, security from 64 to 87. Rulebook-style operations work barely moves. The lesson for us: put effort on the steps where mistakes hide, like checking numbers or security-sensitive code, not on formatting an email. Note this is Fable 5.1 data from Anthropic’s own runs.

## 25. Match the level to the step

Here is a practical rule of thumb from Thariq’s post, and the loop he uses for feature work. Have Claude interview you about the spec, build on low effort so you get a fast first version, review and iterate on low, then switch to high effort to verify and test. In a report workflow that means: formatting and the email on low, the write-up on medium, and the number check on high, because that is where hidden edge cases live.

## 26. Same bug fix, two effort levels

This is a real task from Thariq’s Terminal-Bench analysis: fix a storage-engine crash from its crash report without breaking compaction. On low effort, Claude edited the code before even running the reproducer, and never checked that its new test would have caught the original bug. Zero out of five. On xhigh, it reproduced the crash first, wrote a randomized test against a reference implementation that never compacts, and checked that its tests fail on half-finished fixes. Four out of five. That is exactly the kind of hidden-edge-case work where effort pays. The bottom strip is the docs’ guidance for everyday work in your own repo.

## 27. Wrong result? Ask one question

Lydia Hallie’s diagnostic is the most useful single idea in the effort posts. When the output is wrong, check the context first. Then ask: did it not try hard enough, or did it not know enough? Skipping a file or not running tests means it didn’t try hard enough, so raise the effort. If it had everything, clearly tried and still got it wrong, it didn’t know enough, so move up to a bigger model.

## 28. sheet-agents

Sheet five shows two pipelines carrying the same work item, the block with six details on top. Lane A is the org chart: data puller, analyst, writer, checker. Watch the details fall off at each handoff. By the end it has lost four of six, which is the lossy-summary problem the Applied AI post describes. Lane B is one agent with skills, tools and a single context window, plus a reviewer that checks the result without seeing how it was made. All six details arrive, verified. The table on the right sums it up, including the one hard number: one customer measured about two times faster runtime with a single loop.

## 29. One agent with skills first

The org chart builds in on its own: data puller, analyst, writer, checker. Then click. This is the common mistake: turning the team structure into agents, where every handoff loses detail. Click again for the finding: a single agent with skills frequently beat both one giant prompt and a team of subagents. Frequently, not always. And click once more for when subagents still earn their place: measured context overload, parallel work that needs fresh context, or an agent with too many tools or clashing instructions.

## 30. Verification is where subagents earn their place

Here is rule five at real scale. Anthropic’s monorepo went from about 2,500 changes a day in May to more than 30,000 in September, most of them written with Claude. The Claude Code team rebuilt review around that: automated checks and AI review first, humans for the risky calls. Substantive review comments went from 16 to 54 percent of PRs, and the average rounds to pass dropped from 2.08 to 1.32. They also turned past incidents and reverts into an eval set and score every reviewer change against it. For your repo, two concrete pieces: a read-only reviewer subagent that never saw how the code was written, and a Stop hook that won’t let Claude finish until the type check passes. That’s the subagent pattern that holds up: verification, not an org chart.

## 31. Test before you trust it

Before you trust a simpler setup, test it. The Applied AI post says even ten golden examples are enough to start. Run each one more than once: in their test, one breakage only showed up in one run out of two. And fold in one agent at a time. For balance: Anthropic’s own multi-agent research system shows where teams of agents do win, on broad parallel research, but at roughly fifteen times the token cost of a chat. It doesn’t suit work that shares context, or most coding.

## 32. Your 30-minute setup audit

Here is something concrete to do this week. Pick one workflow you use every week and run through these ten checks. In the worked example behind this deck, a weekly client report went from four messages to one, its CLAUDE.md went from about 250 lines to 35, the skill from 400 always-loaded lines to 80 plus three on-demand files, and four agents became one plus a fact-checker called as a tool.

## 33. close

The thread running through all five guides: the models got better, so Anthropic keeps deleting the structure it built for older ones. Each new model lets you move more of the decision-making out of your prompts, rules and agents and into the model itself. But not to zero: gotchas, parallel jobs and verification still earn their place. The focus document has more detail and links to every source.

## 34. beyond

That’s the end of the five rules. What follows is a short chapter of our own, outside that scope: how to structure Claude around a codebase our size, with hundreds of thousands of source files. It comes from a question our team keeps asking. If the new guidance says to delete diary notes, do per-module design docs still make sense? Five slides answer it: why diary notes and design docs are different things, what a good module CLAUDE.md contains, how to lay them out at scale, how deep they should go, and when to update them and who approves. To be clear, these are our recommendations built on how Claude Code loads files, not part of Anthropic’s guidance.

## 35. Delete the diary. Keep the design.

This is the distinction behind the “diary notes” row in Rule 2, and it matters a lot in a codebase our size. Diary notes are session history: what you fixed yesterday, what to do next time, what you tried and reverted. They go stale in days, and Claude Code’s auto-memory now keeps the useful parts on its own. So delete them from CLAUDE.md. A module design summary is a different thing: why the module is built the way it is, its timing and threading invariants, what must not change. That stays true as long as the design does, and Claude cannot recover it from the source. And auto-memory is no substitute: it lives on each engineer’s machine, it never goes through review, and it only knows what came up in that person’s sessions. It will never learn the rationale from the engineer who left two years ago. Team knowledge belongs in the repo.

## 36. Write the intent. Claude reads the code itself.

Here is what a module design summary should look like. Sixteen lines for the mixer, and every one is something Claude can’t get by reading mixer.h. Invariants: the timing budget and the rule that channel changes come through the ring buffer; you can’t see a 0.5 millisecond budget in the source. Why: per-sample gain smoothing exists because per-block caused zipper noise; without that line, Claude may well simplify it back into the bug. Don’t: the legacy mixer looks dead but must stay for the plugin ABI. Verify: how Claude checks its own work here. What’s left out matters as much. No list of classes and methods: Claude reads the header better than a summary describes it, and when the summary goes stale, Claude trusts the wrong thing. The test for every line is simple: could Claude learn this from the headers and tests? If yes, delete it.

## 37. One CLAUDE.md per module. It loads only there.

How this scales to a repository with hundreds of thousands of files. One CLAUDE.md per module boundary, not per folder. The root file holds build commands and repo-wide rules; the real-time rules live in a path-scoped rule. Each module’s CLAUDE.md loads only when Claude reads files in that module. So when someone asks why the mixer drops samples under load, Claude opens mixer.cpp and has exactly three files of guidance in context: the root CLAUDE.md, the RT rules and the mixer’s own file. Networking, UI, DSP and device notes cost nothing. Third-party code gets none. On the right, how to keep them true. Choose the granularity by asking whether a new senior engineer would need to be told. If you already maintain DESIGN.md files, don’t duplicate them: a short one can be imported with an at-sign, and a long one should just be mentioned by path, as the next slide shows. Claude drafts updates in the same change as a design change, and the module owner approves them; slide E covers that. And run /doctor prompt-audit regularly to catch stale instructions and references to files that no longer exist.

## 38. As deep as what Claude would get wrong. No deeper.

The first big question: how deep should a design file go? The answer is a test, not a number: as deep as what Claude would get wrong after reading the code, and no deeper. That splits the knowledge into four levels. The system level, the module map and which thread owns what, goes in the root CLAUDE.md, about ten lines. The module level is what we saw on slide B: intent, invariants, why, don’t, verify, ten to thirty lines. Function-level reasons belong in a comment next to the code, not in markdown. And the full design rationale, with history and measurements, can be as long as you like, as long as it doesn’t load every time. That is the important detail at the bottom. An at-sign import loads the whole file every time the module’s CLAUDE.md loads, which is fine for twenty lines and wasteful for fifteen pages. For a long design doc, just mention its path and say when to read it; Claude reads it only when the task needs it.

## 39. Update it when a line becomes wrong. Claude proposes, a human approves.

The second big question: when should a module file be updated, and can Claude do it without a human? Update it when a change makes one of its lines wrong or leaves something out. A changed timing budget, a change in which thread owns the mixer, a new path with its own constraint, or a Don’t that no longer applies: all yes. A new method inside the existing design, a refactor or a bug fix that keeps the invariants: no update. As for who: Claude should draft the update itself, in the same change, but a human approves it. Four pieces make that work. One line in the root CLAUDE.md tells Claude when to update and what not to write. CODEOWNERS makes the module owner approve every edit to that file. Optionally, a small design-check skill compares the branch diff with the touched modules’ files before the PR goes up. And /doctor prompt-audit each release catches the rest. Why not let Claude commit it alone? Because every future session trusts that file. Auto-memory is private, so Claude can write it alone. A module CLAUDE.md is team knowledge, so it’s reviewed like code.
