---
name: can-i-help
description: Use when someone asks where they can contribute to a project, wants a good first issue, or asks what needs work. Matches their interests to project data.
argument-hint: "[path] [--depth=normal|deep]"
---

# can-i-help

Find a concrete first contribution for a developer, backed by the project's own data.

The work runs in two parts. `scripts/collect.js` in this plugin gathers project context and contributor signals with no model involved: manifest, structure, git info, repo-intel queries (can-i-help, test-gaps, doc-drift, bugspots, stale-docs, conventions, slop-fixes) and open GitHub issues. It writes one JSON file and prints its path. The `can-i-help-agent` then asks the developer what they want to work on, reads the relevant code, and recommends targets.

Run `node <plugin root>/scripts/collect.js $ARGUMENTS` (an optional path and `--depth=normal|deep`), then hand the printed data file to the agent. When subagents are not available, follow `agents/can-i-help-agent.md` in this session.

## Data sources

- `agent-analyzer` supplies the repo-intel queries. It downloads to `~/.agent-sh/bin/` on first use (about 10 MB) and `lib/agentsys.js` finds the agentsys install that manages it. At normal depth the collector builds `repo-intel.json` in the state directory (`.claude`, `.opencode` or `.codex`) when it is missing.
- `gh` supplies open issues when it is installed and logged in.

Without either, the recommendations fall back to the manifest, structure, hotspots and the code itself, and the agent says the data is thinner.

## Done

The developer has at least one recommendation with a file, a data-backed reason, what to change, and a first step, or a plain statement that the data does not support their interest plus the closest alternative.
