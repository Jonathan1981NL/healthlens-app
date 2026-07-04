# HealthLens Project Specification — Stage 1D Baseline

## Product ambition

HealthLens aims to become a privacy-first, international, interactive health atlas and guidance app. It combines body exploration, symptom education, prevention, first aid and health knowledge challenges in a mobile-first product experience.

## Public description

HealthLens is a privacy-first interactive health app that helps people explore the human body, understand symptoms, learn prevention, practise first aid and test their health knowledge through an intuitive visual experience.

The public description deliberately remains general. Detailed modules such as puberty, sexual health, hormonal life stages, hereditary risk and skin/wound review exist inside the product but are not over-emphasized in the top-level app-store style description.

## Locked safety principles

1. The app does not provide a definitive diagnosis.
2. The app is educational and indicative.
3. Alarms override normal educational flow.
4. Under 16: no nude or intimate images, scans or uploads.
5. Under 16: symptoms can be described safely via text, choices and neutral body maps.
6. Adult sensitive content requires explicit consent, local-first handling, preview, blur/masking and no automatic cloud storage.
7. Health data must not be used for advertising profiles.
8. Photos are never used for quiz, ranking or social sharing.
9. The app must be inclusive across age, sex, life stage, skin tone, ancestry context and evidence gaps.
10. Privacy and security are core features.

## Stage 1D implementation

Stage 1D adds:

- a mobile-first app shell;
- an interactive body avatar;
- multiple anatomical layers;
- an AR camera prototype;
- a symptom checker with urgency logic;
- a privacy-first photo/safety flow;
- life and prevention cards;
- first aid cards;
- quiz functionality;
- 20 product roadmap steps;
- PWA infrastructure.

## AR status

The Stage 1D AR module is a functional browser prototype using the device camera and an overlay. It is not clinical anatomical registration, not pose-estimation based and not validated for real diagnosis. Future stages should add body segmentation, pose detection, on-device ML and confidence scoring per anatomical region.

## Next stage candidates

- Stage 1E: real content database and language framework.
- Stage 1F: improved AR alignment and body pose estimation.
- Stage 1G: richer symptom decision trees.
- Stage 1H: offline first-aid mode.
- Stage 2: stronger medical review process and safety testing.
