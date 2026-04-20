# Project Rules

> Guidance for AI assistance in this repo.

> **Note:** This is a template. If you cloned this via "Use this template" on GitHub, replace `STACK_NAME` and `SCOPE_NAME` across the repo before your first commit. See README for the checklist.

---

## General

- Be extremely concise. Sacrifice grammar for concision.

## Plans

- End each plan with a concise list of unresolved questions if any.
- Use phases for broad plans.

## Git

- Branch prefixes: `feature/` and `fix/`.
- Conventional commits.
- Format code via the project formatter before commits.
- Test and commit between plan phases when possible.

## GitHub

- Primary tool is the `gh` CLI.

---

## Codebase

CLI that distributes Claude Code skills for STACK_NAME projects to consumer repos.

### Layout

- `skills/{name}/SKILL.md` — source-of-truth skill definitions (+ optional nested files per skill).
- `src/index.ts` — commander entry; registers `add` and `list`.
- `src/skills.ts` — package/project skill helpers (list, install, uninstall, read description).
- `src/commands/add.ts` — `add [skills...]` handler with interactive checkbox UI.
- `src/commands/list.ts` — `list` handler.
- `src/types.ts` — `SkillMeta` only.
- `bin/cli.js` — shim → `dist/index.js`.

### Skill format

Each skill is a directory under `skills/` containing a `SKILL.md` with YAML frontmatter (`name`, `description`, `user-invocable`). Nested support files are copied verbatim on install.

### Target path

Consumers receive skills at `{cwd}/.claude/skills/{name}/`. Foreign directories there are never touched. Per-skill overwrite on reinstall (with warning).

### Build / check

```bash
npm run build        # compile src → dist
npx tsc --noEmit     # typecheck only
```

### Release

Semantic-release on `main` (stable) and `beta` (beta dist-tag). Breaking change = `BREAKING CHANGE:` footer in commit.
