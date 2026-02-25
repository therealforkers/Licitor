import Link from "next/link";

const featuredLots = [
  {
    title: "1967 Mustang Fastback",
    bid: "$84,500",
    endsIn: "2h 14m",
  },
  {
    title: "Rare Sapphire Bracelet",
    bid: "$12,300",
    endsIn: "5h 02m",
  },
  {
    title: "Mid-Century Walnut Desk",
    bid: "$3,900",
    endsIn: "8h 47m",
  },
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_10%,color-mix(in_oklab,var(--primary)_25%,transparent)_0%,transparent_45%)]" />
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16 md:py-24">
        <div className="space-y-6">
          <p className="inline-flex rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
            Premium live auctions
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-foreground md:text-6xl">
            Win rare finds at the right moment.
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
            Licitor connects collectors with verified sellers through curated,
            fast-moving auctions.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/listings"
              className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Browse Listings
            </Link>
            <button
              type="button"
              className="rounded-md border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/60 hover:text-primary"
            >
              Become a Seller
            </button>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          {featuredLots.map((lot) => (
            <article
              key={lot.title}
              className="rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <p className="text-sm text-muted-foreground">Featured lot</p>
              <h2 className="mt-2 text-lg font-semibold text-foreground">
                {lot.title}
              </h2>
              <div className="mt-6 flex items-end justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Current bid
                  </p>
                  <p className="text-2xl font-semibold text-primary">
                    {lot.bid}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Ends in
                  </p>
                  <p className="text-base font-medium text-foreground">
                    {lot.endsIn}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>
      </section>
    </div>
  );
}
