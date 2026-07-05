# Changelog

## Stage 1L — 3D Asset Architecture & Linked Symptom Engine

### Added
- Three.js-based 3D viewer architecture.
- Default person before selecting any layer.
- Layer selection after default view.
- Procedural 3D anatomy fallback for body, organs, skeleton, vessels, nerves and hormones.
- Click-anywhere body/object selection.
- Live link from atlas selection into symptom flow.
- Indicative differential and triage output.
- Dynamic targeted questions per selected structure.
- Expanded education panel per selected structure.
- Sticky profile continue buttons.

### Fixed
- Profile modal could appear without an obvious way forward.
- Symptom flow previously did not produce a useful diagnosis/differential.
- Selection did not update the rest of the app enough.
- Removed dependency on only circular proposed hotspots.

### Still required for true final quality
- Licensed or commissioned 3D anatomical models.
- Replacing procedural placeholders with real meshes and texture sets.
- More exhaustive medical database expansion.
