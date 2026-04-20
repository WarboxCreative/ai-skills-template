# AI Skills Template

Template for per-stack Claude Code skill distribution packages. Click **Use this template** on GitHub to spin up a new stack-specific package (e.g. `ai-skills-sanity`, `ai-skills-nextjs`).

---

## Post-clone checklist

Replace `STACK_NAME` and `SCOPE_NAME` across the repo. Recommended command:

```bash
grep -rn 'STACK_NAME\|SCOPE_NAME' --exclude-dir=node_modules --exclude-dir=.git .
```

Files containing tokens:

- `package.json` — `name`, `description`, `repository.url`, `bin`, `keywords`
- `src/index.ts` — program `.name()` and `.description()`
- `src/commands/add.ts` — error-message hint
- `README.md` — this file
- `CLAUDE.md` — codebase note

`STACK_NAME` should be a lowercase slug (e.g. `sanity`, `nextjs`, `wordpress`). `SCOPE_NAME` is your npm/GitHub org (e.g. `warboxcreative`).

After replacement, delete the dummy skill at `skills/example-skill/` and author real ones.

---

## Authoring skills

Each skill is a directory under `skills/` containing a `SKILL.md`:

```
skills/
  my-skill/
    SKILL.md
    helper.md        # optional supporting files, copied verbatim on install
```

`SKILL.md` frontmatter:

```markdown
---
name: my-skill
description: "What it does. Triggers on: phrase one, phrase two."
user-invocable: true
---

# My Skill

## The Job

1. Step one.
2. Step two.
```

See `skills/example-skill/SKILL.md` for a starting shape.

---

## Usage (after publish)

### Install from GitHub Packages

Add to `~/.npmrc` (or project `.npmrc`):

```
@SCOPE_NAME:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Your token needs `read:packages` scope.

### Run

```bash
npx @SCOPE_NAME/ai-skills-STACK_NAME@latest add          # interactive multi-select
npx @SCOPE_NAME/ai-skills-STACK_NAME@latest add my-skill # install specific skill(s)
npx @SCOPE_NAME/ai-skills-STACK_NAME@latest list         # show available + installed
```

Skills are written to `.claude/skills/{name}/` in the current directory. Foreign directories there are never touched. Re-running `add` overwrites with a warning.

---

## Development

```bash
npm install
npm run build    # tsc → dist/
npm run dev      # tsc --watch
```

---

## Publishing

Auto-published to GitHub Packages via semantic-release on `main` (stable) and `beta` (beta dist-tag). Conventional commits required.

Beta flow:

```bash
git checkout beta
git merge feature/my-change
git push origin beta     # triggers @beta release
```

Promote to stable:

```bash
git checkout main
git merge beta
git push origin main     # triggers @latest release
```
