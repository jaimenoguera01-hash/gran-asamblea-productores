import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegisterAttendance } from "@/hooks/useQueries";
import {
  type AttendanceDraft,
  type AttendanceErrors,
  type AttendanceField,
  EMPTY_DRAFT,
  draftToInput,
  validateDraft,
} from "@/types/attendance";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";

interface FieldConfig {
  name: AttendanceField;
  label: string;
  placeholder: string;
  type: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
  autoComplete?: string;
  prefix?: string;
  mono?: boolean;
}

const FIELDS: FieldConfig[] = [
  {
    name: "fullName",
    label: "Nombre y apellido",
    placeholder: "María Rodríguez",
    type: "text",
    autoComplete: "name",
  },
  {
    name: "cedula",
    label: "Cédula de identidad",
    placeholder: "12345678",
    type: "text",
    inputMode: "numeric",
    prefix: "V-",
    mono: true,
  },
  {
    name: "phone",
    label: "Teléfono",
    placeholder: "04141234567",
    type: "tel",
    inputMode: "tel",
    autoComplete: "tel",
    mono: true,
  },
  {
    name: "email",
    label: "Email",
    placeholder: "correo@ejemplo.com",
    type: "email",
    inputMode: "email",
    autoComplete: "email",
  },
  {
    name: "municipio",
    label: "Municipio",
    placeholder: "Francisco de Miranda",
    type: "text",
  },
  {
    name: "parroquia",
    label: "Parroquia",
    placeholder: "Calabozo",
    type: "text",
  },
];

export function RegistrationForm() {
  const [draft, setDraft] = useState<AttendanceDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<AttendanceErrors>({});
  const [success, setSuccess] = useState(false);
  const register = useRegisterAttendance();

  const setField = (field: AttendanceField, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    if (success) setSuccess(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateDraft(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setSuccess(false);
      return;
    }

    const payload = draftToInput(draft);
    setDraft(EMPTY_DRAFT);
    setSuccess(false);
    register.mutate(payload, {
      onSuccess: () => setSuccess(true),
      onError: () => {
        setDraft((current) =>
          current.fullName === "" && current.cedula === "" ? payload : current,
        );
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      data-ocid="registro.panel"
      className="rounded-2xl border border-white/20 bg-card/60 p-6 shadow-elevated backdrop-blur-md md:p-8"
    >
      <div className="space-y-1.5">
        <h2 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
          Formulario de Registro
        </h2>
        <p className="text-sm text-white/80">
          Por favor, completa tus datos para confirmar asistencia.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {FIELDS.map((field) => {
          const error = errors[field.name];
          const errorId = `${field.name}-error`;
          return (
            <div key={field.name} className="space-y-1.5">
              <Label
                htmlFor={field.name}
                className="text-xs font-semibold uppercase tracking-widest text-white/85"
              >
                {field.label}
              </Label>
              <div className="relative">
                {field.prefix && (
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-white/70">
                    {field.prefix}
                  </span>
                )}
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  inputMode={field.inputMode}
                  autoComplete={field.autoComplete}
                  placeholder={field.placeholder}
                  value={draft[field.name]}
                  onChange={(event) => setField(field.name, event.target.value)}
                  aria-invalid={!!error}
                  aria-describedby={error ? errorId : undefined}
                  data-ocid={`registro.${field.name}.input`}
                  className={`h-11 border-white/30 bg-white/10 text-white placeholder:text-white/50 focus-visible:border-white focus-visible:ring-white/40 ${
                    field.prefix ? "pl-9" : ""
                  } ${field.mono ? "font-mono" : ""}`}
                />
              </div>
              {error && (
                <p
                  id={errorId}
                  role="alert"
                  data-ocid={`registro.${field.name}.error`}
                  className="text-xs font-medium text-white"
                >
                  {error}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button
          type="submit"
          disabled={register.isPending}
          data-ocid="registro.submit_button"
          className="h-12 flex-1 rounded-full bg-primary px-7 text-base font-semibold text-primary-foreground shadow-elevated transition-smooth hover:-translate-y-0.5 hover:bg-primary/90"
        >
          {register.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Guardando…
            </>
          ) : (
            "Guardar"
          )}
        </Button>
      </div>

      {register.isError && (
        <p
          role="alert"
          data-ocid="registro.error_state"
          className="mt-4 rounded-lg border border-white/30 bg-destructive/30 px-4 py-3 text-sm font-medium text-white"
        >
          No pudimos guardar tu registro. Verifica tu conexión e inténtalo de
          nuevo.
        </p>
      )}

      {success && (
        <output
          data-ocid="registro.success_state"
          className="mt-4 flex items-center gap-2 rounded-lg bg-success px-4 py-3 text-sm font-semibold text-success-foreground shadow-subtle"
        >
          <CheckCircle2 className="size-5" />
          Registro exitoso
        </output>
      )}
    </form>
  );
}
