# HealthLens (v2)

HealthLens is a privacy-first interactive health atlas, complaint explorer and educational tool. It is an **educational prototype only** and does **not** provide a diagnosis or replace medical advice.

## Features

- Mandatory disclaimer gate before use.
- Interactive anatomical atlas with **four rotation views** (front, back, left, right) and 12 anatomical layers.
- Invisible clickable regions with a translucent teal highlight (no visible circles).
- Rich detail panel with 7 tabs: explanation, complaints, red flags, prevention, first aid, causes, learn.
- Structured complaint explorer with pain slider, onset, course, general impression and dynamic red flags.
- Contextual **urgency scoring** (low / moderate / high) with a plain-language rationale and profile-awareness (e.g. age).
- **AR posture check**: uses your camera locally (MediaPipe Pose from CDN) to identify shoulder, hip and head asymmetry — clearly labelled as informational, not a diagnosis. Nothing is uploaded.
- Educational Centre with 16 modules.
- Personal profile stored locally (age, sex, background, atlas display, user type, height/weight, conditions, medication, allergies, family history).
- Privacy panel showing exactly what is stored, with one-click **export** (JSON) and **wipe all**.
- **21 languages** (Dutch default; English fully covered; other languages cover core UI keys).
- Light and dark theme.
- Installable **PWA** with offline shell (service worker).

## Run locally

Just open `index.html` in a modern browser, or serve the folder:

```
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

## Deploy on GitHub Pages

1. Push all files to the **root** of your repository.
2. In *Settings → Pages*, choose the `main` branch and `/ (root)` folder.
3. The included `.nojekyll` file ensures assets are served as-is.

Example URL:

```
https://jonathan1981nl.github.io/healthlens-app/
```

## Privacy

- No server, no tracking, no cookies.
- Profile data and settings are stored in `localStorage` only.
- The AR module uses **`getUserMedia`** and processes frames locally in your browser.
- Snapshots are only saved when you press the download button.
- One click in the Privacy panel wipes all HealthLens data.

## AR permissions

The AR posture check will ask for camera permission the first time you press *Camera starten*. If you deny or your device lacks camera access, the app remains fully usable in all other panels.

## Medical safety

HealthLens is educational. It is **not** a medical device, does **not** provide diagnosis and does **not** replace professional medical care. In life-threatening situations always call your local emergency number.

## Roadmap

- Higher-fidelity anatomical illustrations per profile.
- Deeper medical content and full translation of the medical database.
- Guided quizzes in the Learning Centre.
- Optional secure cloud sync (opt-in only) for profile portability.
- Legal review of disclaimer for target jurisdictions.
