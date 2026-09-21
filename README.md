# Yizhi Chen — Academic homepage

A white-and-blue academic homepage focused on original paper architecture diagrams. Static HTML/CSS/JavaScript, published with GitHub Pages; no dependencies or build needed.

## Files
- `index.html`: profile, eight publication entries, projects, and contact details.
- `styles.css`: light palette, responsive publication list, figure viewer, and print styles.
- `script.js`: current-section navigation and accessible native-dialog figure enlargement with 1–4× zoom, fit reset, mouse dragging, native touch panning, and keyboard controls (+/−/0). Escape closes the viewer and focus returns to the selected figure. Without JavaScript, figure links open the full image directly.
- `assets/architecture/`: seven original paper architecture diagrams. `sources.json` records their provenance and licenses.
- `credits.html`: public figure attribution.
- `avatar.jpg`: original profile illustration.

To preview: `python3 -m http.server 8765`, then open http://localhost:8765.

No video playback, scroll reveals, external fonts, analytics, or tracking. Diagrams retain their original colors and aspect ratios. Prior-version media remains in Git history and may remain as unused files; it is not requested by the current page.

## Author-confirmed publication metadata — 2026-09-21
- GeoAlign — CoRL 2026, accepted; first author.
- HierKick — Robotica, accepted; first author. No issue, volume, DOI, or publication date is inferred.
- UniLab — CoRL 2026, accepted; co-author.
- P³ — AAAI, under review; co-author. Conference year unspecified.
- GLAD — RA-L, under review; co-author.
- A2CF, DAAC, MAKP — ICRA 2026; co-author.

The owner requested contribution labels instead of full author lists. Conference authorship for A2CF and DAAC was independently verified against the final official ICRA 2026 program; older arXiv versions have different author lists. The conference links are retained alongside explicitly labeled preprint links:
- A2CF: https://ras.papercept.net/conferences/conferences/ICRA26/program/ICRA26_ContentListWeb_5.html#thi2i_317
- DAAC: https://ras.papercept.net/conferences/conferences/ICRA26/program/ICRA26_ContentListWeb_4.html#wei2i_317
- MAKP: https://ras.papercept.net/conferences/conferences/ICRA26/program/ICRA26_ContentListWeb_3.html#tui2i_158

GeoAlign's current architecture image and Project link come from the author's supplied project page: https://chenyizhi123.github.io/geoalign-project/. GLAD and UniLab diagrams use the v3 papers. No authentic public MAKP method figure could be found; that entry is deliberately text-only without a substitute illustration.

## Design references
- https://caozx1110.github.io/ — persistent profile sidebar, compact reading column, and publication hierarchy. Adapted as an original blue-and-white, figure-led layout.
- https://tairanhe.com/ — academic profile and research-forward structure.
- https://github.com/TATP-233 — First-author / Co-author organization.

Original implementation; no reference-site source code copied.

## Contact information
The author supplied their WeChat QR card and explicitly requested it on the public homepage. `assets/wechat-contact.jpg` is an unchanged copy of that card, with full-size viewing and download. Contact emails are `1839132568@qq.com` and `15970600542@163.com`; GitHub and Google Scholar links are also shown in Contact.

## Visual refinement
A pale blue-gray surround frames the white reading column. First-author entries use a light blue surface and accent rule. Wide architecture figures span the reading column to preserve legibility; all source images remain uncropped. The biography distinguishes VLA, humanoid WAM, and humanoid locomotion/control.

News lists author-confirmed acceptance announcements and the GeoAlign project page. Venue labels are used instead of unverified announcement dates.
