# HealthLens Stage 1L — 3D Asset Architecture

Stage 1L is a larger correction and architectural step.

## What changed

- Default view is a normal person/body, not an organ layer.
- Layers are optional and selected after opening:
  - organs
  - skeleton
  - blood vessels
  - nerves
  - hormones
- The atlas now uses a Three.js 3D engine when available.
- The current 3D body is procedural fallback anatomy, structured so real licensed 3D anatomy assets can replace each mesh later.
- If Three.js CDN fails, the app falls back to the image atlas.
- Clicking anywhere on the 3D body selects the related anatomical object or nearest body region.
- Selection immediately updates:
  - detail card
  - symptom flow
  - dynamic questions
  - education module
  - indicative differential/triage output
- The profile modal has a clear sticky “Opslaan en doorgaan” and “Overslaan en app openen” action.
- Atlas Studio is not blurred.
- SafeBlur remains reserved for AR/camera/upload/user images.

## Deploy

Extract into GitHub Desktop repository folder.

Commit:
`Stage 1L 3D asset architecture and linked symptom engine`

Open:
`stage1l.html?v=force-1l`
