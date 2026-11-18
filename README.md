# Pavaruthran

Pavaruthran is a framework-free portfolio with its original golden visual system. The SOLE ONE card opens a separate Midnight Blue universe in `sole-one-entry.html`; the blue visual system is isolated to the SOLE ONE pages.

## Run locally

Node.js 18 or newer is required for EXTRA access. Start the backend with:

```powershell
node server.mjs
```

Open <http://localhost:4173/sole-one> for the portfolio or <http://localhost:4173/sole-one-entry.html> for SOLE ONE. Enter the original name and hint in `private/extra-access.json`. The backend reads the password from that file and protects access with a short-lived HttpOnly session cookie; the JSON file is not served by `server.mjs`. Use HTTPS and `NODE_ENV=production` for public hosting so the cookie uses the `Secure` flag.

Do not use a static server such as Live Server to configure a real password. Static servers can expose project files and do not enforce the server-side EXTRA routes.

## SOLE ONE EXTRA

The EXTRA section shows one launch card, then the password screen. A successful server check opens exactly two destination cards: BTS and Games. Each opens an authenticated, dedicated tab at `/sole-one/bts` or `/sole-one/games`. BTS galleries use reusable image/video slots and placeholders until SOLE ONE media is provided. Games includes Signal Echo as a playable mini-game.

The existing intro video, timeline, golden portfolio sections, title artwork, and project assets remain in their original files.
