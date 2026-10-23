# Yizhi Chen — Academic homepage

A white-and-blue academic homepage focused on original paper architecture diagrams. Static HTML/CSS/JavaScript, published with GitHub Pages; no dependencies or build needed.

## Files
- `index.html`: profile, eight publication entries, projects, and contact details.
- `styles.css`: light palette, responsive publication list, figure viewer, and print styles.
- `script.js`: current-section navigation and accessible native-dialog figure enlargement with 1–4× zoom, fit reset, mouse dragging, native touch panning, and keyboard controls (+/−/0). Escape closes the viewer and focus returns to the selected figure. Without JavaScript, figure links open the full image directly.
- `assets/architecture/`: seven original paper architecture diagrams and a clearly labeled, abstract-based MAKP overview. `sources.json` records their provenance and licenses.
- `credits.html`: public figure attribution.
- `avatar.jpg`: original profile illustration.

To preview: `python3 -m http.server 8765`, then open http://localhost:8765.

No video playback, scroll reveals, external fonts, analytics, or tracking. Diagrams retain their original colors and aspect ratios. Prior-version media remains in Git history and may remain as unused files; it is not requested by the current page.

## Author-confirmed publication metadata — 2026-09-21
- GeoAlign — CoRL 2026, accepted; first author.
- HierKick — Robotica, accepted; first author. No issue, volume, DOI, or publication date is inferred.
- UniLab — CoRL 2026, accepted; co-author.
- P³ — AAAI, under review; co-author. Conference year unspecified.
- GLAD — RA-L, accepted; co-author (confirmed by author on October 5, 2026).
- A2CF, DAAC, MAKP — ICRA 2026; co-author.

The owner requested contribution labels instead of full author lists. Conference authorship for A2CF and DAAC was independently verified against the final official ICRA 2026 program; older arXiv versions have different author lists. The conference links are retained alongside explicitly labeled preprint links:
- A2CF: https://ras.papercept.net/conferences/conferences/ICRA26/program/ICRA26_ContentListWeb_5.html#thi2i_317
- DAAC: https://ras.papercept.net/conferences/conferences/ICRA26/program/ICRA26_ContentListWeb_4.html#wei2i_317
- MAKP: https://ras.papercept.net/conferences/conferences/ICRA26/program/ICRA26_ContentListWeb_3.html#tui2i_158

GeoAlign's current architecture image and Project link come from the author's supplied project page: https://chenyizhi123.github.io/geoalign-project/. GLAD and UniLab diagrams use the v3 papers. The MAKP publisher record and DOI were verified. Its public conference abstract provides a diffusion generator, three learning stages, and Booster T1 validation. The site now includes an original FigureSpec method-summary SVG based only on that abstract, clearly labeled as a redrawn overview, rather than a paper figure. No inaccessible full-paper details are inferred.

## Design references
- https://caozx1110.github.io/ — persistent profile sidebar, compact reading column, and publication hierarchy. Adapted as an original blue-and-white, figure-led layout.
- https://tairanhe.com/ — academic profile and research-forward structure.
- https://github.com/TATP-233 — First-author / Co-author organization.

Original implementation; no reference-site source code copied.

## Contact information
The author supplied their WeChat QR card and explicitly requested it on the public homepage. `assets/wechat-contact.jpg` is an unchanged copy of that card, with full-size viewing and download. Contact emails are `1839132568@qq.com` and `15970600542@163.com`; GitHub and Google Scholar links are also shown in Contact.

## Current presentation — October 23, 2026

The homepage uses a mist-white background, white surfaces, charcoal typography, and restrained slate-violet accents. All publication cards share the same visual treatment and retain separate First-author / Co-author groups. Architecture figures preserve their full frames and original colors. The image viewer supports zoom and pan.

The decorative opening mosaic contains four real robot platforms: Booster T1, Unitree Go2, Unitree G1, and ALOHA. Booster T1 comes from the real-world panel of HierKick Figure 3; the original combined figure is stored unchanged and only the real-world panel is shown through CSS. G1 is shown with its complete source frame. The earlier dexterous-hand simulation image is no longer displayed. `assets/robots/sources.json` and Media credits record provenance. The mosaic is separate from project and publication content.

## News dates

- GLAD — RA-L accepted, reported by the author on October 5, 2026. This is the announcement date; the precise acceptance date is not inferred.
- GeoAlign and UniLab — CoRL 2026 accepted September 5, 2026, confirmed by the author.
- HierKick — Robotica accepted September 3, 2026, confirmed by the author.
- ICRA 2026 — January 31, 2026, the official conference acceptance notification date. Source: https://2026.ieee-icra.org/attend/registration-information/.

The project-page launch announcement was removed at the author's request; the GeoAlign publication retains its Project link.

The author also confirmed development work on Unitree Go2, Go2W, B2W, and HONOR quadruped robots on October 23, 2026. This is explicitly described in Experience. The Go2 photo is DAAC Figure 6 (left panel), shown as an additional decorative tile. No Go2W or HONOR photo is substituted from another platform.

The opening hardware line explicitly lists Booster T1, G1, Go2, Go2W, B2W, HONOR quadrupeds and ALOHA. The owner disliked the green theme; the current palette uses neutral mist-white and charcoal with restrained slate-violet accents. All robot photo labels have the same small decorative dot, generated consistently with CSS.

## Research exploration and navigation
Publication search supports titles, methods, and confirmed robot platforms. Topic lenses, publication-status filters, accurate visible counts, empty states and Reset combine without changing the source publication metadata. News and quick-navigation links reveal any hidden target paper. Static HTML still shows every publication when JavaScript is disabled.

Quick navigation is available from the header and Cmd/Ctrl+K; arrow keys and Enter move and select. Escape closes even when the search field contains text. The / key focuses publication search. Native figure zoom and focus restoration remain available.

The current refinement deepens graphite/violet text and badge colors. All four robot labels retain their matching dot. MAKP's source is saved in figures/specs/makp-overview.json; the SVG and vector PDF are reproducible exports.
