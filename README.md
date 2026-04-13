# ATS Filter Resume

Produit web Next.js pour analyser la compatibilite ATS d'un CV face a une offre d'emploi, avec scoring transparent, explications detaillees et recommandations priorisees.

## 1) Apercu produit

Fonctionnalites principales:
- Upload CV en PDF ou DOCX.
- Collage d'une offre d'emploi complete.
- Pipeline d'analyse ATS deterministe et explicable.
- Rapport complet avec:
  - score global /100
  - score compatibilite ATS
  - score lisibilite ATS
  - score matching offre
  - score couverture mots-cles
  - score structure
  - score completude
  - exigences satisfaites / non satisfaites
  - risques de rejet automatise
  - recommandations concretes par priorite
- Pages pedagogiques ATS + pages institutionnelles.

Important:
- Le produit estime la probabilite de passage ATS.
- Le produit ne garantit jamais un entretien ni une embauche.

## 2) Stack technique

- Next.js 16 (App Router)
- TypeScript strict
- Tailwind CSS v4 + design tokens CSS
- Zod (validation)
- React Hook Form + Zod resolver
- `pdf-parse` (PDF text extraction)
- `mammoth` (DOCX text extraction)
- Vitest + Testing Library (unit, integration, UI)
- Playwright (E2E desktop + mobile emulation)
- ESLint + Prettier
- Husky + lint-staged
- GitHub Actions CI
- Dockerfile + docker-compose

## 3) Installation locale

Prerequis:
- Node.js 20+
- npm 10+

Installation:
```bash
npm install
cp .env.example .env.local
```

Demarrage dev:
```bash
npm run dev
```

URL locale:
- `http://localhost:3000`

## 4) Variables d'environnement

Fichier: `.env.example`

```env
NEXT_PUBLIC_APP_NAME=ATS Filter Resume
NEXT_PUBLIC_MAX_FILE_SIZE_MB=5
REPORT_TTL_MINUTES=30
```

## 5) Scripts npm

- `npm run dev`: lance l'app en developpement.
- `npm run build`: build production Next.js.
- `npm run start`: demarre l'app build.
- `npm run clean`: supprime les artefacts locaux (`.next`, `test-results`, `playwright-report`, `coverage`).
- `npm run lint`: lint global.
- `npm run lint:fix`: lint + correction.
- `npm run typecheck`: verification TypeScript stricte.
- `npm run format`: formatage Prettier.
- `npm run format:check`: verification formatage.
- `npm test`: suite unit + integration + UI.
- `npm run test:unit`: tests unitaires.
- `npm run test:integration`: tests integration.
- `npm run test:ui`: tests composants/UI.
- `npm run fixtures:generate`: generation fixtures E2E DOCX/invalid.
- `npm run test:e2e`: Playwright E2E (chromium + mobile emulation).
- `npm run test:e2e:headed`: E2E mode headed.

## 6) Architecture

```text
src/
  app/
    api/
      analyze/route.ts
      reports/[id]/route.ts
    analyse/page.tsx
    resultats/[reportId]/page.tsx
    ats/page.tsx
    a-propos/page.tsx
    confidentialite/page.tsx
    conditions/page.tsx
  components/
    layout/
    ui/
  features/
    analysis/components/
    results/components/
  services/
    analysis/
    parsers/
    reports/
  lib/
    validators/
    config.ts
    utils.ts
    text.ts
  content/
  types/
dev/
  qa/
    unit/
    integration/
    ui/
    e2e/
  tools/
    scripts/
  docs/
.github/workflows/
```

Separation des responsabilites:
- Parsing CV: `src/services/parsers/*`
- Parsing offre: `src/services/parsers/job-parser.ts`
- Extraction sections/mots-cles: `src/services/analysis/*`
- Matching et exigences bloquantes: `src/services/analysis/matching.ts`
- Scoring ATS: `src/services/analysis/scoring.ts`
- Recommandations: `src/services/analysis/recommendations.ts`
- Orchestration analyse: `src/services/analysis/ats-analyzer.ts`
- Presentation UI: `src/app/*`, `src/features/*`, `src/components/*`

## 7) Logique ATS implementee

Pipeline:
1. Extraction texte du CV (PDF/DOCX).
2. Normalisation et metriques de parsabilite.
3. Detection de sections standard.
4. Extraction infos contact, competences, outils, langues, certifications.
5. Parsing de l'offre (skills, pre-requis obligatoires, preferes, seniorite).
6. Matching CV/offre (mots-cles, exigences, experience).
7. Scoring pondere + penalites fortes.
8. Generation du rapport et recommandations priorisees.

## 8) Strategie de scoring

Ponderations:
- 35% couverture competences/mots-cles
- 20% exigences bloquantes / pre-requis
- 15% structure ATS-friendly
- 10% lisibilite document
- 10% qualite experience
- 10% qualite globale contenu

Penalites majeures:
- Texte non extractible
- Email/telephone absents
- Pre-requis obligatoire manquant
- Structure visuelle complexe
- Matching tres faible

Seuils de verdict:
- 80-100: forte compatibilite ATS
- 60-79: compatibilite moyenne
- 40-59: risque important
- 0-39: compatibilite faible

## 9) Confidentialite et securite

- Validation stricte type/taille du fichier.
- Limitation formats (`.pdf`, `.docx`) et taille max configurable.
- Rapport conserve temporairement (memoire serveur + session navigateur).
- Aucune persistance obligatoire pour le flux principal.
- Messages d'erreur defensifs sans fuite de donnees sensibles.

## 10) Tests

### Unitaires
Couvrent:
- extraction mots-cles
- detection sections
- scoring + penalites
- validation input
- exigences bloquantes

### Integration
Couvrent:
- pipeline d'analyse complet
- cas nominal
- cas degrade
- parsing PDF corrompu

### UI
Couvrent:
- formulaire analyse
- upload
- etats erreur/succes
- rendu dashboard resultats

### E2E Playwright
Couvrent:
- parcours home -> analyse -> resultats
- upload CV valide
- saisie offre (sample)
- affichage scores et recommandations
- cas fichier invalide
- smoke test pages principales
- execution desktop + mobile emulation

## 11) CI/CD

Workflow unique: `.github/workflows/ci.yml`
- `quality`: install, lint, typecheck, tests unitaires/integration/UI, build.
- `e2e`: Playwright Chromium + upload rapport.
- `pages-build` (push `main/master`): build statique GitHub Pages + upload artefact `out`.
- `deploy` (push `main/master`): publication GitHub Pages via `actions/deploy-pages`.

Note GitHub Pages:
- GitHub Pages est un hebergement statique.
- Le job Pages publie donc une version statique de presentation.
- Les routes serveur (`/api/*`) et le flux d'analyse complet necessitent un runtime Node.js (ex: Vercel, Docker, VM).

## 12) Deploiement

### Option Vercel
1. Connecter le repo.
2. Configurer variables `.env.example`.
3. Build command: `npm run build`.
4. Start command: `npm run start`.

### Option Docker
```bash
docker compose up --build
```

## 13) Qualite mesurable (etat courant)

Execution locale validee:
- `npm run lint` -> OK
- `npm run typecheck` -> OK
- `npm run build` -> OK
- `npm test` -> OK
- `npm run test:e2e` -> OK

Rapports d'audit:
- `dev/docs/final-audit-report.md`
- `dev/docs/repo-ux-ui-architecture-audit-2026-03-20.md`

## 14) Limites connues (non bloquantes)

- Le moteur ATS reste une estimation, pas une reproduction exacte de chaque ATS du marche.
- Le parsing PDF depend de la qualite d'export du document source.
- La conservation des rapports est temporaire (memoire/session), pas un stockage historique.
