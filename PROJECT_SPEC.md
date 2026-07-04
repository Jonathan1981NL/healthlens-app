# HealthLens Project Specification — Stage 1B Baseline

Version: Stage 1B  
Date: 2026-07-04  
Status: working prototype baseline, flat GitHub Pages build

## 1. Product vision

HealthLens is a privacy-first, internationally scalable, interactive health atlas. It aims to combine anatomy education, symptom orientation, prevention, first-aid guidance, puberty and sexual health education, perimenopause awareness, hereditary disease context, skin/wound observation, AR body layers, quizzes and international competitions.

The product promise is:

> Learn your body. Understand symptoms. Act faster when it matters.

The Dutch positioning is:

> Je lichaam, laag voor laag begrepen.

HealthLens is not positioned as a doctor replacement. The product provides educational and indicative guidance, triage thinking, prevention information and clear emergency warnings.

## 2. Core pillars

1. Body Atlas: layered anatomy across skin, muscles, skeleton, organs, blood vessels, nerves, lymph, hormones and other body systems.
2. Symptom Orientation: users can click or select body areas, describe symptoms and receive possible explanations, urgency warnings and next-step suggestions.
3. Privacy Shield: sensitive medical and body data are protected by design, local-first where possible and never used for social or advertising purposes.
4. Life Stages: puberty, sexual health, SOA/STI, menstruation, pregnancy/postpartum, perimenopause, menopause, men’s hormones, thyroid and aging.
5. Prevention: organ-specific advice for nutrition, movement, sleep, stress, screening and risk awareness.
6. First Aid: offline-first emergency cards and later AR-assisted lifesaving training.
7. Quiz and Engagement: daily challenges, XP, badges, family/school leagues and international rankings.
8. Internationalization: top 20 languages plus Dutch, with local medical terminology and local care pathways.

## 3. Medical boundary

The app must never present its output as a definitive diagnosis. It may say:

- this can fit with;
- possible explanations include;
- these are alarmsigns;
- consider contacting a doctor;
- seek urgent help if.

It must not say:

- you have disease X;
- you do not have disease X;
- this is definitely safe;
- this replaces a physician or emergency service.

All medical flows must include uncertainty, urgency escalation and clear disclaimers.

## 4. Privacy and security baseline

Privacy and security are a product differentiator and must be designed from the start.

Default principles:

- local-first processing where technically possible;
- no automatic cloud storage of photos, scans or sensitive symptoms;
- explicit consent per sensitive action;
- no medical data for ads, remarketing, rankings or social sharing;
- metadata/EXIF stripping;
- face/background masking where possible;
- one-tap delete;
- private temporary session mode;
- no push notifications containing sensitive details;
- no public sharing of medical images.

## 5. Minor intimate content zero-tolerance rule

For users or scanned persons under 16:

- no nude images;
- no intimate images;
- no images of genitals, breasts, buttocks or comparable sensitive zones;
- no intimate AR scan;
- no upload, storage or analysis of such images;
- no workaround through blur.

If detected, the app must:

1. block immediately;
2. not save;
3. not upload;
4. not analyze;
5. delete temporary data where possible;
6. show a warning;
7. redirect to safe text-based symptom flow.

Important nuance: under-16 users must still be able to describe symptoms safely. They can use text, multiple choice, neutral illustrations and non-explicit body maps for puberty questions, SOA/STI concerns, pain, itching, burning urination, discharge, wounds, menstruation questions or worries about body development.

## 6. 16–17 user group

Users aged 16–17 require a stricter sensitive-data flow than adults. Sexual health information and symptom orientation are allowed, but sensitive images should be avoided wherever possible. If any sensitive processing is later supported, it requires explicit consent, local-first handling, masking, no default cloud storage and clear safeguards.

## 7. Adult sensitive medical content

For adults, sensitive regions may be medically relevant. The app may later support adult sensitive image review only under strict conditions:

- age gate;
- explicit consent;
- local-first processing;
- no default cloud storage;
- automatic blur/masking;
- manual extra blur;
- preview before save/share;
- no recognizable face/background;
- clear medical disclaimer;
- delete-after-session option.

## 8. Puberty and sexual health module

The app must include a module for puberty, body uncertainty and sexual health.

Topics:

- what is normal;
- breast growth;
- hair growth;
- menstruation;
- discharge;
- penis and testicles;
- acne;
- body odor;
- height and growth;
- erections and wet dreams;
- emotions and body image;
- consent and boundaries;
- SOA/STI;
- pregnancy concerns;
- when to seek help.

The tone must normalize healthy variation while not ignoring red flags.

## 9. SOA/STI module

SOA/STI concerns must be a separate module and must work without images.

The module can ask about:

- burning urination;
- itching;
- discharge;
- blisters;
- sores;
- bleeding;
- pelvic pain;
- testicular pain;
- fever;
- unprotected sex;
- concerns after sexual contact;
- coercion or unsafe situation.

The module must explain that symptoms alone cannot reliably rule out SOA/STI and that testing is necessary when risk, symptoms or uncertainty exist.

## 10. Safety and abuse layer

If a user indicates coercion, fear, abuse, unsafe home situation, much older partner, injury after sexual contact or direct danger, the app must prioritize safety. It must suggest trusted adult, doctor, youth doctor, school doctor, local hotline or emergency number depending on urgency and country.

## 11. Perimenopause module

Perimenopause must be explicit because symptoms are often vague and missed.

Symptoms/context:

- irregular cycle;
- hot flashes;
- night sweats;
- insomnia;
- brain fog;
- memory or concentration issues;
- mood changes;
- anxiety;
- irritability;
- palpitations;
- joint pain;
- muscle pain;
- headaches/migraine;
- urinary symptoms;
- vaginal dryness;
- libido changes;
- fatigue;
- weight/body composition changes.

The app must not use perimenopause as a catch-all. Alarmsigns override hormone-context explanations.

## 12. Hereditary disease module

The app must include hereditary and family-history awareness.

Topics:

- what genetics means;
- family history;
- hereditary cancer;
- early heart disease;
- cholesterol disorders;
- clotting disorders;
- autoimmune disease;
- rare disease;
- ancestry/geography where medically relevant and ethically handled;
- when to discuss genetic counseling.

The app should not diagnose hereditary diseases, but should help structure family history for a physician.

## 13. Inclusive health layer

The app must not default to the white male body as the only standard. It must account for:

- age;
- sex at birth where medically relevant;
- pregnancy/postpartum status;
- menopause/perimenopause status;
- skin tone and dermatological presentation;
- ancestry/geography where evidence-based;
- children and older adults presenting differently;
- evidence gaps and medical bias.

The app should show when evidence may be less representative.

## 14. International language and terminology plan

Target languages: largest global languages plus Dutch. Current prototype includes placeholders for Dutch, English, Chinese, Hindi, Spanish, Arabic, French, Bengali, Portuguese, Russian, Urdu, Indonesian, German, Japanese, Swahili, Marathi, Telugu, Turkish, Tamil, Vietnamese, Italian and Polish.

The full product must include local medical terms, lay terms, synonyms and local care paths. Example: Dutch users search for galblaas, not gallbladder.

## 15. Stage 1B prototype scope

Built in this version:

- modernized home screen;
- module cards;
- interactive layered SVG body atlas;
- region information and prevention cards;
- profile contexts;
- symptom checker with alarmsigns, SOA/STI, puberty, perimenopause and heredity context;
- Life stages module;
- Privacy Shield simulator;
- First Aid cards;
- quiz with XP;
- mobile responsive layout;
- flat GitHub Pages package;
- README, changelog, manifest, favicon and .nojekyll.

Not yet built:

- real 3D engine;
- real AR camera;
- real image upload or analysis;
- real medical database;
- accounts/rankings backend;
- regulated clinical decision support;
- real multilingual content translation;
- real emergency number localization;
- clinical validation.

## 16. Stage-gate roadmap

Stage 0: Product, safety, privacy and name baseline.  
Stage 1A: First static prototype.  
Stage 1B: Modern UI, modules, privacy, life-stage content and flat GitHub Pages build.  
Stage 1C: Expanded content database and stronger mobile UI.  
Stage 2: Symptom engine and structured questionnaires.  
Stage 3: Prevention engine.  
Stage 4: AR overlay prototype.  
Stage 5: Skin/wound/mole photo flow after privacy foundation.  
Stage 6: EHBO interactive training.  
Stage 7: Quiz accounts, XP, leagues and international ranking.  
Stage 8: Medical review, bias review, privacy audit and regulatory analysis.

## 17. Stage 1B lock notes

This baseline should be treated as the current working reference. Future stages must preserve:

- minor intimate content zero-tolerance under 16;
- symptom description allowed for minors;
- SOA/STI as a separate module;
- puberty reassurance and red-flag guidance;
- perimenopause module;
- hereditary module;
- privacy-first default;
- no definitive diagnosis;
- new-age intuitive UI direction;
- fast iterative GitHub Pages deployment.
