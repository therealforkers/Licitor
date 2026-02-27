export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-card/40">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} Licitor</span>
        <span>Bid with confidence.</span>
      </div>
    </footer>
  );
}
