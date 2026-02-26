# Contributing guidelines

Thank you for your interest in contributing to Yoik.ME. Please refer to the
project issues page and discussions to find tasks to participate in. When you're
ready for a code change, create a branch and submit a pull request.

## Pull requests

### Labels

Every pull request must be labeled with the service or package it impacts:

| Label | Description |
| --- | --- |
| `client` | Changes to the client service |
| `tsconfig` | Changes to the tsconfig package |
| `config` | Changes to tooling configuration |
| `ci` | Changes to CI/CD workflows |

Additionally, label the pull request with the type of change:

| Label | Description |
| --- | --- |
| `bug` | Something isn't working |
| `enhancement` | New feature or improvement |
| `fix` | Patch for a bug |
| `dependency` | Dependency bump or replacement |
| `documentation` | Updates to docs |
| `duplicate` | Duplicate issue or PR |
| `question` | Questionable issue requiring discussion |
| `wontfix` | Will not be worked on |

### Assignees and reviewers

- Assign yourself to the pull request.
- Add the appropriate code owner as a reviewer.

### PR body

Use the pull request template provided in this repository. At minimum, every PR
should include an issue reference (or N/A), a description of the change, and
any additional context that helps reviewers understand the change.

## Code owners

See [CODEOWNERS](.github/CODEOWNERS) for the current ownership map.
