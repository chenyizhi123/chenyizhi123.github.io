# Yizhi Chen — Robot Learning

A responsive, dark academic portfolio with authentic research videos, first-author / co-author sections, and accessible motion controls. Published with GitHub Pages; no dependencies or build required.

## Edit
- `index.html`: profile, publication metadata, research descriptions, and project links.
- `styles.css`: typography, dark theme, responsive layout, print and reduced-motion styles.
- `script.js`: active section navigation, reading progress, scroll reveals, motion controls, and video visibility handling.
- `credits.html`: source attribution for research figures and videos.
- `assets/`: public research media. The illustrated avatar is the original `avatar.jpg`.

Preview using `python3 -m http.server 8765`, then visit http://localhost:8765.

All research content is present in HTML without JavaScript. Videos are muted, use poster fallbacks, pause out of view or in a hidden tab, and respect `prefers-reduced-motion`. The page-level motion control pauses videos and visual transitions. No analytics, tracking, or external font requests.

## Publication metadata — updated 2026-09-21

Status updates supplied by the author:
- GeoAlign: accepted at **CoRL 2026**.
- UniLab: accepted at **CoRL 2026** (also shown in the supplied TATP-233 public profile).
- P³: **AAAI, under review**. No conference year or acceptance is inferred.

The author requested concise contribution labels rather than full author lists. GeoAlign and HierKick are in First-author work; the other six papers are labeled Co-author. Full author lists remain available through the paper links.

Identity was matched using the exact Scholar ID (`q47_njAAAAAJ`) from the original public homepage. Profile and real-robot project experience are retained from that page. ICRA 2026 authorship for A2CF and DAAC was confirmed against the official conference program after the author explained that the conference versions added their name. MAKP appears under the same conference author entry with matching Tongji affiliation and collaborators:
- A2CF: https://ras.papercept.net/conferences/conferences/ICRA26/program/ICRA26_ContentListWeb_5.html#thi2i_317
- DAAC: https://ras.papercept.net/conferences/conferences/ICRA26/program/ICRA26_ContentListWeb_4.html#wei2i_317
- MAKP: https://ras.papercept.net/conferences/conferences/ICRA26/program/ICRA26_ContentListWeb_3.html#tui2i_158

Those conference titles link to the final program; separate preprint links target the older arXiv versions. No citation metrics or unverified awards are displayed.

## Design references
- https://tairanhe.com/ — research-led structure and robot demonstrations.
- https://github.com/TATP-233 — First / Co-first Author and Co-author grouping without long author lists.

Original implementation; no template code or another researcher's imagery copied. The hero video is from the author's public GeoAlign project. The UniLab clip is explicitly labeled simulation.
