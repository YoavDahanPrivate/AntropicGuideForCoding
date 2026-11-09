# Working with Claude 5-generation models: research brief

*Status: raw research for review. Not yet the colleague-facing focus doc or the deck.*
*Compiled 2026-11-04.*

---

## 0. The video

- **Title:** "Anthropic Just Revealed 5 New Rules for Prompting Claude 5 Models"
- **Channel:** Bart Slodyczka
- **Link:** https://youtu.be/MuiIkA7uzzM
- **Format:** He takes one example setup and fixes it one guide at a time. The setup is a "Monday client report" built on a 250-line CLAUDE.md, a 400-line skill with pasted examples, max effort on every job, and 4 chained agents.
- **His checklist (from the video description):**
  1. Prompting: give the whole job in one message, and delete "double-check" lines.
  2. Context: run `/doctor`, and cut CLAUDE.md down to the gotchas.
  3. Skills: move reference material into linked files one level deep, and write a "use when" description.
  4. Effort: default to medium. Draft on low, verify on high.
  5. Agents: fold one agent into a skill, then test on 10 examples, twice.
- **Before → after in his example:** 4 messages → 1. CLAUDE.md 250 → ~35 lines. Skill 400 lines → ~80 lines plus 3 on-demand files. Max effort everywhere → effort per job. 4 agents → 1 agent plus a fact-checker it calls as a tool.
- **Common thread:** each new model lets you remove scaffolding. The setup should shrink with every model upgrade, but not to zero, because gotchas and parallel jobs still earn their place.
- Chapters: 0:00 intro · 0:50 the example setup · 1:23 Guide 1 (prompting) · 3:06 Guide 2 (context) · 5:18 Guide 3 (skills) · 7:06 Guide 4 (effort) · 9:01 Guide 5 (agents) · 11:00 recap · 11:46 checklist

---

## 1. The five sources the video quotes

The sources are numbered in the order the video covers them. Each entry lists what the source says, and how well the video's claims match it.

### Source 1: Prompting guides for Opus 5.5 and Opus 5 (Anthropic docs)

**Pages:**
- [Prompting Claude Opus 5.5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5)
- [Prompting Claude Opus 5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5) (the 5.5 page says it is still a reasonable starting point)
- [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices) (the general page)
- [Effort](https://platform.claude.com/docs/en/build-with-claude/effort)

None of these pages shows a date. They are living docs.

**Summary:**
- **Give the whole task up front.** The Opus 5 guide says the model performs best with the complete task specification up front, then left to run. Feeding it one step per message works against it.
- **Treat Claude as a brilliant new hire.** The general best-practices page says Claude is capable but lacks context on your norms and workflows. Spend your words on what is specific to you. Explain the reason behind each instruction. Use the "colleague test": would someone with no context understand the prompt?
- **Stop asking it to re-check.** The model already self-corrects. Instructions such as "double-check your answer" or "re-verify" add cost without improving results. The Opus 5 guide also says to remove explicit verification steps and verifier-subagent instructions, which cause over-verification.
- **Remove "think carefully" lines.** The 5.5 guide reports that removing one from a chat product made replies start sooner, with no clear drop in quality.
- **Effort:**
  - Opus 5.5 defaults to **medium**. Opus 5 defaulted to high.
  - Opus 5.5 at medium matches or beats Opus 5 at high on Anthropic's coding and knowledge-work evals.
  - Reserve xhigh and max for work where you have *measured* a quality gain.
  - Thinking cannot be turned off on Opus 5.5. To get less thinking, lower the effort.
- **Opus 5 behavior to correct by prompt:**
  - It tends to widen scope. Fix it with an instruction like "deliver what was asked, at the scope intended."
  - Its answers run long, and lowering effort does not reliably shorten them. Ask for brevity directly.
  - It narrates its steps a lot.
  - It delegates to subagents readily. Fix it with an instruction like "don't delegate what you can finish in a handful of tool calls."
  - For code review, don't say "only report high-severity issues", because the model may follow it literally and miss things. Ask for everything, then filter in a separate pass.
- **Unattended agents (Opus 5.5):**
  - Treat a text-only end of turn as a progress report, not proof that the task is done.
  - Keep a checklist, and send a short continuation message if items are still open.
  - Cap automatic continuations at 2–3.
  - Wait for background work to finish before calling the task done.
- **Other general guidance:** put long documents *above* the question (up to ~30% better results on complex multi-document input). Use 3–5 examples in `<example>` tags when examples are needed.

**Fact-check of the video:** ✅ All claims match the docs: the full task up front, the brilliant new hire, removing double-check lines, the think-carefully experiment, and starting at medium.

---

### Source 2: "The new rules of context engineering for Claude 5 generation models"

- **Author:** Thariq Shihipar (Claude Code team, Anthropic)
- **Date:** Jul 24, 2026
- **Link:** [claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models](https://claude.com/blog/the-new-rules-of-context-engineering-for-claude-5-generation-models). It redirects to claude.dev.

**Summary:**
- **The headline:** Anthropic removed more than 80% of Claude Code's system prompt for Claude Opus 5 and Fable 5 models, with no measurable loss on their coding evals. The post does not describe the evals.
- **What "context" covers:** the system prompt, skills, CLAUDE.md, memory and other sources, plus references such as files, specs and mockups.
- **The problem: conflicting instructions.** Real Claude Code transcripts showed the system prompt saying "leave documentation as appropriate" while a skill said "DO NOT add comments." Claude can usually work out which one you meant, but it has to reason harder to do it, and that costs time. Many constraints could simply be deleted.
- **Six "then → now" shifts:**

  | Then | Now | Example from the post |
  |---|---|---|
  | Give Claude rules | Let Claude use judgment | "Comments: one short line max" became "match the surrounding code's comment density, naming, and idiom" |
  | Give Claude examples | Design good interfaces | Examples constrain Claude to a narrow exploration space. The TodoWrite tool description shrank from ~9,100 characters to one line, a 3-value status enum, and one rule |
  | Put everything up front | Progressive disclosure | Verification and code review moved into skills. Some tools are deferred and found on demand through ToolSearch |
  | Repeat yourself | Simple tool descriptions | Duplicate tool references were removed from the system prompt |
  | Memory in CLAUDE.md | Auto-memory | Claude now saves relevant memories by itself |
  | Simple specs | Rich references | HTML artifacts, test suites, code to port, and rubrics for verifier agents |

- **CLAUDE.md guidance:** keep it lightweight. Say briefly what the repo is for. Spend most of the tokens on **gotchas**, the things Claude would get wrong without being told. Don't state what Claude can see from the repo. Don't turn it into a store of every practice. Point to skills instead.
- **Skills:** treat them as lightweight guides that encode *your* team's opinions and knowledge. Split long skills into several files. Don't over-constrain them except in high-stakes areas.
- **Tooling:** run `/doctor` in Claude Code to resize your skills and CLAUDE.md files.

**Fact-check of the video:** ✅ All claims match: the 80% cut, the conflicting-instruction example, the comment rule, the examples point and the TodoWrite ~9,100 characters, auto-memory, gotchas, and `/doctor`. The video misspells the author's name ("Tharic Shihipar").

---

### Source 3: "Skill authoring best practices" (Anthropic docs)

- **Link:** [platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- **Date:** none shown on the page

**Summary:**
- **Opening principle:** good skills are concise, well-structured, and tested with real usage. The context window is shared, so assume Claude is already smart and add only what it lacks.
- **Three loading levels (progressive disclosure):**
  1. At startup, only each skill's name and description load.
  2. SKILL.md is read when the skill becomes relevant.
  3. Extra files are read, or scripts run, only as needed. A script's code never enters context; only its output does.
- **Size:** keep the SKILL.md body **under 500 lines**. SKILL.md should work like a table of contents in an onboarding guide.
- **Keep references one level deep from SKILL.md.** With nested files, Claude may preview them partially (for example with `head -100`) and miss content. Give any reference file over 100 lines its own table of contents.
- **Descriptions:** the description is always loaded, and Claude uses it to choose among potentially 100+ skills.
  - Say *what* the skill does and *when* to use it.
  - Write in the third person.
  - Bad examples from the page: "Helps with documents," "Processes data."
  - Limits: name up to 64 characters, description up to 1,024 characters.
- **Degrees of freedom:** give loose heuristics where many approaches are valid (for example code review). Give exact scripts where operations are fragile (for example database migrations). The page's image: a narrow bridge with cliffs calls for guardrails, an open field calls for general direction.
- **Workflows:** use copyable checklists and validate → fix → repeat loops. For batch or destructive operations, plan, validate, then execute.
- **Evaluations come first.**
  1. Run Claude without the skill to see where it falls short.
  2. Write about 3 test scenarios.
  3. Measure a baseline.
  4. Write minimal instructions.
  5. Iterate.

  A common pattern is two Claude instances: "Claude A" writes the skill and "Claude B" tests it.
- **Test on every model you plan to use.** Haiku may need more detail. Opus may be over-explained.
- **Scripts:** handle errors inside the script rather than leaving Claude to improvise. Avoid unexplained "magic" constants. Prefer scripts for deterministic operations.

**Fact-check of the video:** ✅ All claims match: concise, well-structured, tested; the 500-line limit; three layers; table of contents; one level deep with `head -100`; "use when" descriptions; "Helps with documents." The `/skill-doctor` mention comes from Source 5, not this page, and the video says so correctly.

---

### Source 4: Two articles on effort

**4a. "Choosing a Claude model and effort level in Claude Code"**
- **Author:** Lydia Hallie (Claude Code team). The video calls her "Lydia Hi".
- **Date:** Jul 7, 2026
- **Link:** [claude.com/blog/claude-model-and-effort-level-in-claude-code](https://claude.com/blog/claude-model-and-effort-level-in-claude-code)

**Summary:**
- **Model vs. effort:** the model sets roughly *how capable* Claude is. Effort sets roughly *how thorough* it is: how many files it reads, how many tools it uses, how much it checks, and how far it goes before checking back in with you. Effort is not just "thinking time," and it doesn't make Claude smarter.
- **Use the model's default effort for most tasks.** Higher effort won't inflate usage on simple tasks. Anthropic watches for overthinking in training because it hurts results.
- **The diagnostic question:** first check the context (is the prompt clear, are the tools connected, are the skills present). Then ask: *did it not try hard enough, or did it not know enough?*
  - It skipped a file, didn't run the tests, or didn't double-check → **raise effort.**
  - It had everything it needed, clearly tried, and was still wrong → **use a bigger model** (for example Sonnet → Opus).
- **Which model for which work:** larger models suit subtle bugs, unfamiliar domains and architecture decisions. Smaller models suit edits you can describe precisely.

**4b. "Using Claude Code: Spending your effort"**
- **Author:** Thariq Shihipar
- **Date:** Sep 25, 2026
- **Link:** [claude.dev/blog/spending-your-effort](https://claude.dev/blog/spending-your-effort) (also posted as an X article)

**Summary:**
- **What effort does:** effort mostly controls how much verification, edge-case testing and independent judgment Claude applies. The post's analogy: if you're given 12 hours you try very hard; if you're given 1 hour you deliver a good first version and expect to iterate.
- **The fitness-tracker experiment.** Prompt: "build a personal fitness and workout tracker app," run at each level on Opus 5.5.

  | Effort | Time | What it produced |
  |---|---|---|
  | Low | 1.5 min | A log and a simple graph |
  | Medium | 4 min | |
  | High | 11 min | |
  | Max | 67 min | Much richer, including a heat chart |

  - With a **detailed spec** (Claude interviews the user first), the levels converge: 16 / 22 / 33 / 79 min, with similar designs.
  - On a /config menu redesign: low took 1 minute and produced a rough sketch. Max took 28 minutes and produced a polished mockup with walkthroughs.
- **The Terminal-Bench 3.0 findings:**
  - Higher effort pays off most on tasks with **many hidden edge cases**.
  - It reduces "missed a case" failures. It does *not* fix "wrong approach" failures.
  - Fable 5.1 went from 140 to 214 passes out of 370 attempts between low and max.
  - **gsea-proteomics** (data analysis) is the task the video cites: Opus 5.5 scored 0/5 on low and 4/5 on high. On low it prepared the data one way and reported the result. On high it tried two ways, noticed the results disagreed, and worked out why.
  - Other tasks: an HTML sanitizer went from 1/5 to 5/5, and a storage-engine bug fix went from 0/5 to 4/5.
  - The categories that gain most from effort are Security (64% → 87%) and Hardware (34% → 75%). Operations gains least (12% → 22%).
- **His rule of thumb:**
  - **Low:** quick, in-the-loop work such as brainstorming, sketches and easy changes.
  - **Medium:** most regular software work.
  - **High:** work where verification matters or edge cases are likely, such as bug fixes in an existing codebase.
  - **Max:** fully autonomous hard problems, such as building and verifying a whole app end to end, or a security audit.
- **His workflow:**
  1. Give Claude the spec and have it interview you.
  2. Implement on low.
  3. Review, and iterate on low.
  4. Verify and test on high.

**Also referenced:** [Claude Code docs, Model configuration](https://code.claude.com/docs/en/model-config). Default effort is medium on Opus 5.5, Sonnet 5.5 and Haiku 5.5; high on most other models; xhigh on Opus 4.7. `max` applies to the current session only.

**Fact-check of the video:**
- ✅ Effort means "how much work Claude does."
- ✅ 1.5 vs. 67 minutes.
- ✅ 0/5 → 4/5. The video credits this result loosely; it comes from Thariq's post, not Lydia's.
- ✅ Hidden edge cases.
- ✅ Interview → low → review → high.
- ✅ Try-hard vs. know-enough.
- ⚠️ "Claude Code docs say max is prone to overthinking": we could see this wording only in a tool-extracted summary of the docs page, not in its verbatim text. Lydia's post does say overthinking hurts results.

---

### Source 5: "Building agents: When to fold subagents into your main agent loop"

- **Author:** Diane Sarkis. The text speaks for Anthropic's Applied AI team.
- **Date:** Oct 22, 2026
- **Link:** [claude.com/blog/building-agents-when-to-fold-subagents-into-your-main-agent-loop](https://claude.com/blog/building-agents-when-to-fold-subagents-into-your-main-agent-loop)

**Summary:**
- **Main finding:** across several enterprise deployments, a single agent with skills *frequently* beat both the "one giant prompt" design and the "team of subagents" design on quality, often at lower cost and latency. One customer saw roughly 2× faster runtime with a single loop.
- **Subagents still help with:**
  - verification, including **black-box verification** (checking work without seeing how it was made)
  - parallel work, such as independent research paths
  - modular permissioning
- **Anti-patterns:**
  - Architecture that copies the **org chart**. This is Conway's law: systems end up mirroring the teams that build them.
  - Handoffs that lose detail, like a game of telephone, where each call hands back a lossy summary.
  - Subagent sprawl, one example being a dozen specialists in a single customer-facing agent.
  - Nested loops that add latency.
- **Target architecture:**
  - One model, one context window, and an open-ended tool loop.
  - Turn and cost budgets enforced by the harness.
  - Procedures go in skills. Hard limits such as validation and approvals go in tools.
  - A suggested baseline: one clear system prompt, 4–5 thin data tools, and firm output guardrails.
  - Tool choice degrades beyond about 30–50 tool definitions, so use tool search with deferred loading.
- **Three ways to consolidate:**
  1. Merge specialists that chain on each other's output, touch the same data, or are usually called together.
  2. Call a subagent as a tool, so the main agent keeps the conversation.
  3. Fold a subagent into skills plus tools: its prompts become skills and its API calls become MCP tools.
- **Keep a subagent only when:**
  1. you can *measure* the single loop getting worse from context bloat,
  2. parallel tasks need fresh context windows you can throw away, or
  3. the agent struggles to pick the right tools, or its system prompt has conflicting instructions.
- **Evals:**
  - Even **10 golden examples** are enough to start.
  - Look at which individual tasks flipped, not just the overall score.
  - Run each task more than once. In one test, a break showed up in only 1 run out of 2.
- **Tooling:** `/skill-doctor` shows what each skill costs and how often it is used. Also mentioned: `/skill-creator`, the `/claude-api` eval and audit commands, and a migration kit at [github.com/anthropics/single-agent-loop-kit](https://github.com/anthropics/single-agent-loop-kit).
- **Closing principle:** each new model lets you move more decision-making out of the harness and into the model. Measure, change one thing at a time, and keep what holds up.

**Fact-check of the video:** ✅ All claims match: the date, "frequently not always," the org chart, context loss, 2×, the three consolidation patterns, the three keep-cases, black-box verification, 10 golden examples, 1 in 2 runs, and moving decisions into the model. Two small corrections:
- The byline is Diane Sarkis, not just "Applied AI team."
- The source says "several enterprise deployments," not "comparisons across companies."

---

## 2. Consolidated summary: the 5 bullets

1. **Prompting: brief Claude like a brilliant new hire, then let it run.** Put the whole job in one message: the goal, the audience, what good looks like, the inputs, and when it's done. Spend your words on what is specific to your situation, not general know-how. Delete "double-check" and "think carefully" lines, because the model already does this and the lines only add cost and latency. Correct known habits explicitly: scope creep, long answers, eager delegation. *(Source 1)*

2. **Context: less is more, and conflicts are expensive.** Anthropic cut more than 80% of Claude Code's own system prompt with no measurable loss on its evals. Replace rules with judgment, examples with good interfaces, and front-loading with progressive disclosure. Keep CLAUDE.md lightweight and mostly about gotchas. Let auto-memory replace diary-style notes. Use `/doctor` to resize your setup. *(Source 2)*

3. **Skills: a table of contents, not an encyclopedia.** Only a skill's name and description are always loaded, so the description must say what the skill does and when to use it. Keep SKILL.md under 500 lines. Move reference material into files linked directly from SKILL.md, one level deep. Write evals before writing long instructions, and test on every model you use. *(Source 3)*

4. **Effort: default to medium and spend more only where it pays.** Effort controls thoroughness (reading, checking, edge cases), not intelligence. A good loop is to draft on low and verify on high. High effort pays off on work with hidden edge cases, such as numbers, security and bug fixes, but it doesn't fix a wrong approach. When results are bad, ask: did it not try hard enough (raise effort), or did it not know enough (use a bigger model, or give it more context)? *(Source 4)*

5. **Agents: start with one agent plus skills; add subagents only for a measured reason.** A single loop with skills frequently wins on quality, cost and latency. Keep subagents for parallel work that needs fresh context, black-box verification, measured context bloat, or tool and instruction overload. Don't copy your org chart into the design. Fold in one subagent at a time and check it against at least 10 golden examples, running each more than once. *(Source 5)*

**Common thread:** each new model lets you delete scaffolding you built for the previous one. Re-audit your setup at every model upgrade. Keep the gotchas, the parallel jobs and the verification; delete the rest.

---

## 3. Additional sources (beyond the video), mapped to the bullets

| # | Source | Date | Bullet(s) | What it adds |
|---|---|---|---|---|
| A | [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) (Anthropic Applied AI) | Sep 29, 2025 | 2, 3, 5 | The theory behind bullet 2. Context is a finite "attention budget," and recall falls as context grows ("context rot"). Aim for the smallest set of high-signal tokens. Pitch system prompts at the "right altitude," between brittle if-else rules and vague guidance. Prefer a few diverse, canonical examples to a laundry list of edge cases. Retrieve just in time with glob, grep and head. Use compaction and structured note-taking for long tasks. Subagents return condensed 1–2k-token summaries. |
| B | [Writing effective tools for agents — with agents](https://www.anthropic.com/engineering/writing-tools-for-agents) (Ken Aizawa) | Sep 11, 2025 | 2, 5 | Use fewer, workflow-shaped tools (`search_contacts` rather than `list_contacts`). Namespace tool names. Return only high-signal fields, with a concise/detailed switch: 72 vs. 206 tokens, about ⅓. Claude Code caps tool responses at 25k tokens. Describe tools the way you'd explain them to a new hire. Small description fixes gave big gains. Evaluate tools on realistic tasks. |
| C | [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) (Erik S. & Barry Zhang) | Dec 19, 2024 | 5 | The classic: start with the simplest thing that works and add complexity only when needed. It distinguishes workflows from agents, and defines the five patterns: chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer. Design the agent-computer interface carefully: the team spent more time on tools than on the prompt, and made tools hard to misuse. *Older (2024); the page itself flags that tooling has changed since.* |
| D | [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) | Jun 13, 2025 | 5 (counterpoint) | **When multi-agent does win:** breadth-first research with many independent directions. It scored 90.2% higher than a single agent on an internal research eval. The cost is ~15× the tokens of a chat (a single agent is ~4×), so it suits only high-value tasks. It does *not* fit shared-context work or most coding. Scale effort to the query: 1 agent for simple facts, 10+ subagents for complex research. Started evals with ~20 real queries and an LLM judge. This supports Source 5's "keep subagents for parallel work" exception. |
| E | [Automating eval design and hillclimbing with Claude](https://claude.dev/blog/automating-eval-design-and-hillclimbing/) (Lance Martin) | Sep 28, 2026 | 3, 4, 5 | How to build the evals that bullets 3–5 rely on. Tasks should mirror production. Leave headroom (the top model should score well below 100%). Start with 5–10 hand-written cases plus production transcripts. Use rubrics of checkable claims, not 1-to-5 scales. Make one change per round, keep a held-out test set, and check that noise is smaller than the improvement. A worked example: **Opus 5.5 on low effort scored 87.8% at 1.9¢, versus Opus 4.8 on high at 74.4% for 4.6¢**, which backs up bullet 4. |
| F | [Best practices for Claude Code](https://code.claude.com/docs/en/best-practices) (docs) | living doc | 1, 2, 4, 5 | A two-question test for each CLAUDE.md line: could Claude find this by reading the code, and would it actually look? If both answers are yes, cut the line. Keep in CLAUDE.md only verification commands, misleading code paths, decisions not visible in the repo, and anything you've had to correct twice. `/doctor prompt-audit` finds stale or conflicting instructions. ALL CAPS, "IMPORTANT," "think hard" and "don't be lazy" are now outdated; if a rule must hold, make it a hook. Give Claude a pass/fail check to run, and ask for evidence rather than "all tests pass." After two failed corrections, `/clear` and re-prompt. |
| G | [How Claude remembers your project](https://code.claude.com/docs/en/memory) (docs) | living doc | 2 | Aim for under 200 lines per CLAUDE.md. Auto-memory has 4 types, a `MEMORY.md` index (the first 200 lines load) and topic files loaded on demand. CLAUDE.md is treated as context, not enforced configuration, so use hooks for guarantees. `@imports` organize content but don't reduce its context cost. |
| H | [A field guide to Claude Fable 5: Finding your unknowns](https://claude.com/blog/a-field-guide-to-claude-fable-finding-your-unknowns) (Thariq Shihipar) | Jul 6, 2026 | 1 | With the newest models, the bottleneck is how well *you* clarify unknowns. Ask Claude for a "blind spot pass," for several very different design directions, or to interview you one question at a time. Point it at reference code. Keep an implementation-notes file for deviations. Instructions that are too specific get followed even when a change of course would be better; instructions that are too vague get industry defaults. |

### How the extra sources change the picture

- **They reinforce bullets 1–3.** Sources A, B, F and G make the same "smaller, higher-signal context" argument from Anthropic's 2025 engineering posts and the current docs. The 2026 posts are the next step of an existing trend, not a reversal.
- **They nuance bullet 5.** Source D shows real wins for multi-agent setups on parallel, breadth-first research, at about 15× the token cost. The rule to share is "single agent by default, multi-agent for parallel breadth," not "never use subagents."
- **They make "test it" concrete.** Source E is the how-to behind "10 golden examples, run twice," and it independently confirms that a newer model on low effort can beat an older model on high effort, at lower cost.
- **They add a new angle to bullet 1.** Sources F and H suggest having Claude interview you or run a blind-spot pass. This turns "give the whole job up front" into a joint exercise rather than a solo writing task.

---

## 4. Verification notes and caveats

- All 5 primary sources plus 8 additional ones were read directly in November 2026.
- Anthropic's numbers are company-reported: the 80% cut, the 2× runtime, and the Terminal-Bench results. The evals behind the 80% figure are not described.
- The ~2× speedup comes from a single unnamed customer. It is not a general benchmark.
- "Max is prone to overthinking" (attributed to the Claude Code docs) could not be confirmed in the docs page's verbatim text.
- Name corrections from the video: "Tharic Shihipar" → **Thariq Shihipar**, "Lydia Hi" → **Lydia Hallie**. The Source 5 author is **Diane Sarkis**.
- Commands that are mentioned and exist in the docs: `/doctor`, `/doctor prompt-audit`, `/skill-doctor`, `/skill-creator`, `/effort`. Please check them against your team's Claude Code version before telling colleagues to use them.

---

## 5. Proposed next steps (pending your review)

1. **Focus document for colleagues:** about 2 pages, organized by the 5 bullets. Each bullet would have a "do / stop doing" box and one before/after example, and links to the sources.
2. **Presentation:** about 10–12 slides, with one per rule, a before/after setup audit, the effort chart, and a checklist slide.
