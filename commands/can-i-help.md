---
description: Find where to contribute to a project - matches your skills to areas that need help, good-first tasks, test gaps, and stale docs
codex-description: 'Use when the user asks where they can contribute to a project, wants a good first issue, or asks what needs work. Matches their interests to test gaps, stale docs, bugspots, cleanup candidates and open issues.'
argument-hint: "[path] [--depth=normal|deep]"
allowed-tools: Bash(git:*), Bash(gh:*), Bash(node:*), Read, Glob, Grep, Task, AskUserQuestion
---

# /can-i-help

Help a developer find a concrete first contribution to a project: a file, a reason backed by data, and the first thing to do.

## Arguments

`$ARGUMENTS`, all optional: a path (default: current directory) and `--depth=normal|deep` (default `normal`; `deep` adds repo-map symbols when a map exists).

## Collect

Collection is deterministic code, so run it instead of reproducing it:

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/collect.js" $ARGUMENTS
```

`${CLAUDE_PLUGIN_ROOT}` is this plugin's root. In a harness that does not substitute it, find `scripts/collect.js` in the plugin directory with Glob. Exit 2 means a bad argument: show the message and stop. On success the script prints one line per source and a final `data: <path>` line pointing at the JSON it wrote. A missing analyzer, repo-intel map or `gh` login is reported as unavailable, not as a failure.

## Match

Spawn `can-i-help:can-i-help-agent` with the data file path and the target path. The agent asks the developer about their interests, so it needs AskUserQuestion. If the Task tool is missing, or the harness does not let subagents ask the user, do the same work in this session by following the plugin's `agents/can-i-help-agent.md`.

## Done

The developer has at least one recommendation they can start on now, or a plain statement that the data supports nothing for their interest plus the nearest alternative.
