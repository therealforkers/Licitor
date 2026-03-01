import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PlaceholderPageProps = {
  title: string;
  description: string;
  eyebrow: string;
  icon: LucideIcon;
  primaryHref: string;
  primaryLabel: string;
};

export function PlaceholderPage({
  title,
  description,
  eyebrow,
  icon: Icon,
  primaryHref,
  primaryLabel,
}: PlaceholderPageProps) {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-1 items-center px-6 py-16">
      <Card className="w-full border-border/70 py-0 shadow-sm">
        <CardHeader className="space-y-4 border-b border-border/70 px-6 py-6">
          <Badge
            variant="outline"
            className="w-fit border-primary/30 bg-primary/10 uppercase tracking-[0.18em] text-primary"
          >
            {eyebrow}
          </Badge>
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
              <Icon className="size-5" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl">{title}</CardTitle>
              <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
                {description}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 px-6 py-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              This destination is scaffolded for Phase 1.
            </p>
            <p className="text-sm text-muted-foreground">
              Navigation is live now so the next implementation steps can build
              on stable routes.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href={primaryHref}>{primaryLabel}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/listings">Browse Listings</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
