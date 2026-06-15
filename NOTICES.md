# Third-party content and attribution

This repository contains material in several categories with different licensing:

1. **The application source code** (everything under `src/`, `scripts/`, `public/` excluding `public/data/`, and the configuration files at the repo root) is original work by the project maintainer and is licensed under the **MIT License** — see [`LICENSE`](LICENSE).
2. **The Pathfinder spell text** loaded by the application — both the truncated samples in `sample_data/` and any complete spell JSON supplied by contributors via `SPELLS_PF1E_PATH` / `SPELLS_PF2E_PATH` — is the property of **Paizo Inc.** and is redistributed under the Pathfinder licenses described below.
3. **The Dungeons & Dragons 5th Edition spell text** — the samples in `sample_data/` and any JSON supplied via `SPELLS_DND5E_PATH` — is from the **System Reference Document 5.2**, © **Wizards of the Coast LLC**, redistributed under the **Creative Commons Attribution 4.0** license as described below.

---

## Pathfinder 1st Edition spell data — Open Game License v1.0a

PF1e spell text is **Open Game Content** distributed under the Open Game License, Version 1.0a, published by Wizards of the Coast, Inc. The full text of OGL 1.0a is available at <https://opengamingfoundation.org/ogl.html>.

### Section 15 — Copyright notices

> System Reference Document. Copyright 2000, Wizards of the Coast, Inc.; Authors Jonathan Tweet, Monte Cook, Skip Williams, based on material by E. Gary Gygax and Dave Arneson.
>
> Pathfinder Roleplaying Game Core Rulebook © 2009, Paizo Inc.; Author: Jason Bulmahn, based on material by Jonathan Tweet, Monte Cook, and Skip Williams.
>
> Pathfinder Roleplaying Game Advanced Player's Guide © 2010, Paizo Inc.; Author: Jason Bulmahn.
>
> Pathfinder Roleplaying Game Ultimate Magic © 2011, Paizo Inc.; Authors: Jason Bulmahn, Tim Hitchcock, Colin McComb, Rob McCreary, Jason Nelson, Stephen Radney-MacFarland, Sean K Reynolds, Owen K.C. Stephens, and Russ Taylor.
>
> Pathfinder Roleplaying Game Ultimate Combat © 2011, Paizo Inc.; Authors: Jason Bulmahn, Tim Hitchcock, Colin McComb, Rob McCreary, Jason Nelson, Stephen Radney-MacFarland, Sean K Reynolds, Owen K.C. Stephens, and Russ Taylor.

The redistributed JSON may include Open Game Content from additional Paizo source documents not enumerated above. **Anyone supplying their own PF1e spell JSON (via the upstream parser or another source) is responsible for carrying the complete Section 15 chain from that source through to any downstream redistribution.**

---

## Pathfinder 2nd Edition (Remaster) spell data — ORC License

PF2e Remaster content is distributed under the **ORC License** held in trust by Azora Law, an Idaho Professional Corporation. The full text of the ORC License is available at <https://paizo.com/orclicense>.



This project uses Pathfinder Remaster content as Licensed Material under the ORC License. Reserved Material in the Pathfinder Second Edition Remaster Project, including the names of Paizo Inc. characters, places, and proper nouns, remains the property of Paizo Inc. and is not licensed.

> This product is licensed under the ORC License located at the Library of Congress and available online at multiple locations including <https://paizo.com/orclicense>, <https://azoralaw.com/orclicense>, and others. All warranties are disclaimed as set forth therein.

Pre-Remaster PF2e content that has not been republished under the ORC License remains under the Community Use Policy and/or OGL 1.0a depending on its source document; users supplying their own PF2e JSON should verify the license terms of their upstream data.

---

## Dungeons & Dragons 5th Edition (SRD 5.2) spell data — Creative Commons Attribution 4.0 (CC BY 4.0)

D&D 5e spell text is from the **System Reference Document 5.2**, licensed under the **Creative Commons Attribution 4.0 International License (CC BY 4.0)**.

> This product includes material from the System Reference Document 5.2 ("SRD 5.2") by Wizards of the Coast LLC, available at <https://www.dndbeyond.com/srd>. The SRD 5.2 is licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0), available at <https://creativecommons.org/licenses/by/4.0/legalcode>.

**Modifications.** The SRD 5.2 spell text in this project has been modified — parsed from upstream JSON, normalized, and reformatted into spell-card layouts. These modifications are the work of the project maintainer and are not endorsed by Wizards of the Coast.

**Provenance.** The D&D 5e spell data was obtained via Open5e (<https://open5e.com>, API at <https://api.open5e.com>), which redistributes the SRD under CC BY 4.0.

Anyone supplying their own D&D 5e spell JSON is responsible for retaining this CC BY 4.0 attribution — title, author, copyright, a link to the license, and an indication of any modifications — through to any downstream redistribution.

---

## Trademark and affiliation disclaimer

"Pathfinder" and the Pathfinder logo, "Paizo," and related marks are trademarks of Paizo Inc. This project is an independent, unofficial fan tool. **It is not affiliated with, endorsed by, sponsored by, or specifically approved by Paizo Inc.** No claim is made to any Paizo trademark or to Paizo's Product Identity.

"Dungeons & Dragons," "D&D," "Wizards of the Coast," and related marks are trademarks of Wizards of the Coast LLC. CC BY 4.0 licenses the SRD 5.2 text only and grants no rights to these trademarks. This project is independent and unofficial and **is not affiliated with, endorsed by, sponsored by, or approved by Wizards of the Coast.**

---

## Reporting an issue

If you are a rightsholder and believe content in this repository is being used incorrectly, please open a GitHub issue and the maintainer will respond promptly.
