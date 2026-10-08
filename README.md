# That’s A Flex Studio

A static HTML, CSS and JavaScript website. The folder containing this README is the project root. No installation, compilation, database, API keys or environment variables are required to deploy it.

## Deploy through GitHub and Vercel

1. Create a GitHub repository and upload this folder’s project files. `vercel.json`, `package.json`, `README.md`, `dist/` and `scripts/` should be at the repository’s top level; do not put them inside another `site/` folder. Local `.git/`, `.openai/` and `design/originals/` do not need to be uploaded through the GitHub website.
2. In Vercel, choose **Add New → Project**, then import that GitHub repository.
3. Keep **Root Directory** at the repository root (`./`). The included `vercel.json` selects **Other**, skips install and build commands, and publishes **dist**.
4. Click **Deploy**. Future pushes to the connected production branch deploy automatically.

The site itself requires no ChatGPT sign-in on Vercel. Vercel’s own deployment-protection settings are controlled in your Vercel account.

If you use Git locally, existing source history has been preserved. The existing remote belongs to the earlier Sites host; it is not a GitHub repository. To push to a newly created empty GitHub repo:

```sh
git add .
git commit -m "Prepare website for Vercel"
git remote add github YOUR_GITHUB_REPOSITORY_URL
git push -u github HEAD:main
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with the URL GitHub gives you. No GitHub repository or Vercel deployment is created by this local preparation.

Vercel documentation: https://vercel.com/docs/builds/configure-a-build

## Folder guide

```text
dist/                   Website files served to visitors
  index.html            Page content and collection markup
  styles.css            Styling and responsive layouts
  app.js                Navigation, media and playlist interactions
  config.js             Contact and media settings
  contact.js            WhatsApp message builders
  assets/               Optimized photos, logos and fonts (if used)
scripts/
  server.mjs            Local preview server
  validate.mjs          Site structure and asset checks
  contact-check.mjs     WhatsApp inquiry checks
design/
  originals/            Original photos/logos; local only
vercel.json             Vercel deployment configuration
package.json            Optional local commands; no dependencies
.openai/                Existing Sites connection; not used by Vercel
```

`dist/` is the editable static website, not generated output. Keep it in Git.

## Local preview and checks

With Node.js installed:

```sh
npm run dev
npm run check
```

Open http://127.0.0.1:4173 for the preview. No `npm install` is needed. You can also run each script directly with Node.

## Editing the site

- Edit page content in `dist/index.html` and appearance in `dist/styles.css`.
- Contact details and approved media are configured in `dist/config.js`. WhatsApp is currently **+1 829-802-5315**. If changing the number or messages, also update the fallback links in `index.html` and the contact checks.
- Place web-ready images in `dist/assets/`. Supplied original artwork remains in `design/originals/`. Keep responsive image paths in both `config.js` and the HTML fallback consistent.
- Four live Traktrain playlists: Noches de Detroit (2602), Calle de Detroit (2603), Southern Nights (2604), Southern Streets (2605). Players stay hidden and unloaded until clicked. A Browse playlists selector beside Close playlist switches between collections; switching or closing unloads the previous player and stops its audio. Playlist markup is in `index.html`, with interactions in `app.js`. Traktrain controls its own theme.
- The four live collections use supplied square artwork in `dist/assets/`. Fuego en Detroit and Sueños are hidden for now; Flex Sessions remains marked as upcoming.
- `dist/productions.html` is the dedicated Video/Audio catalogue, styled by `productions.css` and controlled by `productions.js`. Edit the video and Spotify cards there. Tabs load only their own players and unload the other tab to stop playback. Direct links ending in `#audio` open Spotify. The homepage uses linked previews and shows only the first video on mobile; edit those in `index.html`.
- The booking form prepares a WhatsApp message. It does not send automatically, store bookings or reserve a session.
- Newsletter signup remains disabled until a real subscription endpoint is supplied. Instagram links are active.
- The social preview image now uses this site’s `/assets/studio-square.webp`, rather than the previous private host. After choosing a permanent domain, you may set an absolute `og:image` URL and canonical URL in `index.html` for social sharing and SEO.

## Existing Sites preview

The `.openai/hosting.json` connection and existing Git history are retained so the previous private preview can still be maintained. Local Windows publishing helpers are kept in `.openai/tools/` and ignored by Git. They are not required for GitHub or Vercel, and Vercel serves only `dist/`.
