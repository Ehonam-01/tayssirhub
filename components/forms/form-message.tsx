import type { ActionState } from "@/lib/actions/types";

export function FormMessage({ state }: { state: ActionState }) {
  if (!state) return null;

  if (state.error) {
    return (
      <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
        {state.error}
      </p>
    );
  }

  if (state.message) {
    return (
      <p className="rounded-lg bg-accent px-3 py-2 text-sm text-accent-foreground">
        {state.message}
      </p>
    );
  }

  return null;
}
