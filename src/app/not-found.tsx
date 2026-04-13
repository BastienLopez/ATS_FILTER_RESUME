import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export default function NotFoundPage() {
  return (
    <div className="space-y-6">
      <Card className="bg-[var(--color-surface-muted)]">
        <CardTitle className="text-2xl">Page introuvable</CardTitle>
        <CardDescription className="mt-2">
          La page demandee n&apos;existe pas ou a ete deplacee. Reprenez depuis l&apos;analyse principale.
        </CardDescription>
        <div className="mt-5">
          <Link href="/analyse" className="inline-block">
            <Button>Analyser mon CV</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
