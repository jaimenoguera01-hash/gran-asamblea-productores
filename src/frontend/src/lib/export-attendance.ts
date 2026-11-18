import type { Attendance } from "@/backend";
import * as XLSX from "xlsx";

const HEADERS = [
  "Nombre y apellido",
  "Cédula de identidad",
  "Teléfono",
  "Email",
  "Municipio",
  "Parroquia",
] as const;

/** Build and download an .xlsx table of every saved attendance record. */
export function downloadAttendanceXlsx(records: Attendance[]): void {
  const rows = records.map((record) => [
    record.fullName,
    `V-${record.cedula}`,
    record.phone,
    record.email,
    record.municipio,
    record.parroquia,
  ]);

  const worksheet = XLSX.utils.aoa_to_sheet([[...HEADERS], ...rows]);
  worksheet["!cols"] = [
    { wch: 28 },
    { wch: 18 },
    { wch: 16 },
    { wch: 30 },
    { wch: 22 },
    { wch: 22 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Asistentes");
  XLSX.writeFile(workbook, "asistentes-asamblea-productores.xlsx");
}
