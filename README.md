# LSG FIFA Contest Tracker

Static site with a public read-only results page and an admin page. Contest data is stored as JSON — **Netlify Blobs** (recommended) or Google Drive via Apps Script.

## Folder structure

```
Fifa/
├── netlify.toml            # Netlify config (publish + API)
├── package.json            # @netlify/blobs for serverless storage
├── netlify/functions/      # GET/POST API for contest JSON
├── site/                   # Static frontend (published to Netlify)
│   ├── index.html
│   ├── admin.html
│   ├── data/contest-data.json   # Seed data (first load)
│   └── js/
└── google-apps-script/     # Optional — Google Drive backend
```

## Pages

### Public page (`site/index.html`)
- Read-only fixtures, predictions, results, payouts, winnings
- Auto-refreshes every 60 seconds from the API

### Admin page (`site/admin.html`)
- Add/remove participants and matches
- Set bet amount, results, and predictions
- **Save contest data** — writes all data to the server

---

## Deploy on Netlify (recommended)

### Option A — Drag and drop (simple, static only)

1. Build the deploy folder:
   ```bash
   npm run build:deploy
   ```
2. Open https://app.netlify.com/drop
3. Drag the **`deploy`** folder onto the page.

**Limitation:** No server API. Public page uses bundled JSON; admin saves to **browser localStorage only** (not shared across devices). Re-run `npm run build:deploy` after site changes.

### Option B — Git connect (shared live data)

Netlify **cannot** write to a JSON file in a static deploy. Use **Netlify Functions + Netlify Blobs** (included in this repo).

### Steps

1. Push this repo to GitHub.
2. In [Netlify](https://app.netlify.com) → **Add new site** → **Import from Git**.
3. Build settings:
   - **Build command:** `npm install`
   - **Publish directory:** `site`
   - **Functions directory:** `netlify/functions` (auto from `netlify.toml`)
4. Deploy.
5. (Recommended) **Site settings → Environment variables** → add:
   - `CONTEST_ADMIN_SECRET` = a strong password (required for admin saves)
6. Open `https://your-site.netlify.app/admin.html`, edit data, click **Save contest data**.
7. Enter the admin password when prompted (same as `CONTEST_ADMIN_SECRET`).

The API lives at `/api/contest-data` (proxied to a serverless function). First load seeds from `site/data/contest-data.json` if no saved data exists yet.

### Local dev with Netlify Functions

```bash
npm install
npx netlify dev
```

Opens the site with a working `/api/contest-data` endpoint locally.

### Plain static preview (no save API)

```bash
cd site && npx serve .
```

Admin saves fall back to browser `localStorage` only.

---

## Why Google Drive saving often fails

Google Apps Script web apps frequently block **POST** requests from hosted sites (CORS / redirect issues). GET may work while Save fails. If you see this, switch to Netlify Blobs (above) instead of fighting Apps Script.

<details>
<summary>Google Drive setup (optional, not recommended for Netlify)</summary>

1. Upload `site/data/contest-data.json` to Google Drive.
2. Open [Google Apps Script](https://script.google.com) → paste `google-apps-script/Code.gs`.
3. Deploy → Web app (Execute as: **Me**, Access: **Anyone**).
4. Set `DATA_API_URL` in `site/js/config.js` to the Apps Script URL.

### "Google hasn't verified this app"

Click **Advanced** → **Go to project (unsafe)** → **Allow**. Only the script owner sees this once.

</details>

## Data format

Single JSON file (`contest-data.json`):

| Field | Description |
|-------|-------------|
| `participants` | Array of names |
| `participantMeta` | Fan countries per participant |
| `fixtures` | Match schedule (`id`, `timeIST`, `home`, `away`) |
| `matches` | Results and predictions per match |
| `betPerMatch` | Stake per match in ₹ |

## Notes

- Without a working API, the public page uses bundled `data/contest-data.json`; admin falls back to `localStorage`.
- Team flags use [flagcdn.com](https://flagcdn.com).
