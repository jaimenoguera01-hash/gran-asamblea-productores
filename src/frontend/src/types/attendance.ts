import type { Attendance, AttendanceInput } from "@/backend";

export type { Attendance, AttendanceInput };

/** Editable draft for the registration form. */
export interface AttendanceDraft {
  fullName: string;
  cedula: string;
  phone: string;
  email: string;
  municipio: string;
  parroquia: string;
}

export const EMPTY_DRAFT: AttendanceDraft = {
  fullName: "",
  cedula: "",
  phone: "",
  email: "",
  municipio: "",
  parroquia: "",
};

export type AttendanceField = keyof AttendanceDraft;

export type AttendanceErrors = Partial<Record<AttendanceField, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CEDULA_RE = /^\d{6,9}$/;
const PHONE_RE = /^\d{7,11}$/;

/** Validate the draft and return per-field Spanish error messages. */
export function validateDraft(draft: AttendanceDraft): AttendanceErrors {
  const errors: AttendanceErrors = {};

  if (!draft.fullName.trim()) {
    errors.fullName = "Ingresa tu nombre y apellido.";
  } else if (draft.fullName.trim().length < 3) {
    errors.fullName = "El nombre debe tener al menos 3 caracteres.";
  }

  if (!draft.cedula.trim()) {
    errors.cedula = "Ingresa tu cédula de identidad.";
  } else if (!CEDULA_RE.test(draft.cedula.trim())) {
    errors.cedula = "La cédula debe tener entre 6 y 9 dígitos.";
  }

  if (!draft.phone.trim()) {
    errors.phone = "Ingresa tu número de teléfono.";
  } else if (!PHONE_RE.test(draft.phone.trim())) {
    errors.phone = "El teléfono debe tener entre 7 y 11 dígitos.";
  }

  if (!draft.email.trim()) {
    errors.email = "Ingresa tu correo electrónico.";
  } else if (!EMAIL_RE.test(draft.email.trim())) {
    errors.email = "Ingresa un correo electrónico válido.";
  }

  if (!draft.municipio.trim()) {
    errors.municipio = "Indica tu municipio.";
  }

  if (!draft.parroquia.trim()) {
    errors.parroquia = "Indica tu parroquia.";
  }

  return errors;
}

/** Convert a validated draft into the backend input shape. */
export function draftToInput(draft: AttendanceDraft): AttendanceInput {
  return {
    fullName: draft.fullName.trim(),
    cedula: draft.cedula.trim(),
    phone: draft.phone.trim(),
    email: draft.email.trim(),
    municipio: draft.municipio.trim(),
    parroquia: draft.parroquia.trim(),
  };
}
