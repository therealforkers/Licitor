"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { SubmitEvent } from "react";
import { useEffect, useState } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  buildListingsSearchHref,
  parseListingSearchTerm,
} from "@/lib/listing-browse";

export function NavbarSearch() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearchTerm =
    parseListingSearchTerm(searchParams.get("q") ?? undefined) ?? "";
  const [searchInput, setSearchInput] = useState(initialSearchTerm);

  useEffect(() => {
    setSearchInput(
      parseListingSearchTerm(searchParams.get("q") ?? undefined) ?? "",
    );
  }, [searchParams]);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextHref = buildListingsSearchHref({
      pathname,
      currentSearchParams: searchParams,
      query: searchInput,
    });

    router.push(nextHref);
  };

  return (
    <search className="w-full max-w-xl" aria-label="Search listings">
      <form className="w-full" onSubmit={handleSubmit}>
        <InputGroup>
          <InputGroupInput
            type="search"
            placeholder="Search listings"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton type="submit" size="icon-sm" aria-label="Search">
              <Search className="size-4" />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </search>
  );
}
