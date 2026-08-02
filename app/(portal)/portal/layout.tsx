export const dynamic = "force-dynamic";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-secondary/30 dark:bg-background">
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary font-heading text-sm font-semibold text-primary-foreground">
          O
        </span>
        <span className="font-heading text-sm font-semibold">Portail pèlerin</span>
      </header>
      <main className="flex flex-1 flex-col items-center px-4 py-10">
        <div className="w-full max-w-2xl">{children}</div>
      </main>
    </div>
  );
}
