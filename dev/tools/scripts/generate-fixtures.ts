import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { Document, Packer, Paragraph } from "docx";

const fixturesDir = path.join(process.cwd(), "dev", "qa", "e2e", "fixtures");

const goodCvLines = [
  "Alex Martin",
  "alex.martin@email.com | +33 6 12 34 56 78 | Paris | linkedin.com/in/alexmartin",
  "Titre: Product Owner Senior",
  "Resume: Product Owner avec 8 ans d'experience en SaaS B2B, data products et roadmap agile.",
  "Experience",
  "- Pilote une roadmap analytics B2B, +24% d'adoption en 12 mois.",
  "- Defini backlog Jira, coordination Design/Tech/Data, livraison de 3 produits.",
  "- Utilise SQL, Figma, Power BI, GitHub et CI/CD au quotidien.",
  "Formation",
  "Master en Management des Systemes d'Information",
  "Competences",
  "SQL, Jira, Figma, Product Discovery, Stakeholders management, Agile, Scrum, Power BI",
  "Certifications",
  "PSM I - Scrum",
  "Langues",
  "Francais natif, Anglais C1",
];

const mediumCvLines = [
  "Camille Dupont",
  "camille.dupont@email.com | +33 7 22 33 44 55 | Lyon",
  "Profil Product Owner",
  "Experience",
  "- Gestion backlog produit",
  "- Coordination equipe projet",
  "- Utilisation Jira et Notion",
  "Formation",
  "Bachelor Marketing Digital",
  "Competences",
  "Jira, Communication, Organisation",
];

const badCvLines = [
  "CV",
  "Profil creatif",
  "Travail en equipe",
  "Motivation",
];

async function writeDocx(fileName: string, lines: string[]) {
  const doc = new Document({
    sections: [
      {
        children: lines.map((line) => new Paragraph({ text: line })),
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  await writeFile(path.join(fixturesDir, fileName), buffer);
}

async function writeInvalidFile() {
  const fakePng = Buffer.from("89504e470d0a1a0a0000000d49484452", "hex");
  await writeFile(path.join(fixturesDir, "invalid-file.png"), fakePng);
}

async function main() {
  await mkdir(fixturesDir, { recursive: true });
  await writeDocx("good-cv.docx", goodCvLines);
  await writeDocx("medium-cv.docx", mediumCvLines);
  await writeDocx("bad-cv.docx", badCvLines);
  await writeInvalidFile();
}

main().catch((error: unknown) => {
  process.stderr.write(`Fixture generation failed: ${String(error)}\n`);
  process.exitCode = 1;
});
