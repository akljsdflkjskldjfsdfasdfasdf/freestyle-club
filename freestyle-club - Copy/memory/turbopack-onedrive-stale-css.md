---
name: turbopack-onedrive-stale-css
description: Dev server (Turbopack) serves stale CSS/HMR because project lives in OneDrive; restart+clear .next to verify
metadata:
  type: project
---

This project lives under `OneDrive\Desktop\...`, and OneDrive's file syncing interferes with Turbopack's file watcher. Edits to `globals.css` (and likely other files) are sometimes NOT picked up by `next dev` HMR — the served CSS chunk keeps the same hash and silently omits the latest rules.

**Why:** OneDrive intercepts/delays filesystem change events the watcher relies on.

**How to apply:** When verifying CSS/style changes against a running dev server, don't trust HMR. Stop all `next dev` node processes, `Remove-Item -Recurse -Force .next`, then start a fresh server and re-fetch. A clean compile reflects the source correctly. Seen during the 2026-06-01 hero/marquee/footer fix pass.
