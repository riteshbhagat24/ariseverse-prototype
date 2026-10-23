# ARISEVERSE — Website & Learning Portal (Prototype)

Clickable prototype of the ARISEVERSE public website and its student learning portal, built for client review.
It is plain HTML, CSS and JavaScript: no build step, no backend, no dependencies.

- **Website** (`index.html`): Home, Academy, ARIA X, Careers, For Employers, Research, About, Apply
- **Learning portal** (`portal.html`): sign-in, welcome, dashboard, 52-module curriculum, lesson player, ARIA X hub, live classes, assignments, assessments, market intelligence, experts, careers, community, progress, settings

The two are linked. Applying on the website (`#apply`) creates a learner profile, and the portal's welcome screen picks it up.

## Run it locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8080
```

Then visit http://localhost:8080.

## Deploy

Any static host works. Upload the repository as it is.

- **GitHub Pages:** go to Settings → Pages → Deploy from a branch → `main` / root. `.nojekyll` is included.
  GitHub Pages needs a public repository unless the account is on a paid plan. See *Ownership* below before making it public.
- **Netlify / Vercel / Cloudflare Pages:** import the repository with no build command and `/` as the output directory. These can deploy from a private repository.

## Single-file version

To share the whole prototype as one HTML file (about 15 MB, with media embedded):

```bash
python3 tools/package_single.py . dist/ARISEVERSE-Prototype.html
```

`dist/` is git-ignored.

## Project structure

```
index.html            Website (hash-routed pages)
portal.html           Learning portal shell (hash-routed views)
assets/
  brand.css           Shared tokens: colours, type, buttons, pills, forms
  data.js             Single source of content: ARISE Method, 52 modules, phases,
                      validated stats, Market Health Diagnostic logic, media map
  site.css, site.js   Website styles and behaviour
  portal.css, portal.js  Portal styles and behaviour
media/
  img/ people/ video/ Optimised stock photos (WebP), sample avatars, MP4 clips + posters
  CREDITS.md          Source of every media file
tools/
  package_single.py   Builds the single-file HTML
```

## Editing content

- **Curriculum, phases, stats, diagnostic thresholds:** `assets/data.js`. Both the website and the portal read from it.
- **Images and video:** add files under `media/`, then reference them through the `AV.media` helpers in `data.js`.
- Validated figures carry *Validated / Target / Assumption* labels, matching the client's investor document. Keep them when you change numbers.

## Prototype limitations

- Forms don't send anything. Applicant data stays in the visitor's browser (`localStorage`, keys `av:*`). The portal's Settings page has **Reset demo**.
- ARIA X replies, roleplays, news, schedules, jobs and learner progress are scripted sample data.
- Fonts load from Google Fonts. Offline, the pages fall back to system fonts.

## Media

The photos and videos are free stock used as placeholders:

- **Photos:** Unsplash, under the Unsplash License.
- **Videos:** Pexels, under the Pexels License.

Both licences allow commercial use without attribution. Sources are listed in `media/CREDITS.md`.

People in the stock images are models, not ARISEVERSE students, graduates, staff or partners. Replace the stock media with the client's own photography before launch. The founder appears only as a monogram until a real photo is supplied.

## Ownership

The ARISE Method, its 11 frameworks and 52 named module tools, the ARIA X name and all programme content belong to ARISEVERSE Global Holdings. This is a client prototype: get the client's approval before hosting it publicly.
