# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-09-24

### Changed

- Rewrote the command, agent and skill for current models: goal, constraints with reasons, done criteria and the output contract, without step scripts, all-caps rules or long worked examples.
- Collection runs as `scripts/collect.js` and writes `<stateDir>/can-i-help-data.json`; the agent reads that file.

### Fixed

- The command's collection was JavaScript inside markdown with no `node` in allowed tools, so it could not run as written. It is a script now, with tests.
- `lib/collector.js` fetched four contributor queries while the command fetched them again plus stale-docs, conventions and slop-fixes. The collector now runs the full set once.
- Open issues came from `gh issue list -R <remote URL>`, which fails on SSH remotes. The collector's `gh` call in the repo directory is the only source now.
- `--depth=deep` never returned repo-map data: the collector expected `symbols` as a flat array, while agentsys writes `{ exports, functions, classes, types, constants }`, so the summary threw and was swallowed. Both shapes are read now, key exports capped at 20 files.
- The skill and README said the user is asked before the repo-intel map is generated. The collector builds it without asking; the docs say so.

## [0.1.1] - 2026-04-26

### Changed

- lib/collector.js execGit takes explicit argv arrays instead of args.split(' ') on hard-coded strings. Safer footgun elimination.

### Performance

- Switch can-i-help-agent from opus to sonnet - 83% cost reduction with equivalent output quality

### Added

- Wire Phase 2-4 repo-intel data into collector: stale-docs (`doc-drift`) and conventions data now included in collected signals

## [0.1.0] - 2026-03-16

### Added

- Scaffold can-i-help plugin split from onboard - contributor guidance matching developer skills to project needs
- Collector with contributor signals: good-first areas, test gaps, doc drift, bugspots, open GitHub issues
- README with contributor signals documentation, skill matching table, and guidance flow description
- 100-repo validation statement: collector passes on 100 open-source repositories across 8 languages

### Fixed

- Collector JSDoc updated, missing codex triggers added, JSON validated before write
- Address agnix warning for redundant instruction in agent config
- Sync collector with onboard tuning and contributor signals alignment
- Consolidated collector incorporating all fix rounds with full contributor signals support

[Unreleased]: https://github.com/agent-sh/can-i-help/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/agent-sh/can-i-help/compare/v0.1.1...v0.2.0
[0.1.0]: https://github.com/agent-sh/can-i-help/releases/tag/v0.1.0
