# HealthLens Project Spec — Stage 1L Baseline

## Stage 1L objective
Move from image-only prototype toward a real 3D anatomy app architecture.

## Locked user requirements
1. Default view must be a normal person/body.
2. Layers must be optional and selected afterwards.
3. Organ image style remains the visual quality reference for future layers.
4. The nervous-system layer must not feel like a totally unrelated image/system.
5. Everything in the body should be selectable, not only proposed circles.
6. Selecting an organ/body part must update:
   - atlas detail
   - symptom flow
   - prompt questions
   - diagnosis/differential output
   - education panel
7. Symptom flow must produce an indicative differential/triage, not remain inert.
8. Profile opening screen must always have a clear continue/skip action.
9. Atlas Studio images are educational and not blurred.
10. AR/camera/upload/user images use SafeBlur.

## Technical architecture
Stage 1L introduces a Three.js viewer. Current meshes are procedural placeholders with consistent object IDs. This allows later replacement by real assets while preserving:
- object picking;
- database mapping;
- symptom mapping;
- education mapping;
- triage rules.

## True 3D asset path
To become hyperrealistic, replace procedural meshes with:
- full-body skin mesh;
- muscles;
- skeleton;
- organs;
- vessels;
- nerves;
- endocrine system;
- multiple sex/age/body-type/skin-tone variants or texture/material sets.

The app must use object/mesh IDs mapped to the HealthLens medical database.
