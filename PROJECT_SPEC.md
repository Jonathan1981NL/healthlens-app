# HealthLens — Project Specification (v2)

## Purpose
An educational, privacy-first anatomical atlas and complaint explorer, with an AR posture-check module. Explicitly **not** a diagnostic tool.

## Core principles
1. Educational, not diagnostic.
2. Privacy-first: local storage only, no cloud, no tracking.
3. Mandatory disclaimer gate before use.
4. Multilingual, mobile-first, accessible.
5. Premium medical look and feel (white, calm, teal accent).

## Main modules
- **Atlas**: static, centered SVG stage with rotatable views (front/back/left/right), 12 anatomical layers and invisible clickable regions with translucent highlight.
- **Detail panel**: 7 tabs (Explanation, Complaints, Red flags, Prevention, First aid, Causes, Learn) driven by a rich Dutch medical database.
- **Complaint explorer**: description, pain 0–10, onset, course, general impression, dynamic red flags. Produces indicative urgency (low/mid/high) with a plain-language rationale.
- **AR scan**: camera-based posture check using MediaPipe Pose (loaded from CDN), fully local processing, symmetry indicators, snapshot download.
- **Learning Centre**: 16 modules covering anatomy, red flags, prevention, first aid, sexual health, perimenopause, heredity, medication awareness and more.
- **Profile**: leeftijd, geslacht, achtergrond, atlasweergave, gebruikerstype, lengte, gewicht, aandoeningen, medicatie, allergieën, familiegeschiedenis.
- **Privacy**: transparent storage listing, JSON export, full wipe.

## Languages
Nederlands (default), English (full), Deutsch, Français, Español, Português, Italiano, Polski, Türkçe, العربية, हिन्दी, বাংলা, اردو, 中文, 日本語, 한국어, Русский, Bahasa Indonesia, Tiếng Việt, ไทย, Kiswahili.

## Non-goals
- No diagnosis.
- No cloud data.
- No advertising or analytics.
- No processing of intimate real images.
