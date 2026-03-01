"use client";

import { Card, CardContent } from "@/components/ui/card";

type ExplainerStep = {
  description: string;
  title: string;
};

type CreateListingStepsCardProps = {
  steps: ExplainerStep[];
};

export function CreateListingStepsCard({ steps }: CreateListingStepsCardProps) {
  return (
    <Card className="min-h-0 border-border/70 bg-card/95 py-0 shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
      <CardContent className="flex h-full min-h-0 flex-col justify-center gap-3 p-4 md:p-5">
        <div className="space-y-3">
          {steps.map(({ description, title }, index) => (
            <div
              key={title}
              className="rounded-[1.5rem] border border-border/70 bg-background/45 p-4"
            >
              <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <span className="text-sm font-semibold">0{index + 1}</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-foreground">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
