import Link from "next/link";

export default function ListingsPage() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
          Listings
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Placeholder content for upcoming auction inventory, filtering, and
          category views.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          No active listing modules yet. This page will show live and scheduled
          lots.
        </p>
      </div>

      <div>
        <Link
          href="/"
          className="inline-flex rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}
