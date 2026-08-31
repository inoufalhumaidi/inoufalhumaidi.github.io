# Put your files here

This folder holds every real file the site links to — your photo, your CV, and the
backing documents for each project and certificate. The site already points at the
exact filenames below, so **once you drop a correctly-named file in this folder and
push, the matching link on the site just works — no code editing needed.**

If you'd rather use different filenames, that's fine too — just update the matching
`href="..."` in `index.html` to point at whatever you named the file (see the root
`README.md` for how to find things in `index.html`).

## Profile

| Filename | Used for | Notes |
|---|---|---|
| `cv.pdf` | Every "Download CV" button (header, hero, menu, contact) | Keep it a PDF so it opens the same way for everyone. |
| `profile-photo.jpg` | The photo/portrait square in the dossier card, top-left of the page | Square image, at least 600×600px. If this file is missing, the card just shows your "NA" initials instead — nothing breaks. |

## Case studies (Selected work section)

Every project shows the same three buttons — DASHBOARD, NOTEBOOK, POWER BI FILE.
Project 01 is the one exception: its DASHBOARD button jumps straight to the
Flagship section's live mockup instead of a file, since that's the one project
with a real interactive dashboard on the page.

| Filename | Project · button |
|---|---|
| — (points at `#flagship` instead) | 01 · Retail Demand Forecasting Model — DASHBOARD |
| `case-study-01-notebook.pdf` | 01 — NOTEBOOK |
| `case-study-01-power-bi-file.pbix` | 01 — POWER BI FILE |
| `case-study-02-churn-early-warning.pdf` | 02 · Customer Churn Early-Warning System — DASHBOARD |
| `case-study-02-notebook.pdf` | 02 — NOTEBOOK |
| `case-study-02-power-bi-file.pbix` | 02 — POWER BI FILE |
| `case-study-03-marketing-attribution.pdf` | 03 · Marketing Attribution Model — DASHBOARD |
| `case-study-03-notebook.pdf` | 03 — NOTEBOOK |
| `case-study-03-power-bi-file.pbix` | 03 — POWER BI FILE |
| `case-study-04-support-ticket-sla.pdf` | 04 · Support Ticket Triage & SLA Tracker — DASHBOARD |
| `case-study-04-notebook.pdf` | 04 — NOTEBOOK |
| `case-study-04-power-bi-file.pbix` | 04 — POWER BI FILE |
| `case-study-05-checkout-funnel.pdf` | 05 · Checkout Funnel Experiment Analysis — DASHBOARD |
| `case-study-05-notebook.pdf` | 05 — NOTEBOOK |
| `case-study-05-power-bi-file.pbix` | 05 — POWER BI FILE |

Export a Jupyter notebook to PDF so the NOTEBOOK link opens directly in the browser
instead of downloading a `.ipynb` file most visitors can't open.

The old per-project `case-study-01-retail-demand-forecasting.pdf`,
`case-study-01-workbook.xlsx` and `case-study-04-workbook.xlsx` files aren't linked
from anywhere anymore now that every project uses the same three buttons — keep
them only if you still want a write-up or workbook hosted somewhere else.

## Flagship dashboard

| Filename | Used for |
|---|---|
| `flagship-notebook.pdf` | "NOTEBOOK" button in the Flagship section |
| `flagship-power-bi-file.pbix` | "POWER BI FILE" button in the Flagship section |

Note: "LIVE DASHBOARD" doesn't need a file — it opens the on-page mockup panel
(and its "Full screen" button), since there's no separately-hosted dashboard app.
`flagship-excel-control-tower.xlsx` isn't linked anymore now that this section
uses the same three-button set as the projects above.

## Certificates (Case Studies carousel)

Clicking a card (not its button) opens an enlarged showcase view of the same
card. Its "DASHBOARD" button uses these files:

| Filename | Certificate |
|---|---|
| `certificate-google-data-analytics.pdf` | Google — Data Analytics Professional Certificate |
| `certificate-microsoft-power-bi.pdf` | Microsoft — Power BI Data Analyst Professional Certificate |
| `certificate-datacamp-sql.pdf` | DataCamp — SQL for Data Science |

## Credentials section

| Filename | Row |
|---|---|
| `credential-education-transcript.pdf` | Education |
| `credential-courses-bootcamps.pdf` | Courses & Bootcamps |
| `credential-honors-awards.pdf` | Honors & Awards |

The "Professional Certificates" row's VIEW button instead jumps to the Case Studies
carousel above, since that's where those three certificates already live individually
— no separate file needed for that one.

## A file isn't ready yet?

Leave the link pointing at a filename that doesn't exist yet — clicking it will just
404 until you add the file. Nothing else on the site breaks. Add files whenever you
have them; there's no order you need to do this in.
