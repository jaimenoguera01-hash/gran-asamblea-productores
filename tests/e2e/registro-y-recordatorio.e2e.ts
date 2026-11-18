// Generated from tests/e2e/specs/registro-y-recordatorio.json (spec 4a8494df167f2e28). Edit the spec, not this file.
import { test } from "@e2e-dev/web";
import type { Locator, Screen } from "e2e";
import { expect } from "e2e";

/** Steps this flow's recording found already done; strict replay skips them, as they have nothing to replay. */
const skippedSteps: readonly number[] = JSON.parse(process.env.CAFFEINE_E2E_SKIP_STEPS ?? "[]");

const recording = process.env.CAFFEINE_E2E_MODE === "record" || process.env.CAFFEINE_E2E_MODE === "heal";

/** Whether `holds` turns true within the assertion timeout. */
async function eventually(holds: () => Promise<boolean>): Promise<boolean> {
  const deadline = Date.now() + 5000;
  for (;;) {
    if (await holds()) return true;
    if (Date.now() >= deadline) return false;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
}

function flowChecks() {
  let failed = 0;
  return {
    /** Spec check `index`: a failure fails a strict replay at once and is kept otherwise. */
    async check(index: number, verify: () => Promise<void>, holds: () => Promise<boolean>): Promise<void> {
      if (!recording) return verify();
      if (failed === 0) {
        try {
          return await verify();
        } catch (error) {
          if ((error as { code?: unknown }).code !== "ASSERTION_FAILED") throw error;
        }
      } else if (await eventually(holds)) {
        return;
      }
      failed += 1;
      expect.soft(false, `check ${String(index)}`).toBe(true);
    },
  };
}

/** `text` as a case-insensitive pattern in which each run of spaces also matches none. */
function spacedText(text: string): RegExp {
  const words = text.trim().split(/\s+/).map((word) => word.replace(/[.*+?^$(){}|[\]\\]/g, "\\$&"));
  return new RegExp(words.join("\\s*"), "i");
}

/** Words the screen shows: visible text, the placeholder of an input that shows it, or a field that holds it right after the step that typed it. */
async function shownText(screen: Screen, text: string, typed = false, pattern?: RegExp): Promise<Locator> {
  const asText = screen.getByText(pattern ?? spacedText(text), { visible: true }).first();
  const field = pattern === undefined ? { exact: false, visible: true } : { exact: true, visible: true };
  const asPlaceholder = screen.getByPlaceholder(text, field).first();
  const asValue = screen.getByDisplayValue(text, field).first();
  for (let waited = 0; waited < 5000; waited += 250) {
    if (await asText.isVisible()) return asText;
    if (await asPlaceholder.isVisible()) return asPlaceholder;
    if (typed && (await asValue.isVisible())) return asValue;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  return asText;
}

test("registro-y-recordatorio", async ({ app, agent, screen }) => {
  const flow = flowChecks();
  await app.open("/");

  if (!skippedSteps.includes(0)) await agent.act("Registrar un productor con nombre Ana Pérez, cédula 12345678, teléfono 04141234567, correo ana@example.com, municipio Calabozo y parroquia Centro\nDo not do the next step yet: Abrir la página del recordatorio", { maxModelCalls: 20 });
  await flow.check(0, async () => { await expect(await shownText(screen, "Ana Pérez", true)).toBeVisible({ timeout: 15000 }); }, async () => (await shownText(screen, "Ana Pérez", true)).isVisible());

  if (!skippedSteps.includes(1)) await agent.act("Abrir la página del recordatorio\nDo not do the next step yet: Enviar el recordatorio ahora y confirmar", { maxModelCalls: 20 });
  await flow.check(1, async () => { await expect(await shownText(screen, "Recordatorio", true)).toBeVisible(); }, async () => (await shownText(screen, "Recordatorio", true)).isVisible());
  await flow.check(2, async () => { await expect(await shownText(screen, "Venezuela, Guárico y Calabozo cuentan contigo")).toBeVisible(); }, async () => (await shownText(screen, "Venezuela, Guárico y Calabozo cuentan contigo")).isVisible());
  await flow.check(3, async () => { await expect(screen.getByText(new RegExp("(?<![\\d.,+*\\u00D7xX\\u2212-])(?<!\\d[/:,])12:00(?!\\d|[-/:.,\\s\\u00D7xX*]\\d)"), { visible: true }).first()).toBeVisible(); }, async () => screen.getByText(new RegExp("(?<![\\d.,+*\\u00D7xX\\u2212-])(?<!\\d[/:,])12:00(?!\\d|[-/:.,\\s\\u00D7xX*]\\d)"), { visible: true }).first().isVisible());

  if (!skippedSteps.includes(2)) await agent.act("Enviar el recordatorio ahora y confirmar", { maxModelCalls: 20 });
  await flow.check(4, async () => { await expect(screen.getByText(new RegExp("(?<![\\d.,+*\\u00D7xX\\u2212-])(?<!\\d[/:,])1(?!\\d|[-/:.,\\s\\u00D7xX*]\\d)"), { visible: true }).first()).toBeVisible(); }, async () => screen.getByText(new RegExp("(?<![\\d.,+*\\u00D7xX\\u2212-])(?<!\\d[/:,])1(?!\\d|[-/:.,\\s\\u00D7xX*]\\d)"), { visible: true }).first().isVisible());
});
