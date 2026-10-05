# can-i-help

## Project overview

Finds where a developer can contribute to a project by matching their interests to the project's own data: test gaps, stale docs, bugspots, cleanup candidates and open issues. Part of the [agentsys](https://github.com/agent-sh/agentsys) ecosystem; skills follow https://agentskills.io.

## Conventions

- Plugin output uses the plain-text markers `[OK]`, `[ERROR]`, `[WARN]`, `[CRITICAL]`, with no emojis or ASCII art: they cost tokens and parse worse.
- Report finished work in the reply instead of adding summary, plan, audit or temp files.
- A feature or fix ships with tests for the changed behavior, and `npm test` passes before it is done.
- Changes beyond a trivial fix go through a PR to main. Run the git hooks; when one blocks, fix the cause.
- In prose, write ` - ` (a single dash with spaces), not an em dash or ` -- `.
- When a script fails, report the error and fix the script rather than doing its work by hand, so broken tooling gets noticed.
- Model choice for agents: Opus for complex reasoning and planning, Sonnet for validation and most agents, Haiku for mechanical steps.
- Priorities, in order: experience of plugin users, worry-free automation, token efficiency, output quality, simplicity.

## Layout

- Command: `commands/can-i-help.md` (`/can-i-help [path] [--depth=normal|deep]`)
- Agent: `agents/can-i-help-agent.md` (sonnet), asks the developer what they want and recommends targets
- Skill: `skills/can-i-help/`
- `scripts/collect.js` gathers project context and repo-intel signals with no model involved and writes one JSON file; the agent does the matching.

## Commands

```bash
npm test   # collector and agentsys resolver tests
```
