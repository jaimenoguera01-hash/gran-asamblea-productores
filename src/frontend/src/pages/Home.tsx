import { RegistrationForm } from "@/components/RegistrationForm";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Sprout } from "lucide-react";

const HERO_IMAGE = "/assets/generated/maria-corina-tractor.dim_1200x1000.jpg";

const EVENT_FACTS = [
  { icon: CalendarDays, label: "Fecha", value: "27 Noviembre 2026 4PM" },
  { icon: MapPin, label: "Lugar", value: "Hotel Giardini Salón de Reuniones" },
  { icon: Sprout, label: "Tema", value: "El Arroz en crisis" },
];

export function Home() {
  return (
    <div id="inicio">
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-glow"
        />
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:gap-14 md:px-8 md:py-24">
          <div className="animate-fade-up space-y-6">
            <span
              data-ocid="hero.badge"
              className="inline-flex rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white"
            >
              Vente Venezuela Municipio Francisco de Miranda te invita
            </span>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-white text-balance md:text-6xl">
              Gran Asamblea de Productores
            </h1>
            <p className="font-display text-3xl font-bold tracking-tight text-primary md:text-5xl">
              El Arroz en crisis
            </p>
            <p className="max-w-xl text-base text-white/85 md:text-lg">
              Acompáñanos a discutir el futuro del sector productivo y las
              soluciones necesarias para nuestra región.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                asChild
                className="h-12 rounded-full bg-primary px-7 text-base font-semibold text-primary-foreground shadow-elevated transition-smooth hover:-translate-y-0.5 hover:bg-primary/90"
              >
                <a href="#registro" data-ocid="hero.primary_button">
                  Registrar asistencia
                </a>
              </Button>
              <Button
                asChild
                className="h-12 rounded-full border border-white/40 bg-transparent px-7 text-base font-semibold text-white transition-smooth hover:-translate-y-0.5 hover:bg-white/10"
              >
                <a href="#evento" data-ocid="hero.secondary_button">
                  Conocer el evento
                </a>
              </Button>
            </div>
          </div>

          <div className="animate-fade-up [animation-delay:120ms]">
            <div className="animate-float overflow-hidden rounded-2xl border border-white/25 shadow-glow">
              <img
                src={HERO_IMAGE}
                alt="María Corina Machado sonriente conduciendo un tractor naranja entre un sembradío de maíz al atardecer"
                width={1200}
                height={1000}
                loading="eager"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="evento"
        className="border-y border-white/15 bg-card/40 backdrop-blur-sm"
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-16 md:px-8 md:py-24">
          <div className="grid gap-10 md:grid-cols-[1.1fr_1fr] md:gap-14">
            <div className="space-y-5">
              <span className="text-xs font-semibold uppercase tracking-widest text-white/70">
                Sobre la asamblea
              </span>
              <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-5xl">
                El campo venezolano merece respuestas
              </h2>
              <p className="text-base text-white/85 md:text-lg">
                Productores, técnicos y comunidades del municipio Francisco de
                Miranda se reúnen para analizar la crisis del arroz y construir
                juntos una ruta productiva para nuestra región.
              </p>
              <p className="text-base text-white/85 md:text-lg">
                Tu voz es parte de la solución. Confirma tu asistencia y
                acompáñanos en esta jornada de trabajo por el futuro del sector
                agrícola.
              </p>
            </div>

            <dl className="grid gap-4 self-start">
              {EVENT_FACTS.map((fact) => (
                <div
                  key={fact.label}
                  className="flex items-center gap-4 rounded-2xl border border-white/20 bg-card/60 p-5 shadow-elevated backdrop-blur-md"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <fact.icon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-xs font-semibold uppercase tracking-widest text-white/70">
                      {fact.label}
                    </dt>
                    <dd className="truncate text-base font-medium text-white">
                      {fact.value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section
        id="registro"
        className="mx-auto w-full max-w-6xl px-4 py-16 md:px-8 md:py-24"
      >
        <div className="grid items-start gap-10 md:grid-cols-[1fr_1.05fr] md:gap-14">
          <div className="space-y-5 md:sticky md:top-28">
            <span className="text-xs font-semibold uppercase tracking-widest text-white/70">
              Confirma tu asistencia
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-5xl">
              Registra tu participación
            </h2>
            <p className="text-base text-white/85 md:text-lg">
              Completa el formulario y guarda tu registro. Tu confirmación nos
              ayuda a preparar la asamblea para todos los productores.
            </p>
            <div className="overflow-hidden rounded-2xl border border-white/25 shadow-glow">
              <img
                src={HERO_IMAGE}
                alt="Productora conduciendo un tractor naranja en un sembradío de maíz"
                width={1200}
                height={1000}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            <RegistrationForm />
          </div>
        </div>
      </section>
    </div>
  );
}
