import { ClipboardList } from "lucide-react";

import { PlaceholderPage } from "@/components/shared/placeholder-page";

export default function MyListingsPage() {
  return (
    <PlaceholderPage
      title="My Listings"
      description="Your seller inventory workspace will appear here in Phase 1D, including status tabs for drafts, active auctions, scheduled launches, and ended listings."
      eyebrow="Seller inventory"
      icon={ClipboardList}
      primaryHref="/listings/new"
      primaryLabel="Create Listing"
    />
  );
}
