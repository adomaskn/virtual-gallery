# agents.md

Guidelines for agentic AI contributors working in this repository.

## Purpose

This project is a portfolio/virtual gallery web app with multiple deployment modes controlled by `VITE_APP_MODE`:

- `full`
- `profile`
- `room`

Agents should preserve this split architecture and avoid changes that break cross-repo linking behavior.

The room experience must remain usable on both desktop and mobile.

## Core Goals for Agents

- Keep the site stable and fast.
- Prefer small, reversible changes.
- Preserve existing UX and visual identity unless explicitly asked to redesign.
- Make code easy for humans to maintain.

## Repo Map (High Level)

- `src/`: app source code
- `public/`: static assets
- `assets/`, `css/`, `js/`: legacy/static content
- `project-pages/`: project page content
- `.github/`: CI/workflow configuration

## Working Rules

1. Read `README.md` before implementing major changes.
2. If behavior depends on environment mode, test assumptions for `full`, `profile`, and `room`.
3. Keep links and content config aligned with `src/contentConfig.js`.
4. Avoid broad refactors unless requested.
5. Document non-obvious decisions in PR descriptions or commit messages.
6. Keep touch controls and desktop controls both functional when editing room movement/camera logic.

## Safety and Quality Checklist

Before finalizing work, agents should:

1. Run install/build checks:
   - `npm install`
   - `npm run build`
2. Verify no obvious breakage in navigation:
   - profile -> room link ("Open Project")
   - room -> profile link ("Press E to Go Home")
3. Verify controls:
   - Desktop: `WASD` + `Space` + `E` + pointer lock
   - Mobile: joystick move + right-side swipe look + jump + interact
4. Confirm no secrets or tokens were introduced.
5. Keep dependency additions minimal and justified.

## Code Style Expectations

- Follow existing file patterns and naming.
- Keep functions/components focused.
- Add brief comments only where logic is non-obvious.
- Do not add large headers or boilerplate comments.

## Change Scope Guidance

Prefer this order of operations:

1. Minimal fix
2. Focused improvement
3. Larger redesign (only if explicitly requested)

If a request is ambiguous, choose the safest minimal implementation and note assumptions.

## Handoff Format

When handing off work, include:

1. What changed (files + intent)
2. What was validated (commands/tests)
3. Risks or follow-ups

## Git Hygiene

- Keep generated artifacts out of commits (`node_modules/`, `dist/`).
- Ensure `.gitignore` covers local/build outputs.
- Before push, verify branch status and changed files are intentional.

---

If this file conflicts with a user request in a specific task, the explicit user request takes priority.
