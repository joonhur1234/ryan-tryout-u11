# Ryan Hur — Prospects Game Scouting Report

**Live preview (hosted by Claude, works right now):** https://claude.ai/artifact/NMrkzyZUNGoV2YxNUEAo2A
Use the steps below to also get a permanent `github.io` link you control.

A one-page site built for Ryan's U11 AAA Prospects Game prep: what the game is, what evaluators score, a forward playbook, do/don't habits, an interactive pre-game checklist, and three embedded game-film clips.

Everything is plain HTML/CSS/JS — no build step, no dependencies. That makes it a perfect fit for **GitHub Pages**, which hosts static sites like this for free.

## Files

```
index.html
style.css
script.js
assets/
   videos/clip1.mp4, clip2.mp4, clip3.mp4     (Phase 1 clips)
   videos/LiveBarn-*.mp4                     (Phase 2 Prospects Game goals)
   videos/20260905_211204.mp4                (practice video)
  posters/clip1.jpg, clip2.jpg, clip3.jpg
```

## Deploy it to a free GitHub Pages URL

You'll need a free GitHub account (github.com) — sign up if you don't have one.

1. **Create a new repository**
   Go to github.com → click the **+** in the top right → **New repository**.
   Name it something like `ryan-prospects-game` → keep it **Public** → click **Create repository**. Don't add a README/gitignore (we already have files).

2. **Upload the site files**
   On the new repo's page, click **uploading an existing file**. Drag in all the files and folders from this download (`index.html`, `style.css`, `script.js`, and the whole `assets` folder, keeping that folder structure). Commit the upload.

   *(If you're comfortable with the command line instead, see "Command-line option" below.)*

3. **Turn on GitHub Pages**
   In the repo, go to **Settings → Pages** (left sidebar). Under **Build and deployment → Source**, choose **Deploy from a branch**. Under **Branch**, pick **main** and folder **/(root)** → **Save**.

4. **Get your URL**
   Wait about 1 minute, then refresh that same Pages settings page. GitHub will show your live link, in the form:

   ```
   https://YOUR-USERNAME.github.io/ryan-prospects-game/
   ```

   That's the free URL — share it with Ryan, print it, or bookmark it on his phone.

### Command-line option

If you'd rather push from a terminal:

```bash
cd path/to/this/folder
git init
git add .
git commit -m "Ryan's prospects game scouting report"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/ryan-prospects-game.git
git push -u origin main
```

Then do step 3 above (turn on Pages in Settings) to get the live link.

## Notes

- The pre-game checklist saves checked items in the browser (`localStorage`), so it remembers state next time Ryan opens the page on the same device/browser.
- Video files are already sized well under GitHub's limits (100 MB per file), so they'll upload and serve fine directly from the repo. The first three clips are Phase 1; the two `LiveBarn-*.mp4` files are Phase 2 Prospects Game goals.
- To update any tips or swap in new game film later, just edit `index.html` (text) or replace the files in `assets/videos` — keep the same filenames (`clip1.mp4` etc.) or update the `<source>` paths in `index.html` to match.
