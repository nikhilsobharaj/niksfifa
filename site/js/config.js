/**
 * Data API — use Netlify Blobs when hosted on Netlify (recommended).
 * Set DATA_API_URL to your Google Apps Script URL only if you prefer Google Drive.
 */
export const CONFIG = {
  DATA_API_URL: "/api/contest-data",
  LOCAL_STORAGE_KEY: "fifaContestRound32_lsg_v1",
  DEFAULT_BET_PER_MATCH: 20,
  DEFAULT_BET_FIRST_SCORER: 10,
  /** Optional admin password for saves (must match Netlify env CONTEST_ADMIN_SECRET). */
  ADMIN_SECRET: ""
};
