import { APP_CONFIG } from "@/lib/config";
import type { AnalysisReport } from "@/types/analysis";

interface StoredReport {
  report: AnalysisReport;
  expiresAt: number;
}

const store = new Map<string, StoredReport>();

function now() {
  return Date.now();
}

function cleanupExpired() {
  const currentTime = now();
  for (const [id, entry] of store.entries()) {
    if (entry.expiresAt <= currentTime) {
      store.delete(id);
    }
  }
}

export function saveReport(report: AnalysisReport) {
  cleanupExpired();
  store.set(report.id, {
    report,
    expiresAt: now() + APP_CONFIG.reportTtlMinutes * 60 * 1000,
  });
  return report.id;
}

export function getReport(reportId: string) {
  cleanupExpired();
  return store.get(reportId)?.report ?? null;
}

export function clearReports() {
  store.clear();
}

export function getStoreSize() {
  cleanupExpired();
  return store.size;
}
