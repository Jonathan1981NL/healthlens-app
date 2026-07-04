# HealthLens Project Specification — Stage 1C Baseline

## 1. Product vision

HealthLens is a privacy-first interactive health app that helps people explore the human body, understand symptoms, learn prevention, practise first aid and test their health knowledge through an intuitive visual experience.

The app is designed as a global, mobile-first product that can start as a web/PWA prototype and later grow into native iOS and Android applications.

## 2. Public positioning

The public app description should remain broad and professional. It should not list every sensitive or specialist module in the short description.

Recommended public description:

> HealthLens is a privacy-first interactive health app that helps people explore the human body, understand symptoms, learn prevention, practise first aid and test their health knowledge through an intuitive visual experience.

## 3. Core product pillars

1. Interactive body atlas
2. Symptom orientation and triage-style education
3. Prevention and life-context education
4. First-aid learning and emergency preparation
5. Quiz, XP and global learning engagement
6. Privacy, safety and security as a primary product differentiator
7. International terminology and language support
8. Future AR body overlay and 3D anatomical model support

## 4. Medical safety baseline

HealthLens must not claim definitive diagnosis in this phase. It provides indicative educational information, possible directions, alarmsignals and recommended next steps.

Every medical output should follow a safe structure:

1. Summary
2. Possible direction
3. Alarmsignals
4. Action advice
5. Prevention or monitoring
6. Disclaimer

## 5. Minor safety baseline

For users or scanned persons under 16:

- No nude images
- No intimate images
- No images/scans of genitals, breasts, buttocks or comparable intimate zones
- No analysis, storage or upload of such images
- No blur-and-continue exception
- If detected, the app blocks the image/scan and deletes it locally

However, minors must still be able to describe symptoms safely using:

- text
- multiple choice questions
- neutral body maps
- age-appropriate explanations
- safe help routes

This includes concerns about puberty, body development, sexual health, possible STI/STD symptoms, pain, itching, discharge, burning urination, unsafe contact or coercion. The rule is: no intimate image processing, but safe symptom support remains available.

## 6. Privacy and security baseline

Privacy is a core selling point, not a compliance afterthought.

Stage principles:

- Local-first processing where possible
- No automatic cloud storage of photos or scans
- Explicit consent per sensitive function
- Automatic metadata stripping for future image features
- SafeScan blur engine concept
- Private mode with no account, no cloud and no history
- Data minimisation
- No advertising profiles based on medical data
- No public use of medical images in quiz, ranking or social features

## 7. Body Atlas baseline

Current Stage 1C includes a schematic interactive body map with layers:

- Skin
- Organs
- Skeleton
- Muscles
- Blood vessels
- Nerves
- Hormones

Clickable regions:

- Head
- Chest
- Abdomen
- Pelvis
- Arms
- Legs

Future stages will replace the schematic map with real 3D models and AR body tracking.

## 8. Prevention and life context

The app should include general prevention and life-context education without narrowing the public app description.

Context layers include:

- age
- sex at birth where medically relevant
- pregnancy where relevant
- skin tone/hair and dermatological presentation
- hormonal life stage
- family history
- geography/local care pathways
- known conditions and medications

These context layers must not overstate certainty and must not reduce the user to a crude category.

## 9. Sexual health and puberty baseline

HealthLens should include safe, age-appropriate educational support around:

- normal body variation
- puberty timing
- menstruation
- hair growth
- breast development
- penis/testicle development
- sexual health
- STI/STD symptoms and testing advice
- consent, boundaries and unsafe situations

For under-16 users, this must be text/choice based, not image based.

## 10. First aid baseline

Stage 1C contains educational first-aid cards. Later stages should add more interactive flows and offline-first emergency guidance.

Priority topics:

- CPR
- stroke recognition
- choking
- severe bleeding
- burns
- falls/fractures
- severe breathing problems
- allergic reactions

## 11. Quiz and engagement baseline

The app should become a repeat-use learning platform through:

- XP
- levels
- daily challenges
- country rankings
- school/family leagues
- first-aid challenges
- anatomy challenges
- prevention campaigns

Medical images from users must never be part of public ranking, quiz or social features.

## 12. Internationalisation baseline

HealthLens should support Dutch plus the world's major languages over time. Medical content must be localised, not merely translated.

Each term should support:

- common lay term
- formal medical term
- synonyms
- local emergency route
- child-friendly explanation
- clinician-level wording

## 13. App-store direction

Stage 1C is web/PWA-first but structured for later native deployment.

Future paths:

- PWA now
- Capacitor or React Native wrapper later
- iOS App Store
- Google Play Store
- Offline content packages
- Native camera/AR permissions
- App-store privacy nutrition labels
- Medical/regulatory review before regulated claims

## 14. 20 Stage 1C product steps

1. Premium mobile-first home with clear modules and app feel.
2. PWA basis: manifest, favicon, service worker and install-ready structure.
3. General public description without listing every sensitive module.
4. Body Atlas expanded with skin, organs, skeleton, muscles, vessels, nerves and hormones.
5. Clickable body map with region information, symptom context, prevention and alarmsignals.
6. Symptom flow with profile, area, free text, red flags and safe output.
7. Under-16 intimate image blocking, while allowing symptom description via text.
8. Safe youth education and reassurance about normal body variation as a product principle.
9. Sexual health support as safe text-based guidance for minors.
10. Life-stage and hormonal context as an underlying smart layer.
11. Family history and hereditary risk as preventive context, not diagnosis.
12. Privacy Shield with local-first, no-cloud, consent and blur-engine concept.
13. Adult sensitive-zone flow with explicit consent and minimal processing.
14. First-aid module with educational emergency cards.
15. Quiz with XP, levels and international ranking concepts.
16. Language strategy covering Dutch and global languages with local terminology.
17. Results structured as possible direction, alarmsignals, action advice and disclaimer.
18. Mobile navigation via bottom tabs and drawer for future iOS/Android wrapper.
19. Documentation and changelog updated to preserve baseline.
20. Stage-gate workflow retained: fast build, but lock working baselines.

## 15. Current files

- `index.html`
- `styles.css`
- `app.js`
- `site.webmanifest`
- `service-worker.js`
- `favicon.svg`
- `.nojekyll`
- `README.md`
- `PROJECT_SPEC.md`
- `CHANGELOG.md`

## 16. Stage 1D candidate scope

- Replace schematic body with richer SVG/3D-like model
- Add real content database file
- Add Dutch/English language toggle
- Add more symptoms and organ cards
- Add install prompt and onboarding
- Add local session report export
- Add safe profile setup
- Add more quiz categories
- Improve accessibility and keyboard navigation
