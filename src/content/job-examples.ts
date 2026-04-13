export interface JobDescriptionExample {
  id: string;
  title: string;
  description: string;
}

export const JOB_DESCRIPTION_EXAMPLES: JobDescriptionExample[] = [
  {
    id: "fullstack",
    title: "Developpeur Full Stack",
    description: `Nous recrutons un Developpeur Full Stack pour une plateforme SaaS B2B.

Missions:
- Concevoir et developper des fonctionnalites frontend et backend.
- Collaborer avec Product, Design et QA.
- Assurer la qualite, la performance et la maintenabilite du code.

Stack:
- React, TypeScript, Node.js, PostgreSQL, Docker, GitHub Actions.

Exigences obligatoires:
- 4 ans minimum en developpement web.
- Maitrise TypeScript, React et Node.js.
- Connaissance SQL et APIs REST.
- Anglais professionnel.

Exigences preferees:
- Experience Next.js.
- Experience cloud (AWS/GCP).
- Pratique des tests automatises (Vitest, Playwright).`,
  },
  {
    id: "frontend-react",
    title: "Developpeur Frontend React",
    description: `Nous recherchons un Developpeur Frontend React pour un produit digital a fort trafic.

Missions:
- Construire des interfaces robustes, accessibles et performantes.
- Integrer les maquettes Figma avec un design system coherent.
- Travailler en collaboration avec les equipes backend et produit.

Exigences obligatoires:
- 3 ans d'experience frontend.
- Maitrise React, TypeScript, HTML/CSS.
- Bonne connaissance des performances web et de l'accessibilite.

Exigences preferees:
- Experience Next.js.
- Connaissance des tests UI.
- Experience Tailwind CSS.`,
  },
  {
    id: "backend-python",
    title: "Developpeur Backend Python",
    description: `Nous recrutons un Developpeur Backend Python pour concevoir des services data scalables.

Missions:
- Developper des APIs et des traitements backend.
- Optimiser les performances et la qualite du code.
- Participer aux choix d'architecture.

Exigences obligatoires:
- 4 ans d'experience backend.
- Python, FastAPI ou Django, SQL.
- Connaissance Docker et CI/CD.

Exigences preferees:
- Experience Kafka ou RabbitMQ.
- Connaissance AWS.
- Bon niveau d'anglais.`,
  },
  {
    id: "react-native-mobile",
    title: "Developpeur Mobile React Native",
    description: `Nous recherchons un Developpeur Mobile React Native pour une application B2C.

Missions:
- Construire de nouvelles fonctionnalites iOS/Android.
- Maintenir une qualite de code elevee et documentee.
- Collaborer avec Product Design et QA.

Exigences obligatoires:
- 3 ans d'experience mobile.
- React Native, TypeScript, Git.
- Maitrise des appels API et gestion d'etat.

Exigences preferees:
- Experience Flutter.
- Publication store et analytics mobile.`,
  },
  {
    id: "devops",
    title: "Ingenieur DevOps",
    description: `Nous recrutons un Ingenieur DevOps pour industrialiser notre plateforme cloud.

Missions:
- Concevoir des pipelines CI/CD fiables.
- Automatiser l'infrastructure et le monitoring.
- Renforcer la securite et la resilience des environnements.

Exigences obligatoires:
- 4 ans en DevOps/SRE.
- Docker, Kubernetes, Terraform.
- Experience CI/CD (GitHub Actions, GitLab CI).

Exigences preferees:
- AWS ou GCP.
- Observabilite (Prometheus, Grafana).
- Scripting Python ou Bash.`,
  },
  {
    id: "ml-engineer",
    title: "Ingenieur IA / Machine Learning",
    description: `Nous recrutons un Ingenieur IA pour integrer des modeles de machine learning en production.

Missions:
- Concevoir des pipelines ML de bout en bout.
- Mettre en production des modeles et mesurer leur performance.
- Collaborer avec Data Scientists et equipes produit.

Exigences obligatoires:
- 3 ans en ML engineering.
- Python, scikit-learn, pandas.
- Experience MLOps et deploiement API.

Exigences preferees:
- PyTorch ou TensorFlow.
- Experience cloud ML (AWS SageMaker, Vertex AI).
- Connaissance NLP ou LLM.`,
  },
  {
    id: "data-analyst",
    title: "Analyste Data",
    description: `Nous recherchons un Analyste Data pour accompagner les decisions metier.

Missions:
- Construire des tableaux de bord et analyses ad hoc.
- Identifier des enseignements actionnables.
- Collaborer avec les equipes metier.

Exigences obligatoires:
- 2 ans d'experience en analyse de donnees.
- SQL avance.
- Maitrise Power BI ou Tableau.

Exigences preferees:
- Python pour analyses complementaires.
- Bonne communication ecrite et orale.
- Connaissance produit SaaS.`,
  },
  {
    id: "data-engineer",
    title: "Ingenieur Data",
    description: `Nous recrutons un Ingenieur Data pour fiabiliser et faire evoluer nos flux de donnees.

Missions:
- Concevoir des pipelines ETL/ELT.
- Assurer la qualite, gouvernance et disponibilite des donnees.
- Collaborer avec les equipes Analytics et Data Science.

Exigences obligatoires:
- 4 ans en data engineering.
- SQL, Python, orchestration (Airflow).
- Connaissance data warehouse (BigQuery/Snowflake).

Exigences preferees:
- dbt.
- Kafka.
- Cloud (AWS/GCP/Azure).`,
  },
  {
    id: "qa-automation",
    title: "Ingenieur QA Automatisation",
    description: `Nous recherchons un Ingenieur QA Automatisation pour renforcer la qualite logicielle.

Missions:
- Concevoir et maintenir les tests automatises.
- Integrer les tests au pipeline CI.
- Travailler avec devs et product pour prevenir les regressions.

Exigences obligatoires:
- 3 ans en QA automation.
- Playwright ou Cypress.
- Tests API et strategie de test.

Exigences preferees:
- Experience en tests de performance.
- Connaissance TypeScript.
- Experience Agile Scrum.`,
  },
  {
    id: "product-manager",
    title: "Chef de Produit",
    description: `Nous recrutons un Chef de Produit pour piloter un produit SaaS.

Missions:
- Definir la roadmap et prioriser le backlog.
- Suivre les KPIs produit.
- Coordonner Design, Tech et metier.

Exigences obligatoires:
- 4 ans d'experience en Product Management.
- Capacite a ecrire des specs claires.
- Anglais professionnel.

Exigences preferees:
- SQL pour analyses.
- Experience B2B SaaS.
- Connaissance Jira et Figma.`,
  },
  {
    id: "ux-ui",
    title: "UX/UI Designer",
    description: `Nous recherchons un UX/UI Designer pour concevoir des experiences produit claires et efficaces.

Missions:
- Realiser des parcours utilisateurs et prototypes.
- Collaborer avec Product et Engineering.
- Maintenir un design system evolutif.

Exigences obligatoires:
- 3 ans d'experience UX/UI.
- Maitrise Figma.
- Portfolio solide.

Exigences preferees:
- Experience SaaS B2B.
- Connaissance accessibilite.
- Capacite a tester les interfaces avec les utilisateurs.`,
  },
  {
    id: "cybersecurity",
    title: "Analyste Cybersecurite",
    description: `Nous recrutons un Analyste Cybersecurite pour renforcer notre posture de securite.

Missions:
- Surveiller les incidents et vulnerabilites.
- Participer aux audits et plans de remediation.
- Sensibiliser les equipes aux bonnes pratiques.

Exigences obligatoires:
- 3 ans en cybersecurite.
- Connaissance SIEM et EDR.
- Maitrise des standards securite.

Exigences preferees:
- Certification ISO 27001, CEH ou equivalent.
- Experience cloud security.
- Scripting Python/Bash.`,
  },
  {
    id: "cloud-architect",
    title: "Architecte Cloud",
    description: `Nous recrutons un Architecte Cloud pour definir l'architecture cloud cible.

Missions:
- Concevoir des architectures resilientes et securisees.
- Accompagner les equipes sur les bonnes pratiques cloud.
- Optimiser couts, performance et scalabilite.

Exigences obligatoires:
- 6 ans en architecture cloud.
- AWS ou Azure.
- Infrastructure as Code.

Exigences preferees:
- Kubernetes.
- Experience multi-cloud.
- Leadership technique.`,
  },
  {
    id: "scrum-master",
    title: "Scrum Master",
    description: `Nous recherchons un Scrum Master pour accompagner les equipes produit et tech.

Missions:
- Faciliter les ceremonies Agile.
- Lever les impediments et fluidifier la livraison.
- Coacher l'equipe sur l'amelioration continue.

Exigences obligatoires:
- 3 ans d'experience en Scrum Master.
- Connaissance Agile/Scrum solide.
- Excellente communication.

Exigences preferees:
- Certification Scrum.
- Experience environnement produit SaaS.`,
  },
  {
    id: "backend-java",
    title: "Developpeur Backend Java",
    description: `Nous recrutons un Developpeur Backend Java pour des services critiques.

Missions:
- Developper des microservices robustes.
- Assurer la qualite et la securite du code.
- Collaborer avec les equipes architecture et produit.

Exigences obligatoires:
- 4 ans en Java backend.
- Spring Boot, SQL, APIs REST.
- Experience tests automatises.

Exigences preferees:
- Kafka.
- Docker/Kubernetes.
- Experience cloud.`,
  },
];

export const DEFAULT_JOB_EXAMPLE_ID = JOB_DESCRIPTION_EXAMPLES[0]?.id ?? "";
