# GitHub

- Username: **quasarbright**
- Primary branch is always **master** — never use or rename to `main`
- Pages base URL: `https://quasarbright.github.io/<repo-name>`

## Creating a repo

```bash
git init
git add <files>
git commit -m "Initial commit"
gh repo create quasarbright/<repo-name> --public --source=. --remote=origin --push
```

## Enabling GitHub Pages

```bash
gh api repos/quasarbright/<repo-name>/pages \
  --method POST \
  -f "source[branch]=master" \
  -f "source[path]=/"
```

## Watching a Pages deploy

Poll until `status` is `"built"` (typically 30–60s):

```bash
until [ "$(gh api repos/quasarbright/<repo-name>/pages --jq '.status')" = "built" ]; do
  echo "Building..."; sleep 5
done && echo "Live at https://quasarbright.github.io/<repo-name>"
```

For Actions-based Pages: `gh run watch --repo quasarbright/<repo-name>`

## Notes
- Single-file apps: branch-based Pages at path `/` — no Actions workflow needed
- Basepath `https://quasarbright.github.io/<repo-name>` matters if the app references assets by path
