import type { Attendance } from "@/backend";
import * as XLSX from "xlsx";

const HEADERS = [
  "Nombre y apellido",
  "Cédula de identidad",
  "Teléfono",
  "Email",
  "Municipio",
  "Parroquia",
  "Fecha de registro",
] as const;

const DATE_FORMATTER = new Intl.DateTimeFormat("es-VE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

/** Motoko timestamps are nanosecond bigints; convert before any Date use. */
function formatRegisteredAt(timestamp: bigint): string {
  const date = new Date(Number(timestamp / 1_000_000n));
  return Number.isNaN(date.getTime())
    ? "Fecha no disponible"
    : DATE_FORMATTER.format(date);
}

/** Build and download an .xlsx table of every saved attendance record. */
export function downloadAttendanceXlsx(records: Attendance[]): void {
  const rows = records.map((record) => [
    record.fullName,
    `V-${record.cedula}`,
    record.phone,
    record.email,
    record.municipio,
    record.parroquia,
    formatRegisteredAt(record.registeredAt),
  ]);

  const worksheet = XLSX.utils.aoa_to_sheet([[...HEADERS], ...rows]);
  worksheet["!cols"] = [
    { wch: 28 },
    { wch: 18 },
    { wch: 16 },
    { wch: 30 },
    { wch: 22 },
    { wch: 22 },
    { wch: 18 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Asistentes");
  XLSX.writeFile(workbook, "asistentes-asamblea-productores.xlsx");
}
