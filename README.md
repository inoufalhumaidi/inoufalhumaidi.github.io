# Nouf Alhumaidi — Analyst Portfolio

Personal portfolio site, built with plain HTML/CSS/JS and hosted on GitHub Pages.

Live at: https://inoufalhumaidi.github.io

## Structure

- `index.html` — every section's content and structure
- `styles.css` — colors, fonts, spacing, animations
- `script.js` — the accordion, carousel, skill bubbles, menu, live clock, scroll effects
- `assets/` — **your own files go here** (photo, CV, project write-ups, certificates) — see `assets/README.md`

No build step, no dependencies to install. Edit a file, save it, push — that's the whole workflow.

## 1. Adding your own material

Open **`assets/README.md`** — it lists every file the site expects (exact filename,
what it's for) in one table. Drop your file in with that exact name and the matching
link on the site starts working automatically. Nothing to touch in the code.

Quick examples:
- Your CV → `assets/cv.pdf`
- Your photo → `assets/profile-photo.jpg` (shows in the dossier card top-left; if you
  skip this, it just keeps showing your "NA" initials — nothing looks broken)
- A project write-up → e.g. `assets/case-study-01-retail-demand-forecasting.pdf`

You don't need to do these all at once or in any order. A missing file just means that
one link 404s when clicked — everything else on the page is unaffected.

## 2. Editing written content

Everything you'd want to change — your bio, project descriptions, job history, skills
— is plain text inside `index.html`. Open it in any text editor, use **Find** (Ctrl+F)
for the phrase you want to change, edit the text between the tags, save, and push.
You don't need to understand HTML beyond "don't delete the `<...>` bits."

Here's where each part of the page lives, top to bottom:

| Section on the page | Find this in `index.html` | What you can safely edit |
|---|---|---|
| Header name / nav | `NOUF ALHUMAIDI` near the top | Your name, the nav labels |
| Dossier card (hero, left) | `class="idcard"` | Name, role, location/focus/status/seeking, social links |
| Headline (hero, right) | `I turn scattered data into` | Your one-line pitch, the lead sentence, the tool list under the buttons |
| Skills marquee | `class="skills-section"` | The two row labels and titles are in the HTML; the **detailed bullet lists** shown in the click-to-open bubble live in `script.js`, in the `skillGroups` object near the top — each category is a plain list of strings you can rename, add to, or remove |
| Selected work | `id="work"` | Each project is one `<div class="case-item">` block: title (`<h3>`), the one-line stat, the tag list, and the Situation/Built/Showed tab text. Copy a whole block to add a 6th project, or delete one to remove it |
| Flagship dashboard | `id="flagship"` | The description paragraph and the mock KPI numbers/tab content (the tab content lives in `script.js` in the `panelData` object) |
| Case studies (certificates) | `id="case-studies"` | Each certificate is one `<div class="carousel-page">` — issuer, title, description. Add or remove a page here and update the dot count to match (`carousel-dots`) |
| Experience | `id="experience"` | Each role is one `<article class="xrow">`: dates, title, company, description. The Volunteering line is the `cred-text-sub` block right below it |
| Credentials | `id="credentials"` | Four rows — Education, Professional Certificates, Courses & Bootcamps, Honors & Awards — each a `<p class="cred-text-line">` |
| Contact | `id="contact"` | Email, LinkedIn, GitHub — each appears in two places: the hero dossier card/menu sidebar, and the contact cards at the bottom |
| Footer | `<footer class="site-footer">` | Copyright name/year |

A few things worth knowing before you edit:

- **Section order** matters for the nav: the header menu and full-screen menu list
  read the page top-to-bottom, so if you reorder `<section>` blocks, also reorder the
  matching links in `<nav class="topnav">` and `<nav class="menu-list">` (both near
  the very top of `index.html`) so they still point at the right place in the right order.
- **Placeholder text** like `COMPANY NAME` and `University Name` is meant to be
  replaced — search for those exact phrases to find every spot.
- Don't rename a section's `id="..."` unless you also update every link that points
  to it (`href="#that-id"`) — otherwise that nav link stops working.

## Deploying

Pushing to `master` triggers GitHub Pages to redeploy automatically (repo Settings →
Pages, source: `master` branch, `/ (root)`). A deploy usually goes live within a
minute or two.
