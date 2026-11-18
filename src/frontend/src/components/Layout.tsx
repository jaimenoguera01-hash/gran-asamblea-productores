import { PartyLogo } from "@/components/PartyLogo";
import { useIsCallerAdmin } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import { Settings2 } from "lucide-react";
import type { ReactNode } from "react";

const NAV_LINKS = [
  { label: "Inicio", hash: "inicio" },
  { label: "Evento", hash: "evento" },
  { label: "Registro", hash: "registro" },
  { label: "Contacto", hash: "contacto" },
];

export function Layout({ children }: { children: ReactNode }) {
  const year = new Date().getFullYear();
  const { data: isAdmin } = useIsCallerAdmin();
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-white/15 bg-card/70 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-8">
          <Link
            to="/"
            hash="inicio"
            data-ocid="nav.link"
            className="flex items-center gap-3 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <PartyLogo />
            <span className="hidden h-8 w-px bg-white/25 sm:block" />
            <span className="hidden text-sm font-medium text-white/85 sm:block">
              Municipio Francisco de Miranda
            </span>
          </Link>

          <nav
            aria-label="Navegación principal"
            className="hidden items-center gap-6 md:flex"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.hash}
                to="/"
                hash={link.hash}
                data-ocid="nav.link"
                className="text-sm font-medium text-white/85 transition-smooth hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/recordatorio"
                data-ocid="nav.recordatorio_link"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/30 px-3 py-1.5 text-sm font-medium text-white/90 transition-smooth hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <Settings2 className="size-4" />
                Recordatorio
              </Link>
            )}
          </nav>

          <span
            data-ocid="nav.badge"
            className="inline-flex items-center gap-2 rounded-full bg-destructive px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-destructive-foreground shadow-subtle"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
            En vivo
          </span>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer
        id="contacto"
        className="border-t border-white/15 bg-accent/60 backdrop-blur-sm"
      >
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 md:grid-cols-3 md:px-8">
          <div className="space-y-3">
            <PartyLogo />
            <p className="text-sm text-white/80">
              Gran Asamblea de Productores — El Arroz en crisis
            </p>
          </div>
          <div className="space-y-2 text-sm text-white/80">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
              Evento
            </p>
            <p>Municipio Francisco de Miranda</p>
            <p>Estado Guárico, Venezuela</p>
            <p>Entrada libre para productores y comunidad</p>
          </div>
          <div className="space-y-2 text-sm text-white/80">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
              Contacto
            </p>
            <p>asamblea@ventevenezuela.org</p>
            <p>+58 400 000 0000</p>
          </div>
        </div>
        <div className="border-t border-white/15">
          <p className="mx-auto w-full max-w-6xl px-4 py-5 text-center text-xs text-white/70 md:px-8">
            © {year}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 transition-smooth hover:text-white"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
