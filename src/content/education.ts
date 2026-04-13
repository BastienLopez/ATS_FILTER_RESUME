export const atsEducationSections = [
  {
    title: "Qu'est-ce qu'un ATS ?",
    body: "Un ATS (Applicant Tracking System) est un logiciel utilise par les recruteurs pour centraliser, filtrer et classer les candidatures. Il lit votre CV avant qu'un humain ne le consulte.",
  },
  {
    title: "Comment un ATS lit un CV",
    body: "Le systeme extrait le texte brut du document, reconnait des sections (experience, competences, formation), puis compare vos informations avec les exigences de l'offre.",
  },
  {
    title: "Pourquoi certains CV echouent",
    body: "Les principaux motifs d'echec: PDF scanne non lisible, structure trop complexe, sections absentes, manque de mots-cles metier, prerequis obligatoires non mentionnes.",
  },
  {
    title: "Comment optimiser un CV pour ATS",
    body: "Utilisez une structure standard, des titres explicites, des experiences chiffrables et les termes exacts de l'offre lorsque c'est pertinent. Evitez les tableaux complexes et les icones decoratives.",
  },
];

export const atsMistakesToAvoid = [
  "Mettre toutes les competences dans un bloc flou sans contexte d'usage.",
  "Utiliser des intitulés de sections creatifs que l'ATS ne reconnait pas.",
  "Ignorer les prerequis obligatoires de l'offre (langue, annees, certification).",
  "Ne pas afficher clairement email, telephone et localisation.",
  "Envoyer un CV image-only ou un export PDF de mauvaise qualite.",
];

export const atsFaq = [
  {
    q: "Un bon score ATS garantit-il un entretien ?",
    a: "Non. Le score indique une compatibilite technique avec l'offre et le parsing ATS, pas une decision finale de recrutement.",
  },
  {
    q: "Pourquoi le score change selon l'offre ?",
    a: "La correspondance depend des competences, outils et prerequis specifiques a chaque poste. Un meme CV peut mieux correspondre a une offre qu'a une autre.",
  },
  {
    q: "Dois-je adapter mon CV a chaque candidature ?",
    a: "Oui. Ajuster le vocabulaire, les experiences mises en avant et les mots-cles augmente fortement la pertinence ATS.",
  },
  {
    q: "Les ATS penalitent-ils les designs modernes ?",
    a: "Le design n'est pas penalise en soi. Ce qui pose probleme, c'est la complexite de structure (colonnes, tableaux, elements graphiques non textuels).",
  },
  {
    q: "Mes donnees sont-elles stockees ?",
    a: "Par defaut, le rapport est conserve temporairement en memoire puis expire. Aucun stockage permanent n'est necessaire pour le parcours principal.",
  },
];
