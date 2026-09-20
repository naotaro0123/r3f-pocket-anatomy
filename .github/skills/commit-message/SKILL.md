---
name: commit-message
description: Generate conventional commit messages for this repository. Use when asked to write or review commit messages.
---

# Commit Message Rules

GitHub Copilot がこのリポジトリでコミットメッセージを作成する場合は、次のルールに従う。

- Commit messages must be written in English.
- Use Conventional Commits.
- Format the subject as `<type>[optional scope]: <description>`.
- Use lowercase types such as `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, and `revert`.
- Use `feat` for new features and `fix` for bug fixes.
- Add a scope only when it adds value.
- Prefer scopes that match this repository, such as `canvas`, `model`, `ui`, `data`, or `copilot`.
- Use `docs: ...` for documentation and Copilot instruction updates.
- Use `perf: ...` for rendering or canvas performance improvements.
- Keep the description concise and do not end it with a period.
- Keep one commit focused on one intent; split commits when needed.

Examples:

- `feat(canvas): add camera preset debug controls`
- `perf(model): reduce canvas rendering cost`
- `docs(copilot): add repository commit message rules`
