# HealthLens Project Spec — Stage 1J Baseline

## User correction implemented
The user clarified:

1. Atlas Studio should not blur anatomical images.
2. Blur is only required for real user content:
   - AR camera;
   - uploaded photos;
   - screenshots;
   - identifiable body images.
3. Atlas Studio educational images should be biological/anatomical.
4. For children, atlas images should show underwear.
5. Atlas representation should adapt to profile choices such as age, sex and background/ancestry.
6. All layers should look like one coherent system rather than unrelated images.

## Stage 1J implementation
Stage 1J creates a unified harmonized SVG-based atlas body with shared coordinates and layer toggles:
- skin/body layer;
- muscle layer;
- skeleton layer;
- organ layer;
- vessel layer;
- nerve layer;
- hormone layer.

It also adds:
- profile-based skin tone;
- under-16 underwear overlay;
- 3D-like rotate/tilt controls;
- layer opacity slider;
- AR/photo privacy distinction;
- cache-safe entry page.

## Important limitation
This is still pseudo-3D SVG. A true hyperrealistic rotating anatomical atlas requires:
- licensed 3D anatomy assets;
- Three.js, Unity, Babylon.js or native 3D engine;
- mesh-object IDs connected to the medical database;
- texture/material pipeline for skin, organs, vessels, nerves and skeleton;
- AR pose-registration pipeline.

## Locked principle
During development, no persistent PWA caching unless explicitly requested.
