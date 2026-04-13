export const SECTION_PATTERNS: Record<string, { label: string; patterns: RegExp[] }> = {
  contact: {
    label: "Informations de contact",
    patterns: [/coordonnees/i, /contact/i, /informations personnelles/i],
  },
  title: {
    label: "Titre du profil",
    patterns: [/titre/i, /poste vise/i, /intitule/i, /profil/i],
  },
  summary: {
    label: "Resume",
    patterns: [/resume/i, /profil/i, /objectif/i, /about/i],
  },
  experience: {
    label: "Experience",
    patterns: [/experience/i, /parcours/i, /professional experience/i],
  },
  education: {
    label: "Formation",
    patterns: [/formation/i, /education/i, /diplome/i],
  },
  skills: {
    label: "Competences",
    patterns: [/competences/i, /skills/i, /tech stack/i, /outils/i],
  },
  certifications: {
    label: "Certifications",
    patterns: [/certification/i, /accreditation/i],
  },
  languages: {
    label: "Langues",
    patterns: [/langues?/i, /languages?/i],
  },
  projects: {
    label: "Projets",
    patterns: [/projets?/i, /projects?/i],
  },
  links: {
    label: "Liens utiles",
    patterns: [/portfolio/i, /github/i, /linkedin/i, /liens?/i],
  },
};

export const KNOWN_SKILLS = [
  "typescript",
  "javascript",
  "react",
  "next.js",
  "node.js",
  "python",
  "java",
  "c#",
  "sql",
  "postgresql",
  "mysql",
  "mongodb",
  "redis",
  "docker",
  "kubernetes",
  "aws",
  "azure",
  "gcp",
  "terraform",
  "ansible",
  "git",
  "ci/cd",
  "github actions",
  "jest",
  "vitest",
  "playwright",
  "tailwind",
  "figma",
  "rest",
  "graphql",
  "linux",
  "agile",
  "scrum",
  "seo",
  "google analytics",
  "power bi",
  "webflow",
  "php",
  "flask",
  "pytorch",
  "tensorflow",
];

export const SKILL_SYNONYMS: Record<string, string[]> = {
  "next.js": ["nextjs", "next js"],
  javascript: ["js", "ecmascript"],
  typescript: ["ts"],
  "node.js": ["node", "nodejs"],
  "ci/cd": ["cicd", "continuous integration", "continuous delivery"],
  "github actions": ["gha"],
  kubernetes: ["k8s"],
  "power bi": ["powerbi"],
  graphql: ["graph ql"],
};

export const KNOWN_TOOLS = [
  "jira",
  "notion",
  "slack",
  "salesforce",
  "sap",
  "tableau",
  "power bi",
  "figma",
  "adobe xd",
  "postman",
  "gitlab",
  "github",
  "bitbucket",
  "docker",
  "webflow",
];

export const KNOWN_LANGUAGES = [
  "francais",
  "anglais",
  "espagnol",
  "allemand",
  "italien",
  "portugais",
  "chinois",
  "japonais",
];

export const LANGUAGE_SYNONYMS: Record<string, string[]> = {
  francais: ["french", "francais", "français"],
  anglais: ["english"],
  espagnol: ["spanish"],
  allemand: ["german"],
  italien: ["italian"],
  portugais: ["portuguese"],
  chinois: ["chinese", "mandarin"],
  japonais: ["japanese"],
};

export const ACTION_VERBS = [
  "pilote",
  "deploye",
  "optimise",
  "concu",
  "developpe",
  "coordonne",
  "structure",
  "automatise",
  "ameliore",
  "reduit",
  "augmente",
  "livre",
  "implemented",
  "delivered",
  "optimized",
  "built",
  "led",
  "managed",
];

export const RISKY_FORMAT_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  { label: "Tableaux potentiellement complexes", pattern: /\|.+\|/ },
  { label: "Colonnes multiples probables", pattern: /\t{2,}/ },
  { label: "Pictogrammes decoratifs detectes", pattern: /[\u25A0\u25C6\u25CF\u25BA]/ },
  { label: "Bloc de caracteres non textuels", pattern: /[^\w\s.,;:!?()\-/'"+@%&]{6,}/ },
];

export const DEGREE_PATTERNS = [/master/i, /mba/i, /bac\+5/i, /licence/i, /bachelor/i, /diplome/i];

export const CERTIFICATION_PATTERNS = [/certification/i, /aws certified/i, /pmp/i, /scrum master/i, /itil/i];

export const SAMPLE_JOB_DESCRIPTION = `Nous recrutons un Product Owner Senior oriente data pour piloter une plateforme analytics B2B.

Responsabilites principales :
- Definir la roadmap produit avec les equipes metier et tech.
- Prioriser le backlog dans Jira et animer les rituels Agile.
- Collaborer avec des equipes Data, Engineering et Design.
- Suivre les KPI d'adoption et proposer des optimisations.

Exigences obligatoires :
- 5 ans minimum d'experience en Product Management.
- Maitrise de SQL, Jira et Figma.
- Anglais professionnel (C1).
- Presence 3 jours/semaine a Paris.

Exigences preferees :
- Experience sur Power BI ou Tableau.
- Certification Scrum.
- Connaissance d'un environnement SaaS B2B.`;
