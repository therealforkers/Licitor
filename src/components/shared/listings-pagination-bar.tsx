"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  type ListingPageSize,
  type ListingPaginationMeta,
  listingPageSizeOptions,
} from "@/lib/listing-browse";

type ListingsPaginationBarProps = {
  pagination: ListingPaginationMeta;
};

const buildPageTokens = (totalPages: number, currentPage: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages] as const;
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ] as const;
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ] as const;
};

export function ListingsPaginationBar({
  pagination,
}: ListingsPaginationBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  if (pagination.totalCount === 0) {
    return null;
  }

  const navigateWithParams = (mutator: (params: URLSearchParams) => void) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());
    mutator(nextSearchParams);
    const nextQueryString = nextSearchParams.toString();
    const nextHref = nextQueryString
      ? `${pathname}?${nextQueryString}`
      : pathname;

    startTransition(() => {
      router.replace(nextHref, { scroll: false });
    });
  };

  const setPage = (nextPage: number) => {
    navigateWithParams((params) => {
      params.set("page", String(nextPage));
    });
  };

  const setPageSize = (nextPageSize: ListingPageSize) => {
    navigateWithParams((params) => {
      params.set("pageSize", String(nextPageSize));
      params.set("page", "1");
    });
  };

  const hasPreviousPage = pagination.page > 1;
  const hasNextPage = pagination.page < pagination.totalPages;
  const pageTokens = buildPageTokens(pagination.totalPages, pagination.page);
  const keyedPageTokens: Array<{ key: string; token: number | "..." }> = [];
  let ellipsisCount = 0;

  for (const token of pageTokens) {
    if (token === "...") {
      ellipsisCount += 1;
      keyedPageTokens.push({ key: `ellipsis-${ellipsisCount}`, token });
      continue;
    }

    keyedPageTokens.push({ key: `page-${token}`, token });
  }

  return (
    <div className="sticky bottom-0 z-20 mt-8 border-t border-border/70 bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <p className="text-center text-sm text-muted-foreground lg:text-left">
          {pagination.from}-{pagination.to} of {pagination.totalCount}
        </p>

        <Pagination className="justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={!hasPreviousPage}
                className={
                  !hasPreviousPage
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
                onClick={(event) => {
                  event.preventDefault();

                  if (!hasPreviousPage) {
                    return;
                  }

                  setPage(pagination.page - 1);
                }}
              />
            </PaginationItem>

            {keyedPageTokens.map(({ key, token }) => (
              <PaginationItem key={key}>
                {token === "..." ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#"
                    isActive={token === pagination.page}
                    onClick={(event) => {
                      event.preventDefault();
                      setPage(token);
                    }}
                  >
                    {token}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                aria-disabled={!hasNextPage}
                className={
                  !hasNextPage ? "pointer-events-none opacity-50" : undefined
                }
                onClick={(event) => {
                  event.preventDefault();

                  if (!hasNextPage) {
                    return;
                  }

                  setPage(pagination.page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        <div className="flex items-center justify-center gap-2 lg:justify-end">
          {listingPageSizeOptions.map((size) => (
            <Button
              key={size}
              type="button"
              variant={pagination.pageSize === size ? "default" : "outline"}
              size="sm"
              disabled={isPending}
              onClick={() => setPageSize(size)}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
