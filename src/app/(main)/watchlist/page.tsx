import { WalletCards } from "lucide-react";

import { PlaceholderPage } from "@/components/shared/placeholder-page";

export default function WatchlistPage() {
  return (
    <PlaceholderPage
      title="My Watchlist"
      description="Tracked items, saved lots, and bidder shortcuts will live here in a later phase. The route is in place now so navigation works cleanly from the avatar menu."
      eyebrow="Buyer tools"
      icon={WalletCards}
      primaryHref="/dashboard"
      primaryLabel="Open Dashboard"
    />
  );
}
