import type { ReminderInfo, SendOutcome } from "@/backend";

export type { ReminderInfo, SendOutcome };

/** Human-readable Spanish label for a reminder send outcome. */
export function describeSendOutcome(outcome: SendOutcome): string {
  switch (outcome.__kind__) {
    case "sent":
      return outcome.sent.recipients === 1n
        ? "Se envió el recordatorio a 1 destinatario."
        : `Se envió el recordatorio a ${outcome.sent.recipients} destinatarios.`;
    case "noRecipients":
      return "Todavía no hay números registrados para enviar el recordatorio.";
    case "failed":
      return `No se pudo enviar el recordatorio: ${outcome.failed}`;
  }
}
