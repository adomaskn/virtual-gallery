# Virtual Gallery Portfolio

Portfolio website based on the Unemployables template, extended with a 3D gallery room and cross-repo navigation.

Original template: https://ndoherty-xyz.github.io/unemployables-portfolio-template/

## Project Aim

Provide an online portfolio to present public information and experiment with new features.

## App Modes

This app supports 3 modes via `VITE_APP_MODE`:

- `full` (default): profile/home page plus gallery (`#gallery`)
- `profile`: profile page only
- `room`: 3D room only

Cross-repo links are configured in [`src/contentConfig.js`](src/contentConfig.js):

- `homeContent.profileAppUrl`
- `homeContent.roomAppUrl`

Suggested split setup:

1. Create `adomaskn-profile` and deploy with `VITE_APP_MODE=profile`.
2. Create `adomaskn-room` and deploy with `VITE_APP_MODE=room`.
3. Set `profileAppUrl` to the profile deployment URL.
4. Set `roomAppUrl` to the room deployment URL.

Result:

- "Open Project" from profile goes to room repo.
- "Press E to Go Home" from room goes to profile repo.

## Mobile Controls (Room)

The room now supports mobile-friendly controls without pointer lock:

- Left thumb joystick: move character
- Right side swipe: look around
- `Jump` button: jump
- `Interact` button: open artwork/door when target is in focus

Desktop controls remain available:

- `W`, `A`, `S`, `D` to move
- `Space` to jump
- `E` to interact
- Pointer lock button for mouse look

## Language Toggle (EN/LT)

The app now includes an English/Lithuanian toggle on both:

- Main profile/home page
- 3D gallery room page

Language state persistence:

- Saved in `localStorage` (`vg_lang`)
- Synced to URL query param (`?lang=en` or `?lang=lt`)
- Preserved when moving between home/gallery and cross-repo links

Examples:

- `http://localhost:5173/?lang=lt`
- `http://localhost:5173/?lang=lt#gallery`

## Local Development

Install dependencies:

```bash
npm install
```

Start dev server:

```bash
npm run dev
```

Open:

- `http://localhost:5173` (home in `full` mode)
- `http://localhost:5173/#gallery` (gallery directly)

Run room mode directly:

```powershell
$env:VITE_APP_MODE="room"
npm run dev
```

## Test On Phone

Start dev server on LAN host:

```bash
npm run dev -- --host
```

Find your PC IPv4 address (`ipconfig`) and open on phone:

- `http://<PC_IP>:5173`
- `http://<PC_IP>:5173/#gallery`

Phone and PC must be on the same Wi-Fi network. If needed, allow Node/Vite through Windows Firewall (Private network).

## Build

```bash
npm run build
```
