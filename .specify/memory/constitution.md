<!--
Sync Impact Report:

- Version change: 1.0.0 → 1.1.0
- Modified principles:
    - I. Simplicity → I. Code Quality
    - II. Correctness → II. Testing Standards
    - III. Testability → III. User Experience Consistency
- Added sections:
    - IV. Performance Requirements
- Templates requiring updates:
    - ✅ .specify/templates/plan-template.md
    - ⚠ .specify/templates/spec-template.md
    - ⚠ .specify/templates/tasks-template.md
- Follow-up TODOs: none
-->

# Yatzy Scoreboard Constitution

## Core Principles

### I. Code Quality
All code must be clean, maintainable, and well-documented. Development must adhere to a consistent style, enforced by mandatory linting and formatting tools.

### II. Testing Standards
All new code must be accompanied by unit tests with a high level of coverage. Critical user paths and core logic must have integration tests to ensure end-to-end correctness.

### III. User Experience Consistency
The user interface (UI) and user experience (UX) must be consistent across the entire application. All new features must adhere to a defined style guide and existing interaction patterns.

### IV. Performance Requirements
The application must be responsive and meet defined performance metrics. New features must be evaluated for their performance impact, and optimizations should be made where necessary.

## Development Workflow

- Follow standard GitHub flow (fork, branch, pull request).
- Pull requests should be reviewed by at least one other person before being merged.

## Governance

This constitution is the single source of truth for project principles. Changes to the constitution must be done via pull request and be approved by the project owner.

**Version**: 1.1.0 | **Ratified**: 2026-01-13 | **Last Amended**: 2026-01-13
