import { LayoutDashboard } from "lucide-react";

import { PlaceholderPage } from "@/components/shared/placeholder-page";

export default function DashboardPage() {
  return (
    <PlaceholderPage
      title="My Dashboard"
      description="Seller metrics, current bids, and account activity will be assembled here in Phase 5. For now, the route resolves from the navbar without dead ends."
      eyebrow="Account overview"
      icon={LayoutDashboard}
      primaryHref="/my-listings"
      primaryLabel="Go to My Listings"
    />
  );
}
