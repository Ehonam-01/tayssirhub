export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-4 py-12 dark:bg-background">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary font-heading text-lg font-semibold text-primary-foreground">
            O
          </span>
          <h1 className="font-heading text-lg font-semibold">Oumra CRM</h1>
          <p className="text-sm text-muted-foreground">
            La plateforme des agences de Hajj &amp; Oumra
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
