# Working with Claude 5 models: 5 rules

An engineering briefing for C/C++ real-time teams on Anthropic's guidance for prompting and working with the Claude 5 models in Claude Code. Every rule comes with a concrete C/C++ example.

## What's here

| File | What it is |
|---|---|
| [`index.html`](index.html) | The full presentation (39 slides) in one file. Animations and speaker notes are included. |
| [`speaker-notes.md`](speaker-notes.md) | The speaker notes for every slide, as plain text. |
| [`serve.js`](serve.js) | A tiny Node.js server that runs the deck locally (`npm start`). |
| [`research/research-brief.md`](research/research-brief.md) | The research behind the deck: the five Anthropic sources, a summary of each, and further reading. |

## Presenting

**With Node.js** (no `npm install` needed, since there are no dependencies):

```bash
git clone https://github.com/YoavDahanPrivate/AntropicGuideForCoding.git
cd AntropicGuideForCoding
npm start
```

This serves the deck on http://localhost:8080 and opens it in your default browser. Press Ctrl+C to stop. To use another port, run `node serve.js 9000`. To skip opening the browser, add `--no-open`.

**Without Node:** double-click `index.html`. It's a single self-contained file.

Use these keys:

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
