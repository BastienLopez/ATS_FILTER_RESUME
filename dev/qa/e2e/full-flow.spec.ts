import path from "node:path";
import { expect, test } from "@playwright/test";

const fixtures = path.join(process.cwd(), "dev", "qa", "e2e", "fixtures");

test("parcours complet home -> analyse -> resultats", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /compatible ats/i })).toBeVisible();

  await page.getByRole("link", { name: /analyser mon cv/i }).first().click();
  await expect(page).toHaveURL(/\/analyse/);

  await page.setInputFiles('input[type="file"]', path.join(fixtures, "good-cv.docx"));
  await page.getByRole("button", { name: /ins.rer un exemple/i }).click();
  await page.getByRole("button", { name: /^analyser mon cv$/i }).click();

  await expect(page).toHaveURL(/\/resultats\//, { timeout: 30_000 });
  await expect(page.getByText(/score global/i)).toBeVisible();
  await expect(page.getByRole("heading", { name: /recommandations/i })).toBeVisible();
});

test("gere un fichier invalide avec message explicite", async ({ page }) => {
  await page.goto("/analyse");

  await page.setInputFiles('input[type="file"]', path.join(fixtures, "invalid-file.png"));
  await expect(page.getByText(/format invalide/i)).toBeVisible();
});

test("analyse ATS possible sans offre d'emploi", async ({ page }) => {
  await page.goto("/analyse");

  await page.setInputFiles('input[type="file"]', path.join(fixtures, "good-cv.docx"));
  await page.getByRole("button", { name: /^analyser mon cv$/i }).click();

  await expect(page).toHaveURL(/\/resultats\//, { timeout: 30_000 });
  await expect(page.getByText(/mode d'analyse/i)).toBeVisible();
  await expect(page.getByText(/^ATS general$/)).toBeVisible();
});

test("smoke test pages principales", async ({ page }) => {
  const routes = ["/", "/analyse", "/ats", "/a-propos", "/confidentialite", "/conditions"];
  for (const route of routes) {
    await page.goto(route);
    await expect(page.getByRole("main")).toBeVisible();
  }
});
