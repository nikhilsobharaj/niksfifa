/**
 * Builds the deploy/ folder for Netlify drag-and-drop.
 * Run: npm run build:deploy
 */
import { cpSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const siteDir = join(root, "site");
const deployDir = join(root, "deploy");

const deployConfig = `/**
 * Static Netlify Drop config — no server API (drag-and-drop deploy).
 * Admin saves to this browser only (localStorage).
 * For shared storage across devices, deploy via Git + Netlify Functions instead.
 */
export const CONFIG = {
  DATA_API_URL: "",
  LOCAL_STORAGE_KEY: "fifaContestRound32_lsg_v1",
  DEFAULT_BET_PER_MATCH: 20,
  ADMIN_SECRET: ""
};
`;

const deployReadme = `# Netlify Drag-and-Drop Deploy

Drag this entire **deploy** folder to:

https://app.netlify.com/drop

## After deploy

- Public results: \`https://your-site.netlify.app/\`
- Admin: \`https://your-site.netlify.app/admin.html\`

## Important — data storage

This drag-and-drop build is **static only** (no server API).

| Page | Data source |
|------|-------------|
| Public results | \`data/contest-data.json\` bundled in this folder |
| Admin | Browser **localStorage** on the device you use |

Admin **Save** stores data in your browser only — other users/devices will **not** see admin changes unless you update \`data/contest-data.json\` and re-deploy.

## Shared live data (recommended)

For saves that sync to all visitors, deploy from Git instead:

1. Push the full project repo to GitHub
2. Connect the repo in Netlify (not drag-and-drop)
3. Build command: \`npm install\`
4. Publish directory: \`site\`
5. Set env var \`CONTEST_ADMIN_SECRET\`

See the main README in the project root.

## Rebuild this folder

From the project root:

\`\`\`bash
npm run build:deploy
\`\`\`
`;

rmSync(deployDir, { recursive: true, force: true });
mkdirSync(deployDir, { recursive: true });

cpSync(siteDir, deployDir, { recursive: true });
writeFileSync(join(deployDir, "js", "config.js"), deployConfig, "utf8");
writeFileSync(join(deployDir, "README.md"), deployReadme, "utf8");

console.log("deploy/ folder ready for Netlify drag-and-drop.");
