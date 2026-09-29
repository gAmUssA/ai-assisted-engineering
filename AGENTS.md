# Website agent guide

This file applies to the entire repository. Keep it current when commands, content formats, or deployment behavior change.

## Architecture and sources of truth

- This is a static, single-page website built with vanilla HTML, CSS, and JavaScript. Preserve browser-ready files; do not introduce a framework, bundler, backend, or package manager migration for routine work.
- `index.html` defines markup and initial SEO/social metadata; `styles.css` defines the design; `script.js` initializes content, galleries, events, modals, navigation, and animations.
- `site-config.js` supplies text, navigation, experts, and runtime metadata. Keep corresponding initial metadata in `index.html` consistent for crawlers that do not execute JavaScript.
- `events-config.js` supplies event records: `name`, `link`, `country`, `countryCode`, `flag`, `date` (ISO `YYYY-MM-DD`), `displayDate`, and `city`.
- `urls.txt` is the video input. `generate-video-config.js` generates the tracked, browser-consumed `config.js`. Do not hand-edit `config.js`; use `make config`. The older `generate-config.js` and `generate-config.py` are not the active Makefile generator.
- Preserve the script order in `index.html`: `site-config.js`, `config.js`, `events-config.js`, then `script.js`. These expose globals, not ES modules.
- `.github/workflows/deploy.yml` is the deployment implementation. `Makefile` is the local command reference. Inspect these before relying on older README or steering instructions.
- Consult `openspec/specs/` for behavior requirements and any relevant active `openspec/changes/` for planned work. Leave unrelated active changes intact.

## Start and preview

1. Inspect `git status --short` and preserve unrelated work. Fetch `origin` and fast-forward a clean `main` to `origin/main` before branching. Never reset or discard someone else's changes to sync.
2. Use a focused branch such as `docs/website-guide` or `fix/video-modal`. When another agent may write concurrently, use a separate Git worktree.
3. Run commands from the repository root. Bun is the JavaScript runtime used by Make targets and CI. There is no `package.json` or dependency installation step for the website itself.
4. Run `make serve` and open `http://localhost:8000`. Stop the server with Ctrl-C. It prefers `bun x http-server`, which may download the server package, then falls back to Python or PHP.
5. For a preview with an existing Python installation and no package download, use `python3 -m http.server 8000`. Use HTTP rather than opening `index.html` through `file://`.

Do not run `make setup` on an existing checkout: it can initialize Git, stage every file, and create a commit, including when its `.git` directory check misidentifies a worktree.

## Update content

- Quantitative productivity, defect, adoption, or coverage claims need a visible citation identifying the study, population, and limits. Remove unsupported claims instead of presenting illustrative numbers as measured results.

- For site copy or experts, edit `site-config.js`; for structural changes, update `index.html` and its consumers in `script.js` together. Keep navigation targets and DOM selectors aligned.
- For events, edit `events-config.js` and preview the rendered dates, locations, flags, and destination links. Do not assume the renderer removes past events automatically.
- For videos, add or remove URLs in `urls.txt`. Blank lines and `#` comments are supported. Keep one active YouTube URL per line.
- Make `YOUTUBE_API_KEY` available through the environment or a gitignored local `.env`, then run `make config`. This calls YouTube Data API v3 and overwrites `config.js`.
- Review the generated diff: IDs must match the intended URL set, titles and thumbnails must be usable, videos sort newest first with undated entries last, and at most three dated videos receive `isNew`.
- Individual metadata failures can produce fallback records while generation still succeeds. Investigate `Video Title Unavailable` entries before shipping; do not treat exit zero as proof of usable metadata.
- Include the regenerated `config.js` with its `urls.txt` change. Pages currently consumes the tracked file and does not regenerate an existing valid config just because URLs changed.

Never put API keys in browser scripts, committed files, screenshots, or logs. Prefer environment variables over command-line key arguments. See `docs/YOUTUBE_API_SETUP.md` for API setup and `docs/GITHUB_ACTIONS_SETUP.md` for CI secrets. Local `.env` values can override exported values through the generator's loader.

## Validate changes

```bash
make test       # Core structure and configuration checks; matches the core CI suite
make test-all   # Seven suites through tests/run-all-tests.js
make test-api   # YouTube API integration suite
make test-pbt   # Description extraction property suite
```

- Run `make test` before committing website changes. Run `make test-all` for generator, sorting, description, or shared JavaScript changes.
- Bun is the intended runtime. The full runner currently launches child suites with `node`; treat this as incomplete migration, not an intentional Node prerequisite. Report the drift and correct it when working on the runner.
- Parse changed browser JavaScript with `bun build <file.js> --target browser --outdir <temporary-directory>` without executing DOM code. Keep the output outside the repository. There is no configured repository-wide formatter or linter; follow nearby style and avoid unrelated reformatting.
- For UI/content changes, preview desktop and mobile widths. Check navigation, video cards, “View all tutorials”, modal open/close and Escape behavior, event links, keyboard access, reduced-motion behavior, and the browser console/network panel.
- Existing tests primarily validate files and data; passing tests do not prove browser rendering or live YouTube embedding works. Verify both when relevant.
- `make build` only attempts optional CSS/JS minification. The page loads unminified files, and Pages does not invoke this target. A successful build message is not deployment evidence.
- Keep local minified assets, `_site/`, caches, and preview screenshots out of commits. `make clean` removes only `styles.min.css` and `script.min.js`.

Report each verification command and its result. Identify checks that were not run, including credential-dependent or live-site checks.

## Deploy and verify

Production is configured for `https://ai-assisted.engineering` by `CNAME`. Preserve the domain unless changing it is part of the task.

1. Confirm GitHub Pages uses **GitHub Actions** at `https://github.com/gAmUssA/ai-assisted-engineering/settings/pages`. Configure `YOUTUBE_API_KEY` at `https://github.com/gAmUssA/ai-assisted-engineering/settings/secrets/actions` when metadata generation is needed.
2. Validate locally, inspect the diff, and stage only intended files. Push a feature branch and open a focused pull request; merge only after required checks and review findings are resolved.
3. A push to `main` starts `.github/workflows/deploy.yml`; it also supports `workflow_dispatch`. Its build job runs core checks, conditionally runs API tests, checks/generates video config, builds through Jekyll into `_site`, and uploads the Pages artifact. The dependent deploy job publishes it.
4. Watch the deployment run for the exact merged commit through all jobs. With GitHub CLI, find its ID using `gh run list --workflow deploy.yml --commit <merged-sha>`, then run `gh run watch <run-id> --exit-status`. For failures, inspect `gh run view <run-id> --log-failed`.
5. Verify the production page and changed assets over HTTPS, then smoke-test the changed behavior in a browser. Confirm the expected content actually appears. The workflow's `post-deploy-tests` job reruns local core tests; it does not request the deployed website.

Do not use `make deploy`: it runs `git add .`, makes a timestamped commit, and pushes directly to `main`. Its success message proves only a push, not a Pages deployment. Do not follow the README's initial-repository setup or branch-based Pages alternative for routine releases.

Deployment reuses an existing config containing video data. If it needs to generate config without a CI key, the workflow creates a placeholder gallery; a green deployment can still show unusable videos. Check the gallery explicitly.

For rollback, revert the offending change through a pull request and watch the resulting deployment. Avoid history rewrites. Do not alter DNS, Pages settings, CI workflows, or secrets as an incidental fix; scope those changes explicitly.

## Documentation drift to account for

The README and `.kiro/steering/` contain older guidance. In particular, they differ from the executable files on manual video edits, API-key requirements, `make test` versus the full suite, Node use in the test runner, external fonts, and direct deployment. Use the concrete procedures above for these points; report new discrepancies before changing the workflow or architecture. Update this guide with any intentional change to those procedures.
