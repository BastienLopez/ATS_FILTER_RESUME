import Link from "next/link";
import { AlertTriangle, CheckCircle2, CircleX, FileText, RefreshCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScoreChip } from "@/components/ui/score-chip";
import type { AnalysisReport, RecommendationPriority } from "@/types/analysis";

interface ResultDashboardProps {
  report: AnalysisReport;
}

const DETAIL_LABELS: Record<keyof AnalysisReport["scores"]["details"], string> = {
  keywordCoverage: "Couverture mots-cles",
  blockingRequirements: "Pre-requis bloquants",
  structure: "Structure",
  readability: "Lisibilite",
  experienceQuality: "Qualite de l'experience",
  contentQuality: "Qualite du contenu",
};

function priorityLabel(priority: RecommendationPriority) {
  switch (priority) {
    case "haute":
      return "Priorite haute";
    case "moyenne":
      return "Priorite moyenne";
    case "bonus":
      return "Bonus";
  }
}

function priorityVariant(priority: RecommendationPriority): "danger" | "warning" | "info" {
  switch (priority) {
    case "haute":
      return "danger";
    case "moyenne":
      return "warning";
    default:
      return "info";
  }
}

export function ResultDashboard({ report }: ResultDashboardProps) {
  const isAtsOnly = report.analysisMode === "ats_only";
  const matchedRequirements = report.blockingRequirements.filter((item) => item.matched);
  const missingRequirements = report.blockingRequirements.filter((item) => !item.matched);
  const mandatoryRequirements = report.blockingRequirements.filter((item) => item.mandatory);
  const mandatoryMissing = missingRequirements.filter((item) => item.mandatory);

  return (
    <div className="space-y-6">
      <Card className="space-y-4 bg-[var(--color-surface)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-brand)]">Verdict ATS</p>
            <h1 className="text-2xl font-black tracking-tight text-[var(--color-ink)] sm:text-3xl">{report.summary.verdict}</h1>
            <p className="max-w-2xl text-sm text-[var(--color-muted)]">{report.summary.explanation}</p>
          </div>
          <div className="rounded-[16px] border-2 border-[var(--color-brand)] bg-[var(--color-brand-light)] px-5 py-3 text-right text-[var(--color-ink)] shadow-hard-xs">
            <p className="text-xs font-bold uppercase tracking-wide">Score global</p>
            <p className="text-5xl font-black leading-none">{Math.round(report.scores.global)}</p>
            <p className="text-xs font-semibold">/ 100</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Confiance analyse</p>
            <p className="text-lg font-black text-[var(--color-ink)]">{report.summary.confidenceLevel}%</p>
          </div>
          <div className="rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              {isAtsOnly ? "Mode d'analyse" : "Pre-requis obligatoires"}
            </p>
            <p className="text-lg font-black text-[var(--color-ink)]">
              {isAtsOnly
                ? "ATS general"
                : `${mandatoryRequirements.length - mandatoryMissing.length}/${mandatoryRequirements.length}`}
            </p>
          </div>
          <div className="rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Fichier analyse</p>
            <p className="truncate text-sm font-bold text-[var(--color-ink)]">{report.input.fileName}</p>
          </div>
        </div>
      </Card>

      <Card className="space-y-4">
        <CardTitle>Sous-scores cles</CardTitle>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ScoreChip label="Compatibilite ATS" score={report.scores.atsCompatibility} />
          <ScoreChip label="Lisibilite ATS" score={report.scores.readability} />
          <ScoreChip label={isAtsOnly ? "Pertinence CV" : "Correspondance offre"} score={report.scores.matching} />
          <ScoreChip
            label={isAtsOnly ? "Richesse competences" : "Mots-cles"}
            score={report.scores.keywordCoverage}
          />
          <ScoreChip label="Structure" score={report.scores.structure} />
          <ScoreChip label="Completude" score={report.scores.completeness} />
          <ScoreChip label="Pre-requis" score={report.scores.blockingRequirements} />
          <ScoreChip label="Qualite experience" score={report.scores.experienceQuality} />
        </div>
        <div className="space-y-3">
          {Object.entries(report.scores.details).map(([rawKey, detail]) => {
            const key = rawKey as keyof AnalysisReport["scores"]["details"];
            return (
              <div key={key} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <p className="font-semibold text-[var(--color-ink)]">{DETAIL_LABELS[key]}</p>
                <p className="font-black text-[var(--color-ink)]">
                  {Math.round(detail.score)} <span className="text-[var(--color-muted)]">({Math.round(detail.weight * 100)}%)</span>
                </p>
              </div>
              <Progress value={detail.score} />
              <p className="text-xs text-[var(--color-muted)]">{detail.rationale}</p>
            </div>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-3 border-l-2 border-[var(--color-border)] pl-4">
          <h2 className="text-lg font-black tracking-tight text-[var(--color-ink)]">Resume executif</h2>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Points forts</p>
            <ul className="mt-2 space-y-2 text-sm text-[var(--color-muted)]">
              {report.strengths.length > 0 ? (
                report.strengths.map((strength) => (
                  <li key={strength} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-700" aria-hidden="true" suppressHydrationWarning />
                    <span>{strength}</span>
                  </li>
                ))
              ) : (
                <li className="text-[var(--color-muted)]">Aucun point fort majeur detecte a ce stade.</li>
              )}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Points faibles</p>
            <ul className="mt-2 space-y-2 text-sm text-[var(--color-muted)]">
              {report.weaknesses.length > 0 ? (
                report.weaknesses.map((weakness) => (
                  <li key={weakness} className="flex items-start gap-2">
                    <CircleX className="mt-0.5 h-4 w-4 text-red-700" aria-hidden="true" suppressHydrationWarning />
                    <span>{weakness}</span>
                  </li>
                ))
              ) : (
                <li className="text-[var(--color-muted)]">Aucun point faible critique identifie.</li>
              )}
            </ul>
          </div>
        </section>

        <section className="space-y-3 border-l-2 border-[var(--color-border)] pl-4">
          <h2 className="text-lg font-black tracking-tight text-[var(--color-ink)]">
            {isAtsOnly ? "Competences detectees dans le CV" : "Mots-cles de l'offre"}
          </h2>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">
              {isAtsOnly ? "Detectes dans le CV" : "Trouves dans le CV"}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {report.matchedKeywords.length > 0 ? (
                report.matchedKeywords.map((keyword) => (
                  <Badge key={keyword} variant="success">
                    {keyword}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-[var(--color-muted)]">Aucun mot-cle strategique detecte.</p>
              )}
            </div>
          </div>

          {!isAtsOnly ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Manquants ou insuffisants</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {report.missingKeywords.length > 0 ? (
                  report.missingKeywords.map((keyword) => (
                    <Badge key={keyword} variant="warning">
                      {keyword}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-[var(--color-muted)]">Aucun manque important detecte sur les mots-cles.</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-[var(--color-muted)]">
              Ajoutez une offre ciblee pour afficher les mots-cles manquants et le niveau d&apos;alignement metier.
            </p>
          )}
        </section>
      </div>

      <Card className="space-y-3">
        <CardTitle>Exigences et pre-requis</CardTitle>
        <CardDescription>
          {isAtsOnly
            ? "Aucune offre n&apos;a ete fournie: cette section est activee automatiquement quand vous ajoutez une offre ciblee."
            : "Validation explicite des exigences detectees dans l&apos;offre, avec distinction obligatoire ou preferee."}
        </CardDescription>

        {isAtsOnly ? (
          <div className="rounded-[14px] border-2 border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4 text-sm text-[var(--color-muted)]">
            Lancez une nouvelle analyse avec une offre d&apos;emploi pour obtenir le tableau detaille des exigences et
            prerequis.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[14px] border-2 border-[var(--color-border)] shadow-hard-xs">
            <table className="min-w-full bg-[var(--color-surface)] text-sm">
              <thead className="border-b-2 border-[var(--color-border)] bg-[var(--color-surface-muted)] text-left">
                <tr>
                  <th className="px-3 py-2 font-black">Exigence</th>
                  <th className="px-3 py-2 font-black">Type</th>
                  <th className="px-3 py-2 font-black">Niveau</th>
                  <th className="px-3 py-2 font-black">Statut</th>
                </tr>
              </thead>
              <tbody>
                {report.blockingRequirements.map((requirement) => (
                  <tr key={requirement.id} className="border-b border-stone-200 last:border-b-0">
                    <td className="px-3 py-2 text-[var(--color-ink)]">{requirement.label}</td>
                    <td className="px-3 py-2 text-[var(--color-muted)]">{requirement.type}</td>
                    <td className="px-3 py-2">
                      <Badge variant={requirement.mandatory ? "danger" : "info"}>
                        {requirement.mandatory ? "Obligatoire" : "Preferee"}
                      </Badge>
                    </td>
                    <td className="px-3 py-2">
                      <Badge variant={requirement.matched ? "success" : "warning"}>
                        {requirement.matched ? "Satisfaite" : "Non satisfaite"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[14px] border-2 border-emerald-800 bg-emerald-100 p-3 text-sm text-emerald-950">
            <p className="font-black">Exigences satisfaites</p>
            <p>{matchedRequirements.length} element(s) detecte(s) dans le CV.</p>
          </div>
          <div className="rounded-[14px] border-2 border-amber-800 bg-amber-100 p-3 text-sm text-amber-950">
            <p className="font-black">Exigences non satisfaites</p>
            <p>{missingRequirements.length} element(s) a couvrir prioritairement.</p>
          </div>
        </div>
      </Card>

      <Card className="space-y-3">
        <CardTitle>Recommandations priorisees</CardTitle>
        <CardDescription>
          {isAtsOnly
            ? "Plan d'action concret pour ameliorer la compatibilite ATS generale de votre CV."
            : "Plan d'action concret pour augmenter la compatibilite ATS sur cette offre."}
        </CardDescription>
        <div className="space-y-3">
          {report.recommendations.map((recommendation) => (
            <article
              key={recommendation.id}
              className="rounded-[14px] border-2 border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4 shadow-hard-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-black text-[var(--color-ink)]">{recommendation.issue}</p>
                <div className="flex items-center gap-2">
                  <Badge variant={priorityVariant(recommendation.priority)}>{priorityLabel(recommendation.priority)}</Badge>
                  <Badge variant="neutral">Impact estime +{recommendation.estimatedImpact}</Badge>
                </div>
              </div>
              <p className="mt-2 text-sm text-[var(--color-muted)]">{recommendation.whyItMatters}</p>
              <p className="mt-2 text-sm font-semibold text-[var(--color-ink)]">{recommendation.howToFix}</p>
              {recommendation.example ? (
                <p className="mt-2 rounded-[10px] border border-stone-300 bg-white px-2 py-1 text-xs text-[var(--color-muted)]">
                  {recommendation.example}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-3 border-l-2 border-[var(--color-border)] pl-4">
          <h2 className="text-lg font-black tracking-tight text-[var(--color-ink)]">Risques de format ATS</h2>
          {report.formatRisks.length > 0 ? (
            <ul className="space-y-2 text-sm text-[var(--color-muted)]">
              {report.formatRisks.map((risk) => (
                <li key={risk} className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-700" aria-hidden="true" suppressHydrationWarning />
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--color-muted)]">Aucun risque de format majeur detecte.</p>
          )}

          {report.scores.penalties.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-muted)]">Penalites appliquees</p>
              {report.scores.penalties.map((penalty) => (
                <div
                  key={penalty.code}
                  className="flex items-center justify-between rounded-[10px] border border-red-300 bg-red-50 px-3 py-2 text-sm"
                >
                  <p className="font-semibold text-red-900">{penalty.label}</p>
                  <p className="font-black text-red-900">-{penalty.points}</p>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        <section className="space-y-3 border-l-2 border-[var(--color-border)] pl-4">
          <h2 className="text-lg font-black tracking-tight text-[var(--color-ink)]">Limites de l&apos;analyse</h2>
          <ul className="space-y-2 text-sm text-[var(--color-muted)]">
            {report.limitations.map((limitation) => (
              <li key={limitation} className="flex items-start gap-2">
                <FileText className="mt-0.5 h-4 w-4 text-[var(--color-muted)]" aria-hidden="true" suppressHydrationWarning />
                <span>{limitation}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <Card className="space-y-3">
        <CardTitle>Apercu du texte extrait (ATS)</CardTitle>
        <p className="text-sm text-[var(--color-muted)]">
          Verifiez ici le contenu reellement lu par le moteur. Si le texte semble incoherent, reexportez votre CV.
        </p>
        <div className="grid gap-2 sm:grid-cols-4">
          <div className="rounded-[12px] border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs">
            <p className="font-semibold text-[var(--color-muted)]">Caracteres</p>
            <p className="text-sm font-black text-[var(--color-ink)]">{report.extractionStats.characterCount}</p>
          </div>
          <div className="rounded-[12px] border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs">
            <p className="font-semibold text-[var(--color-muted)]">Mots</p>
            <p className="text-sm font-black text-[var(--color-ink)]">{report.extractionStats.wordCount}</p>
          </div>
          <div className="rounded-[12px] border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs">
            <p className="font-semibold text-[var(--color-muted)]">Lignes</p>
            <p className="text-sm font-black text-[var(--color-ink)]">{report.extractionStats.lineCount}</p>
          </div>
          <div className="rounded-[12px] border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs">
            <p className="font-semibold text-[var(--color-muted)]">Densite texte</p>
            <p className="text-sm font-black text-[var(--color-ink)]">
              {Math.round(report.extractionStats.denseTextRatio * 100)}%
            </p>
          </div>
        </div>
        <pre className="max-h-[380px] overflow-auto rounded-[14px] border-2 border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4 text-xs leading-relaxed text-[var(--color-ink)] shadow-hard-xs">
          {report.cvTextPreview}
        </pre>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Link href="/analyse">
          <Button variant="secondary">
            <RefreshCcw className="h-4 w-4" aria-hidden="true" suppressHydrationWarning />
            Relancer une analyse
          </Button>
        </Link>
        <Link href="/ats">
          <Button variant="ghost">Lire le guide ATS</Button>
        </Link>
      </div>
    </div>
  );
}

