# Custom cursor sprites

These four PNGs drive the site's custom cursor (see the bottom of `script.js`).
Each is a horizontal sprite sheet of 48×48 frames, extracted from a Cinnamoroll
`.ani` cursor pack (Windows animated-cursor format, which browsers can't play
directly — `cursor:` only supports static `.cur`/`.png`/`.svg`, so the frames
were pulled out and are now stepped through manually in JS).

| File | Mode | Frames |
|---|---|---|
| `normal-sprite.png` | default | 2 |
| `link-sprite.png` | hovering a link/button/tab | 3 |
| `working-sprite.png` | brief pulse during an in-page transition (accordion opening, a tab swapping, a skill bubble opening) | 11 |
| `alternate-sprite.png` (mode class `mode-expand`) | hovering something that "expands" — the dossier card, its photo, a credential card, a case-studies carousel page | 2 |

To swap in a different cursor pack: replace these four PNGs (same 48×48-per-frame,
horizontal layout) and update the `frameCount`/`seq`/`stepMs` values in the
`MODES` object in `script.js` to match the new pack's frame count and timing.

The cursor only activates on devices with a real mouse (`hover: hover` and
`pointer: fine`) — touch devices are untouched.
