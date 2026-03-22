# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
- Add contributor signals and GitHub issues integration to collector
- Sync collector with onboard tuning and contributor signals alignment
- Consolidated collector incorporating all fix rounds with full contributor signals support

[Unreleased]: https://github.com/agent-sh/can-i-help/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/agent-sh/can-i-help/releases/tag/v0.1.0
