# HealthLens Project Spec — Stage 1H Baseline

## Goal
Build a privacy-first, globally usable health app combining:
- interactive anatomy atlas;
- symptom orientation;
- prevention;
- first aid;
- quiz and learning;
- future AR and native app packaging.

## Stage 1H focus
The user requested a much more detailed atlas resembling real anatomy illustrations and 3D medical visuals. Stage 1H moves the product from schematic interaction toward a richer image-based medical atlas.

## New principles locked
1. The atlas must support small, specific hotspots, not only large body regions.
2. Selecting a structure must zoom into it directly.
3. The user should not be forced into constant new screens.
4. Every selected item should show:
   - function/context
   - symptoms
   - red flags
   - prevention
5. Profile data must be remembered locally.
6. Background/ancestry must be optional and explained as a way to contextualize presentation/risk, not as a diagnostic label.
7. Development builds must avoid hard PWA caching.

## Current layers
- Organs
- Skeleton
- Circulatory system
- Nervous system
- Muscles
- Hormones

## Future 3D transition
For a truly hyperrealistic rotatable anatomical body, the project needs licensed 3D assets and a real rendering engine. Recommended path:
1. Source/commission anatomical 3D model set.
2. Build Three.js or Unity prototype.
3. Map mesh object IDs to the medical database.
4. Add layer opacity sliders.
5. Add AR pose registration as a separate module.
