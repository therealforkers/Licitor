import { ShoppingBag } from "lucide-react";

import { PlaceholderPage } from "@/components/shared/placeholder-page";

export default function CreateListingPage() {
  return (
    <PlaceholderPage
      title="Sell My Item"
      description="The guided listing creation flow lands here in Phase 1E. This placeholder keeps seller navigation stable while the upload and draft workflow is built."
      eyebrow="Seller tools"
      icon={ShoppingBag}
      primaryHref="/my-listings"
      primaryLabel="View My Listings"
    />
  );
}
