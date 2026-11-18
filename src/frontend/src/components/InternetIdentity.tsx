import { useIsCallerAdmin } from "@/hooks/useQueries";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { Loader2, ShieldAlert } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";

export function SignInButton({ className }: { className?: string }) {
  const { identity, login, clear, isInitializing, isLoggingIn, isLoginError } =
    useInternetIdentity();
  const queryClient = useQueryClient();
  const authenticated = !!identity && !identity.getPrincipal().isAnonymous();
  let label = authenticated ? "Sign out" : "Sign in with Internet Identity";
  if (isInitializing) {
    label = "Loading sign-in…";
  } else if (isLoggingIn) {
    label = "Signing in…";
  }
  return (
    <div>
      <button
        type="button"
        data-ocid="auth.button"
        className={className}
        disabled={isInitializing || isLoggingIn}
        onClick={() => {
          if (authenticated) {
            void queryClient.cancelQueries();
            queryClient.clear();
            clear();
          } else {
            // Keep the popup inside the user's activation frame: no await before login.
            login();
          }
        }}
      >
        {label}
      </button>
      {isLoginError && (
        <p role="alert" data-ocid="auth.error_state">
          Sign-in did not complete. Please try again.
        </p>
      )}
    </div>
  );
}

/** Each signed-in principal gets its own mounted cache boundary. */
function PrivateQueryBoundary({ children }: { children: ReactNode }) {
  const [queries] = useState(() => new QueryClient());
  useEffect(
    () => () => {
      void queries.cancelQueries();
      queries.clear();
    },
    [queries],
  );
  return <QueryClientProvider client={queries}>{children}</QueryClientProvider>;
}

/** Mount private queries only after sign-in, and isolate their cache when the principal changes. */
export function RequireSignIn({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { identity, isInitializing, isLoggingIn } = useInternetIdentity();
  const principal =
    identity && !identity.getPrincipal().isAnonymous()
      ? identity.getPrincipal().toText()
      : undefined;
  if (isInitializing || isLoggingIn) {
    return (
      <output data-ocid="auth.loading_state">Loading your session…</output>
    );
  }
  if (principal === undefined) {
    return <>{fallback ?? <SignInButton />}</>;
  }
  return (
    <PrivateQueryBoundary key={principal}>{children}</PrivateQueryBoundary>
  );
}

/** Complete first-generation private-app entry point: branded copy cannot remove the sign-in action. */
export function AuthenticatedApp({
  children,
  title = "Sign in to continue",
  description = "Sign in with Internet Identity to access your private workspace.",
  className,
  buttonClassName,
}: {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  buttonClassName?: string;
}) {
  return (
    <RequireSignIn
      fallback={
        <section
          aria-label="Sign in"
          data-ocid="auth.panel"
          className={
            className ??
            "flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-6 text-center text-foreground"
          }
        >
          <h1 className="font-display text-3xl font-semibold">{title}</h1>
          {description && (
            <p className="max-w-md text-muted-foreground">{description}</p>
          )}
          <SignInButton
            className={
              buttonClassName ??
              "rounded-md bg-primary px-5 py-3 font-medium text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60"
            }
          />
        </section>
      }
    >
      {children}
    </RequireSignIn>
  );
}

/**
 * Reusable protected access for administrator-only sections.
 * While the role is verified it shows a loading state, an unauthenticated
 * visitor is asked to sign in, and a signed-in non-administrator sees a
 * restricted-access notice. Only administrators reach `children`.
 */
export function AdminGate({
  children,
  loadingLabel = "Verificando tus permisos…",
  deniedTitle = "Acceso restringido",
  deniedDescription = "Esta sección es solo para administradores de la asamblea. Inicia sesión con una cuenta autorizada para continuar.",
}: {
  children: ReactNode;
  loadingLabel?: string;
  deniedTitle?: string;
  deniedDescription?: string;
}) {
  return (
    <RequireSignIn>
      <AdminRoleGate
        loadingLabel={loadingLabel}
        deniedTitle={deniedTitle}
        deniedDescription={deniedDescription}
      >
        {children}
      </AdminRoleGate>
    </RequireSignIn>
  );
}

function AdminRoleGate({
  children,
  loadingLabel,
  deniedTitle,
  deniedDescription,
}: {
  children: ReactNode;
  loadingLabel: string;
  deniedTitle: string;
  deniedDescription: string;
}) {
  const { data: isAdmin, isLoading } = useIsCallerAdmin();

  if (isLoading) {
    return (
      <output
        data-ocid="admin.loading_state"
        className="mx-auto flex w-full max-w-6xl items-center gap-2 px-4 py-24 text-white/85 md:px-8"
      >
        <Loader2 className="size-5 animate-spin motion-reduce:animate-none" />
        {loadingLabel}
      </output>
    );
  }

  if (!isAdmin) {
    return (
      <section
        data-ocid="admin.access_denied"
        className="mx-auto w-full max-w-3xl px-4 py-24 md:px-8"
      >
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/20 bg-card/60 p-10 text-center shadow-elevated backdrop-blur-md">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/25 text-white">
            <ShieldAlert className="size-7" />
          </span>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
            {deniedTitle}
          </h1>
          <p className="max-w-md text-white/85">{deniedDescription}</p>
        </div>
      </section>
    );
  }

  return <>{children}</>;
}
