# HealthLens Project Spec — Stage 1K Baseline

## Stage 1K objective
Create a usable, professional-feeling atlas build after user feedback that the pseudo-3D body was not acceptable.

## Locked decisions
1. Do not use fake 3D controls unless the interaction actually adds value.
2. Use realistic medical atlas images until real 3D anatomy assets are available.
3. Atlas Studio images are educational and are not blurred.
4. Blur is reserved for AR/camera/user-uploaded images and screenshots involving real people.
5. Under-16 profile uses a safe underwear overlay for atlas view.
6. Profile data remains locally stored.
7. Development builds must avoid persistent PWA cache.

## Current state
- Professional image-based atlas.
- Pan and zoom.
- Small hotspots.
- Detail cards.
- Symptom guide.
- Knowledge cards.
- Local profile.

## Next true 3D path
A genuinely hyperrealistic, rotatable anatomy atlas requires:
- licensed full-body 3D models;
- separate meshes for organs, skeleton, muscles, vessels, nerves and skin;
- WebGL renderer such as Three.js/Babylon.js, or Unity later for native apps;
- object picking mapped to medical database IDs;
- mobile performance optimization;
- AR pose registration as a separate module.
