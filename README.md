# can-i-help

Contributor guidance for any project - matches developer skills to test gaps, stale docs, bugspots, and open issues.

Part of the [agentsys](https://github.com/agent-sh/agentsys) ecosystem.

Point a contributor at a project and get specific, data-backed suggestions for where they can help. Collects project health signals automatically, asks about the developer's background, then matches skills to needs with concrete next steps.

## Why this plugin

- Use this when onboarding a new contributor and need to match work to their skills
- Use this when looking for good-first-issue candidates backed by actual project data
- Use this when a project needs help but maintainers don't know where to direct people
- Use this when you want to contribute to an open-source project but don't know where to start

## Installation

```bash
agentsys install can-i-help
```

## Quick start

```
/can-i-help
```

Three phases run in sequence:

1. **Collect** (automatic, no LLM) - gathers project metadata + contributor-specific signals
2. **Match** (Sonnet agent) - asks about developer background, matches skills to project needs
3. **Guide** (interactive) - for each recommendation, reads relevant code and explains what to do

## Contributor signals

Beyond base project data (manifest, structure, git), the collector gathers signals specific to contribution opportunities:

| Signal | Source | What it reveals |
|--------|--------|-----------------|
| Good-first areas | `repo-intel can-i-help` | Areas with clear patterns, low coupling, easy entry |
| Test gaps | `repo-intel test-gaps` | Hot source files without co-changing test files |
| Doc drift | `repo-intel doc-drift` | Documentation with low code coupling (likely stale) |
| Bugspots | `repo-intel bugspots` | Files with high bug-fix density |
| Open issues | `gh issue list` | GitHub issues with labels and assignees |

## How matching works

The Sonnet agent tailors recommendations based on developer profile:

| Developer says... | Recommended areas |
|-------------------|-------------------|
| "New to the stack" | Good-first areas with clear patterns and examples |
| "Experienced developer" | Hard problems in pain-point areas, architectural improvements |
| "I want to write tests" | Test gaps in frequently-changed files |
| "I want to fix bugs" | Bugspot files + relevant open issues |
| "I want to improve docs" | Stale documentation with concrete code examples |

Each recommendation includes:

- **What** - specific file, area, or issue
- **Why** - data-backed reason (bug rate, test gap, staleness)
- **How** - reads relevant code and explains what needs doing
- **First step** - exact action to take

## Usage

```
/can-i-help                        # Current repo, normal depth
/can-i-help /path/to/repo          # Specific repo
/can-i-help --depth=deep           # Include AST symbol data
```

## Validated on 100 repos

The collector passes on 100 open-source repositories across 8 languages (JS/TS, Rust, Go, Python, C/C++, Java, Deno). Contributor signal queries validated on 8 repos with manual cross-checking against actual code: phantom directories filtered, source code prioritized over test/doc dirs, generated data excluded from recommendations.

## Requirements

- Git repository with history
- [agent-analyzer](https://github.com/agent-sh/agent-analyzer) for contributor signals (optional - prompts to generate if missing)
- GitHub CLI (`gh`) for open issues (optional)

## Related plugins

- [onboard](https://github.com/agent-sh/onboard) - codebase orientation (what the project is and how it works)
- [repo-intel](https://github.com/agent-sh/repo-intel) - unified repository analysis (data source for all contributor signals)

## License

MIT
