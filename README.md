# VERDURA ARCHITECTS — Designing a Sustainable Tomorrow

An architecture studio site built as a **drawing board**. The first viewport is a live case study: the section through Hollowbrook Library draws itself from a loose pencil sketch, through its materials and its precise form, to the sun, wind, water and planting that shaped it. Each environmental layer can be switched on and off, and the sun can be set to midwinter, equinox or midsummer.

Production URL: `https://verdura-architects.vercel.app`

> Fictional concept brand, built as a portfolio project. VERDURA ARCHITECTS, its projects, places and people are fictional. Drawings are illustrative and imply no performance figures.

---

## Concept

Architecture studios usually show finished photographs. VERDURA shows the thinking: one building drawn four times, the way an architect actually works. The site's claim is not a number but a method: *sketch, material, form, environment*. Every page element returns to the drawing sheet: title blocks, scale rules, notes lists and line drawings that draw on.

## Brand & positioning

- **Name:** verdura is "greenness". The studio is small, works from a restored ropeworks by a harbour, and designs with timber, earth, straw, stone and reused brick.
- **Promise:** buildings that begin with the site and what is already there. Principles: build less, build with what grows, design for repair, let the site lead.
- **Tone:** quiet, precise, unhurried. Plain verbs, short sentences, no superlatives and no performance claims.
- **Conversion:** "Tell us about the site", a project enquiry form. It is a demo, and nothing is sent.

## Audience

Clients who commission buildings rarely: school governors, community trusts, small developers, families with a site or a barn to adapt. They want to understand how an architect thinks before they talk about fees.

## Art direction

- **Palette:** stone `#ECE7DE`, sage `#8FA68A`, timber `#9A6B43`, ink `#1F2A24`. Supporting tones: paper `#F4F1EA` for drawing sheets, sage-ink `#4C6650` and timber-ink `#7A5232` for accessible accent text, pencil `#6B6B62` for the sketch layer and a muted water teal `#5F8C86` for the rain layer.
- **Composition:** an elegant twelve-column grid on drafting paper (fine 20 px and 100 px rules). The hero pairs a narrow rail (title, stage stepper, layer toggles) with a framed drawing sheet whose foot carries a numbered notes list and a real title block.
- **Drawings:** every image is a line drawing generated as SVG: the section (pencil sketch with overshooting construction lines, hatched materials, crisp ink linework, people for scale), eight parametric project elevations whose cladding hatch follows the material, and five process sheets (site study, massing options, timber joint 1:5, wall build-up 1:10, planting plan).
- **Logo:** an original mark (a mono-pitch roof line over a ground line, a stem rising through it with a sage leaf, and a timber-coloured sun) beside a stroke-built VERDURA wordmark. `favicon.svg` is the mark on a stone tile.

## Typography

- **Epilogue** (500/700/800) for display: headlines, stage names, navigation and buttons, tightly tracked.
- **Libre Caslon Text** (400/700, italic 400) for running text and every functional label: project names, years, levels, title-block values, timeline years and notes. Numbers use lining figures. Following QA guidance, labels and numbers are never set in the display face alone.
- Headlines use `text-wrap: balance` and `overflow-wrap: normal`, so words never break mid-word.

## Motion language

Everything is drawn, not faded.

- **Draw-on:** every stroke uses `pathLength="1"`, so lines draw at the same rhythm whatever their length, staggered in drawing order.
- **Stage sequence:** on load the board plays sketch → material → form → environment. Materials are revealed by a left-to-right wipe, like hatching being laid in. At the form stage the sketch fades back to a faint underlay.
- **Undrawing:** switching a layer off retracts its lines rather than hiding them.
- **Flows:** wind and rain run as slow dashed currents along their paths; the cistern's water line moves gently.
- **Drafting reveals:** section headings appear as a ruled line draws across the page and the text is uncovered behind it.
- Easing is a strong in-out (`cubic-bezier(.7,0,.2,1)`), like a pen stroke that accelerates and settles.

## Signature interaction: how to use it

1. Watch the drawing play through its four stages, or press **Replay the drawing**.
2. Choose a stage in the stepper (**01 Sketch, 02 Material, 03 Form, 04 Environment**). Arrow keys move between stages when the stepper has focus.
3. Toggle **Sun, Wind, Water and Planting**. Each layer draws on and adds its numbered note beneath the sheet. Choosing a layer from an earlier stage jumps to the environment stage.
4. Set the **Sun at noon** to midwinter, equinox or midsummer. The light band through the south glass is recalculated from the eave's geometry, the angle is marked at the glass, and the deciduous tree to the south loses or gains its leaves.
5. The title block updates with the drawing name, stage and sun setting.

## Sections

1. **Case study** (signature drawing board)
2. **Projects**: eight fictional projects as drawing sheets in a varied grid, filterable by typology and material, each opening a project dialog with its elevation drawn large, facts, material palette and previous/next navigation.
3. **Process**: five sheets from the project file, drawn on as they scroll into view.
4. **Studio**: four principles with drawn glyphs, and the studio's story on a scale rule (keyboard and button navigable).
5. **Start a project**: an enquiry form with inline validation and an honest demo confirmation.

## Tech

- Static HTML, CSS and ES modules; no build step, no frameworks, no images.
- `drawing.js`: generates the section drawing (all layers) and recalculates the sun band, rays and angle per season.
- `projects.js`: project data, the parametric elevation generator and the process drawings.
- `main.js`: stage and layer state, autoplay, project filters and dialog, timeline, form and reveals.
- Native `<dialog>` for project details. Google Fonts (Epilogue, Libre Caslon Text) with `display=swap`.

## Local development

```bash
npx serve .
```

Open the printed local URL (ES modules need HTTP).

## Accessibility

- One `<h1>`, landmarks, skip link and visible focus styles.
- The drawing has a `<title>` and `<desc>`; the stage, layer and season controls are native buttons and radios with pressed states, and changes are announced in a polite live region.
- Project sheets are buttons that open a modal dialog; focus returns to the sheet on close and Escape closes it.
- The scale-rule timeline is a group of buttons with arrow-key support and previous/next controls.
- `prefers-reduced-motion: reduce` shows every drawing fully drawn, with no autoplay, no flowing dashes and no reveals. All controls still work.
- On small screens the drawing is re-framed (a tighter `viewBox`), pencil notes and level labels are hidden, and the stepper becomes a four-part segmented control.

## Performance

- Around 45 KB of hand-written JavaScript and no images: every drawing is an SVG string built once.
- Changing season updates a handful of attributes; layers are toggled with classes and CSS transitions.

## Known limitations

- The sun model is a simple noon section for three dates; it is a design diagram, not a daylight or energy simulation.
- Airflow and rain paths are illustrative.
- The material wipe uses CSS `clip-path` on SVG groups; browsers without support simply fade the materials in.

## Credit

Designed & built by Saad Bashir — https://www.linkedin.com/in/saadbashirmarketing/
