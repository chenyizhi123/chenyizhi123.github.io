# Yizhi Chen — Academic homepage

Responsive static academic homepage, deployed with GitHub Pages. No dependency installation or build required.

## Edit
- `index.html`: biography, publications, projects, contact details.
- `styles.css`: colors, type, responsive layout, reduced-motion and print styles.
- `script.js`: current year and active navigation.
- `assets/`: paper figures. See `credits.html` for source attribution.
- `avatar.jpg`: original profile artwork.

Preview with `python3 -m http.server 8765`, then visit http://localhost:8765.

## Content verification — 2026-09-21
Identity matched by the exact Scholar identifier on the original public homepage (`q47_njAAAAAJ`). Scholar was rate-limited, so preprints were checked against arXiv and conference papers against the official ICRA 2026 program. No citation metrics or unverified acceptance claims are shown.

Eight publications are included. The owner clarified that both 2025 preprints added their name in the ICRA 2026 final versions; this was independently confirmed against the official program, and author order follows that program (not the old arXiv metadata). MAKP was also found under the same conference author entry with matching Tongji affiliation and collaborators:
- A2CF: https://ras.papercept.net/conferences/conferences/ICRA26/program/ICRA26_ContentListWeb_5.html#thi2i_317
- DAAC: https://ras.papercept.net/conferences/conferences/ICRA26/program/ICRA26_ContentListWeb_4.html#wei2i_317
- MAKP: https://ras.papercept.net/conferences/conferences/ICRA26/program/ICRA26_ContentListWeb_3.html#tui2i_158

The two older arXiv links are explicitly labeled as 2025 preprints. P³ is newly included based on its arXiv author list. Bio and project details come from the existing personal homepage.

## Design references
An original static implementation, informed by the clear academic content organization of [al-folio](https://github.com/alshedivat/al-folio) and the illustrated publication layout on [Jon Barron’s homepage](https://jonbarron.info/). No template source code copied.
