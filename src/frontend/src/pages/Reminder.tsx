import type { SendOutcome } from "@/backend";
import { RequireSignIn } from "@/components/InternetIdentity";
import {
  useIsCallerAdmin,
  useReminderInfo,
  useSendReminderNow,
} from "@/hooks/useQueries";
import { describeSendOutcome } from "@/types/reminder";
import {
  AlertTriangle,
  BellRing,
  CalendarClock,
  CheckCircle2,
  Loader2,
  MessageSquareText,
  Send,
  ShieldAlert,
  Users,
} from "lucide-react";
import { useState } from "react";

/** Motoko timestamps are nanosecond bigints; convert before any Date use. */
function timestampToDate(timestamp: bigint): Date | null {
  const date = new Date(Number(timestamp / 1_000_000n));
  return Number.isNaN(date.getTime()) ? null : date;
}

const DATE_FORMATTER = new Intl.DateTimeFormat("es-VE", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const TIME_FORMATTER = new Intl.DateTimeFormat("es-VE", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

function formatScheduledAt(timestamp: bigint): string {
  const date = timestampToDate(timestamp);
  if (!date) return "Fecha por confirmar";
  const day = DATE_FORMATTER.format(date);
  const time = TIME_FORMATTER.format(date);
  return `${day.charAt(0).toUpperCase()}${day.slice(1)} · ${time}`;
}

/**
 * Reminder administration page.
 * The route and admin gate live here; the body reviews the scheduled reminder
 * and lets an administrator send it to the registered numbers.
 */
export function Reminder() {
  return (
    <RequireSignIn>
      <ReminderAdminGate />
    </RequireSignIn>
  );
}

function ReminderAdminGate() {
  const { data: isAdmin, isLoading } = useIsCallerAdmin();

  if (isLoading) {
    return (
      <output
        data-ocid="recordatorio.loading_state"
        className="mx-auto flex w-full max-w-6xl items-center gap-2 px-4 py-24 text-white/85 md:px-8"
      >
        <Loader2 className="size-5 animate-spin motion-reduce:animate-none" />
        Verificando tus permisos…
      </output>
    );
  }

  if (!isAdmin) {
    return (
      <section
        data-ocid="recordatorio.access_denied"
        className="mx-auto w-full max-w-3xl px-4 py-24 md:px-8"
      >
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/20 bg-card/60 p-10 text-center shadow-elevated backdrop-blur-md">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/25 text-white">
            <ShieldAlert className="size-7" />
          </span>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
            Acceso restringido
          </h1>
          <p className="max-w-md text-white/85">
            Esta sección es solo para administradores de la asamblea. Inicia
            sesión con una cuenta autorizada para continuar.
          </p>
        </div>
      </section>
    );
  }

  return <ReminderPanel />;
}

function ReminderPanel() {
  const {
    data: info,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useReminderInfo();
  const sendReminder = useSendReminderNow();
  const [showConfirm, setShowConfirm] = useState(false);

  const recipientCount = info ? Number(info.recipientCount) : 0;
  const hasRecipients = recipientCount > 0;
  const outcome = sendReminder.data;

  return (
    <section
      id="recordatorio"
      data-ocid="recordatorio.page"
      className="mx-auto w-full max-w-6xl px-4 py-16 md:px-8 md:py-24"
    >
      <header className="max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-widest text-white/70">
          Administración
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-white md:text-5xl">
          Recordatorio de la asamblea
        </h1>
        <p className="mt-4 text-base text-white/85 md:text-lg">
          Revisa la programación del recordatorio y envíalo a los números
          registrados.
        </p>
      </header>

      {isLoading ? (
        <ReminderSkeleton />
      ) : isError || !info ? (
        <div
          data-ocid="recordatorio.error_state"
          className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-white/20 bg-card/60 p-8 shadow-elevated backdrop-blur-md"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/25 text-white">
            <AlertTriangle className="size-6" />
          </span>
          <div>
            <h2 className="font-display text-xl font-semibold text-white">
              No pudimos cargar el recordatorio
            </h2>
            <p className="mt-1 text-white/85">
              Ocurrió un problema al consultar la programación. Intenta de
              nuevo.
            </p>
          </div>
          <button
            type="button"
            data-ocid="recordatorio.retry_button"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground transition-smooth hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-60"
          >
            {isFetching ? (
              <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />
            ) : (
              <BellRing className="size-4" />
            )}
            Reintentar
          </button>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-6">
            <article
              data-ocid="recordatorio.card"
              className="rounded-2xl border border-white/20 bg-card/60 p-6 shadow-elevated backdrop-blur-md md:p-8"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/25 text-white">
                  <CalendarClock className="size-5" />
                </span>
                <h2 className="font-display text-xl font-semibold text-white">
                  Programación
                </h2>
              </div>
              <dl className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-widest text-white/70">
                    Fecha y hora
                  </dt>
                  <dd
                    data-ocid="recordatorio.scheduled_at"
                    className="mt-1 font-display text-lg font-semibold text-white"
                  >
                    {formatScheduledAt(info.scheduledAt)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-widest text-white/70">
                    Destinatarios registrados
                  </dt>
                  <dd
                    data-ocid="recordatorio.recipient_count"
                    className="mt-1 flex items-center gap-2 font-display text-lg font-semibold text-white"
                  >
                    <Users className="size-5 text-white/80" />
                    {recipientCount}
                  </dd>
                </div>
              </dl>
            </article>

            <article
              data-ocid="recordatorio.notice_card"
              className="rounded-2xl border border-white/20 bg-card/60 p-6 shadow-elevated backdrop-blur-md md:p-8"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/25 text-white">
                  <MessageSquareText className="size-5" />
                </span>
                <h2 className="font-display text-xl font-semibold text-white">
                  Aviso del recordatorio
                </h2>
              </div>
              <blockquote
                data-ocid="recordatorio.notice_text"
                className="mt-6 border-l-4 border-primary/70 pl-5 font-display text-xl font-semibold italic leading-snug text-white md:text-2xl"
              >
                «Venezuela, Guárico y Calabozo cuentan contigo»
              </blockquote>
              <div className="mt-6">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-white/70">
                  Texto exacto del aviso
                </h3>
                <p
                  data-ocid="recordatorio.notice_full_text"
                  className="mt-2 whitespace-pre-line rounded-xl border border-white/20 bg-background/30 p-4 text-white/90"
                >
                  {info.notice}
                </p>
              </div>
              <p className="mt-4 text-white/85">
                Se enviará a los números registrados con la invitación a la
                asamblea en el lugar y la hora pautados.
              </p>
            </article>
          </div>

          <aside className="flex flex-col gap-6">
            <div
              data-ocid="recordatorio.send_panel"
              className="rounded-2xl border border-white/20 bg-card/60 p-6 shadow-elevated backdrop-blur-md md:p-8"
            >
              <h2 className="font-display text-xl font-semibold text-white">
                Enviar ahora
              </h2>
              <p className="mt-2 text-sm text-white/85">
                {hasRecipients
                  ? `Se enviará el recordatorio a ${recipientCount} ${
                      recipientCount === 1 ? "destinatario" : "destinatarios"
                    }.`
                  : "Aún no hay números registrados para enviar el recordatorio."}
              </p>

              {!showConfirm ? (
                <button
                  type="button"
                  data-ocid="recordatorio.send_button"
                  onClick={() => setShowConfirm(true)}
                  disabled={!hasRecipients || sendReminder.isPending}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground transition-smooth hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send className="size-4" />
                  Enviar recordatorio ahora
                </button>
              ) : (
                <div
                  data-ocid="recordatorio.confirm_panel"
                  className="mt-6 rounded-xl border border-white/25 bg-background/30 p-4"
                >
                  <p className="text-sm font-medium text-white">
                    ¿Confirmas el envío inmediato a {recipientCount}{" "}
                    {recipientCount === 1 ? "destinatario" : "destinatarios"}?
                  </p>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      data-ocid="recordatorio.confirm_button"
                      onClick={() => {
                        setShowConfirm(false);
                        sendReminder.mutate();
                      }}
                      disabled={sendReminder.isPending}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground transition-smooth hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-60"
                    >
                      {sendReminder.isPending ? (
                        <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />
                      ) : (
                        <Send className="size-4" />
                      )}
                      Confirmar envío
                    </button>
                    <button
                      type="button"
                      data-ocid="recordatorio.cancel_button"
                      onClick={() => setShowConfirm(false)}
                      disabled={sendReminder.isPending}
                      className="inline-flex flex-1 items-center justify-center rounded-full border border-white/40 px-5 py-2.5 font-semibold text-white transition-smooth hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-60"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {sendReminder.isPending && (
                <output
                  data-ocid="recordatorio.sending_state"
                  className="mt-4 flex items-center gap-2 text-sm text-white/85"
                >
                  <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />
                  Enviando el recordatorio…
                </output>
              )}

              {sendReminder.isError && (
                <p
                  role="alert"
                  data-ocid="recordatorio.send_error_state"
                  className="mt-4 flex items-start gap-2 rounded-xl border border-destructive/50 bg-destructive/20 p-3 text-sm text-white"
                >
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                  No se pudo enviar el recordatorio. Intenta de nuevo.
                </p>
              )}

              {outcome && !sendReminder.isPending && (
                <SendOutcomeNotice outcome={outcome} />
              )}
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}

function SendOutcomeNotice({ outcome }: { outcome: SendOutcome }) {
  if (outcome.__kind__ === "sent") {
    return (
      <output
        data-ocid="recordatorio.success_state"
        className="mt-4 flex items-start gap-2 rounded-xl border border-success/60 bg-success/25 p-3 text-sm font-medium text-white"
      >
        <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
        {describeSendOutcome(outcome)}
      </output>
    );
  }

  if (outcome.__kind__ === "noRecipients") {
    return (
      <output
        data-ocid="recordatorio.no_recipients_state"
        className="mt-4 flex items-start gap-2 rounded-xl border border-white/30 bg-background/30 p-3 text-sm text-white"
      >
        <Users className="mt-0.5 size-4 shrink-0" />
        {describeSendOutcome(outcome)}
      </output>
    );
  }

  return (
    <p
      role="alert"
      data-ocid="recordatorio.send_error_state"
      className="mt-4 flex items-start gap-2 rounded-xl border border-destructive/50 bg-destructive/20 p-3 text-sm text-white"
    >
      <AlertTriangle className="mt-0.5 size-4 shrink-0" />
      {describeSendOutcome(outcome)}
    </p>
  );
}

function ReminderSkeleton() {
  const ids = Array.from({ length: 2 }, (_, i) => `recordatorio-skeleton-${i}`);
  return (
    <div
      data-ocid="recordatorio.loading_state"
      className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]"
    >
      {ids.map((id) => (
        <div
          key={id}
          className="h-48 animate-pulse rounded-2xl border border-white/20 bg-card/40 motion-reduce:animate-none"
        />
      ))}
    </div>
  );
}
