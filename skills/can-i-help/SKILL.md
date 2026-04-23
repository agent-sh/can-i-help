---
name: can-i-help
description: "Use when user asks to \"contribute\", \"where can I help\", \"good first issue\", \"what needs work\", \"how to contribute\", \"where to start contributing\", \"find tasks\", \"help with project\". Analyzes project needs and matches to developer skills."
argument-hint: "[path] [--depth=normal|deep]"
---

# Can I Help Skill

Find where a developer can contribute to a project. Collects project data automatically, queries repo-intel for contributor-specific signals, fetches open issues, then matches developer skills to project needs interactively.

## Architecture

```
/can-i-help
  │
  ├─ Phase 1: collector.js (pure JS, zero LLM)
  │   ├─ scanManifest()    → package.json/Cargo.toml/go.mod
  │   ├─ scanStructure()   → directory tree
  │   ├─ getRepoIntel()    → onboard query for project context
  │   └─ getGitInfo()      → branch, remote URL
  │
  ├─ Phase 1b: Contributor signals (pure JS)
  │   ├─ can-i-help query  → good-first areas, needs-help areas
  │   ├─ test-gaps query   → files needing tests
  │   ├─ doc-drift query   → stale documentation
  │   ├─ bugspots query    → bug-prone files
  │   └─ gh issue list     → open GitHub issues
  │
  ├─ Phase 2: can-i-help-agent (Opus)
  │   ├─ Ask about developer background
  │   ├─ Match skills to project needs
  │   └─ Recommend specific contribution areas
  │
  └─ Phase 3: Interactive guidance
      ├─ Walk through chosen contribution
      └─ Read code, explain what needs doing
```


## Repo-Intel Data

**Expected:** the orchestrator (the command that spawned this agent) has already checked `<stateDir>/repo-intel.json` and either pre-fetched the data into your context or skipped (user declined to generate). **Do not call `AskUserQuestion` here** - subagents cannot interact with the user.

**If the pre-fetched data is empty**, proceed with the available context. The orchestrator has already made the decision on the user's behalf.

**Binary:** `agent-analyzer` auto-downloads to `~/.agent-sh/bin/` from `agent-sh/agent-analyzer` GitHub releases (~10 MB) on first use. The `lib/agentsys` resolver locates the agentsys install (CC marketplace clone, npm global, or sibling repo).

