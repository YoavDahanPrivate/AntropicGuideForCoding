# Working with Claude 5 models: 5 rules

An engineering briefing for C/C++ real-time teams on Anthropic's guidance for prompting and working with the Claude 5 models in Claude Code. Every rule comes with a concrete C/C++ example.

## What's here

| File | What it is |
|---|---|
| [`index.html`](index.html) | The full presentation (39 slides) in one file. Animations and speaker notes are included. |
| [`speaker-notes.md`](speaker-notes.md) | The speaker notes for every slide, as plain text. |
| [`research/research-brief.md`](research/research-brief.md) | The research behind the deck: the five Anthropic sources, a summary of each, and further reading. |

## Presenting

1. Download `index.html`, or clone the repo.
2. Open it in Chrome, Edge or Firefox.
3. Use these keys:

| Key | Action |
|---|---|
| `→` / `Space` / `PageDown` | Next slide |
| `←` / `PageUp` | Previous slide |
| `Home` / `End` | First / last slide |
| `N` | Show or hide the speaker notes |
| `F` | Full screen |

Move the mouse to the bottom edge to show the control bar. Add `#12` to the URL to open slide 12 directly.

The fonts (Space Grotesk, IBM Plex Sans, JetBrains Mono) load from Google Fonts, so the PC needs internet access. Without it, the slides fall back to Arial and Courier.

## Contents

1. **Prompting.** Describe the goal and the constraints, not the steps (`/goal`).
2. **Context.** Delete what Claude already knows, and keep the gotchas. Covers path-scoped rules (`.claude/rules`), CLAUDE.md and `/doctor`.
3. **Skills.** A skill is a table of contents. Group skills by workflow, and pick the right loading mechanism.
4. **Effort.** Match the effort level to the task.
5. **Agents.** Start with one agent with skills, and use subagents only for clear reasons.

**Additional thoughts (our own recommendations):** structuring Claude around a codebase with 100K+ files:
- diary notes vs. module design docs
- what goes in a module CLAUDE.md
- one CLAUDE.md per module
- how deep to go
- when to update, and who approves

## Sources

The sources are listed on the closing slide and in [`research/research-brief.md`](research/research-brief.md). The code examples are illustrative.
