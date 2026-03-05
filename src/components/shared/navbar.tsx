import { Gavel } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { NavbarAuth } from "@/components/shared/navbar-auth";
import { NavbarSearch } from "@/components/shared/navbar-search";

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-card/80 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl items-center gap-4 px-6 py-4">
        <div className="flex min-w-0 flex-1 items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold tracking-wide text-primary transition-opacity hover:opacity-80"
          >
            <span className="flex size-9 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary">
              <Gavel className="size-4" />
            </span>
            LICITOR
          </Link>
          <Link
            href="/listings"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
          >
            Listings
          </Link>
        </div>

        <div className="flex min-w-0 flex-1 justify-center">
          <Suspense
            fallback={
              <div className="h-9 w-full max-w-xl rounded-md bg-muted" />
            }
          >
            <NavbarSearch />
          </Suspense>
        </div>

        <div className="flex flex-1 justify-end">
          <NavbarAuth />
        </div>
      </nav>
    </header>
  );
}
