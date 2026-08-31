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

Each project's "Open dashboard" link points at one of these files, plus one
supporting file (a workbook, notebook, or Power BI file — whatever you actually
built). Project 01 is the exception — its "Open dashboard" jumps straight to the
Flagship section's live mockup instead of a file, since that's the one project
with a real interactive dashboard on the page.

| Filename | Project |
|---|---|
| `case-study-01-retail-demand-forecasting.pdf` | 01 · Retail Demand Forecasting Model (not currently linked — "Open dashboard" points at Flagship instead; keep this file only if you want a separate write-up somewhere) |
| `case-study-01-workbook.xlsx` | ↳ its Excel workbook |
| `case-study-02-churn-early-warning.pdf` | 02 · Customer Churn Early-Warning System — "Open dashboard" |
| `case-study-02-notebook.pdf` | ↳ its model notebook (export your .ipynb to PDF so it opens directly in the browser) |
| `case-study-03-marketing-attribution.pdf` | 03 · Marketing Attribution Model — "Open dashboard" |
| `case-study-03-power-bi-file.pbix` | ↳ its Power BI file |
| `case-study-04-support-ticket-sla.pdf` | 04 · Support Ticket Triage & SLA Tracker — "Open dashboard" |
| `case-study-04-workbook.xlsx` | ↳ its Excel workbook |
| `case-study-05-checkout-funnel.pdf` | 05 · Checkout Funnel Experiment Analysis — "Open dashboard" |
| `case-study-05-notebook.pdf` | ↳ its notebook |

## Flagship dashboard

| Filename | Used for |
|---|---|
| `flagship-excel-control-tower.xlsx` | "Excel workbook" link in the Flagship section |
| `flagship-power-bi-file.pbix` | "Power BI file" link in the Flagship section |

Note: "Open live dashboard" doesn't need a file — it opens the on-page mockup panel
(and its "Full screen" button), since there's no separately-hosted dashboard app.

## Certificates (Case Studies carousel)

Clicking a card (not its button) opens an enlarged showcase view of the same
card. Its "Open dashboard" button uses these files:

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
