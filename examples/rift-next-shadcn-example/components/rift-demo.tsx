import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { label: "Semantic tokens", value: "64", detail: "bg-primary, text-primary-foreground" },
  { label: "Shadcn primitives", value: "8", detail: "rounded-xl surfaces" },
  { label: "from-code signals", value: "27", detail: "bg-*, text-*, rounded-*" }
];

export function RiftDemo() {
  return (
    <section className="bg-background text-foreground py-20">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6">
        <Card className="border border-border/80 bg-card/95 shadow-2xl">
          <CardHeader className="space-y-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <span className="h-2 w-2 rounded-full bg-primary" /> Rift synced
            </span>
            <CardTitle className="text-3xl md:text-4xl">
              Ship with the same tokens your CLI maintains.
            </CardTitle>
            <CardDescription>
              Tailwind variables map directly to `.rift/tokens.json`, so designers, engineers, and LLMs read the
              same spec.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-8 md:grid-cols-[3fr_2fr]">
            <div className="space-y-6">
              <div className="rounded-2xl border border-border/80 bg-muted/40 p-6 shadow-inner">
                <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">designrules.yaml</p>
                <h3 className="mt-3 text-2xl font-semibold">from-code insights</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Run <code className="rounded-md bg-muted px-2 py-1 text-xs text-foreground">npx @getrift/rift from-code app</code> after editing this page to log
                  every <span className="text-primary">bg-*</span>, <span className="text-primary">text-*</span>, and <span className="text-primary">rounded-*</span> combo.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">bg-primary</span>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">bg-muted</span>
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">bg-accent</span>
                  <span className="rounded-full bg-background px-3 py-1 text-xs font-semibold text-foreground">rounded-xl</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="lg">Generate spec diff</Button>
                <Button variant="outline" size="lg">
                  Run rift from-code
                </Button>
                <Button variant="ghost" className="text-muted-foreground">
                  View tokens
                </Button>
              </div>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/40 p-5">
              <p className="text-sm font-semibold text-muted-foreground">Stats pulled from .rift</p>
              <div className="mt-4 space-y-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-border/70 bg-muted/20 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</p>
                    <p className="mt-1 text-3xl font-semibold text-foreground">{stat.value}</p>
                    <p className="text-sm text-secondary-foreground">{stat.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
