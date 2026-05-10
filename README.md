# Personal portfolio created from a template
A portfolio website from the Unemployables template.
<br /><br />
**Original:** https://ndoherty-xyz.github.io/unemployables-portfolio-template/
<br />

# Aim of this project

To have an online portfolio that can be used to try out new features and store public information about myself.

# Split into two repositories

This app now supports three modes via `VITE_APP_MODE`:

- `full` (default): current single-repo behavior (`home` + `#gallery`)
- `profile`: profile page only
- `room`: 3D room only

Cross-repo links are configured in [`src/contentConfig.js`](/h:/aailabs/github/adomaskn.github.io/src/contentConfig.js):

- `homeContent.profileAppUrl`
- `homeContent.roomAppUrl`

Suggested setup:

1. Create `adomaskn-profile` repo and deploy with `VITE_APP_MODE=profile`.
2. Create `adomaskn-room` repo and deploy with `VITE_APP_MODE=room`.
3. Set `profileAppUrl` to the profile deployment URL.
4. Set `roomAppUrl` to the room deployment URL.

Result:

- "Open Project" on profile goes to room repo.
- "Press E to Go Home" in room goes to profile repo.
