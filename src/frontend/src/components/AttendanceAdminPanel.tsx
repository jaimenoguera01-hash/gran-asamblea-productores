import type { Attendance } from "@/backend";
import { useAdminAttendanceList, useFetchAttendance } from "@/hooks/useQueries";
import { downloadAttendanceXlsx } from "@/lib/export-attendance";
import {
  AlertTriangle,
  Download,
  Loader2,
  RefreshCw,
  UserRound,
  Users,
} from "lucide-react";
import { useState } from "react";

const DATE_FORMATTER = new Intl.DateTimeFormat("es-VE", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** Motoko timestamps are nanosecond bigints; convert before any Date use. */
function formatRegisteredAt(timestamp: bigint): string {
  const date = new Date(Number(timestamp / 1_000_000n));
  return Number.isNaN(date.getTime())
    ? "Fecha no disponible"
    : DATE_FORMATTER.format(date);
}

/**
 * Administration panel for the attendance registrations.
 * Shows the complete list of registered attendees and lets the administrator
 * download it as an Excel file, with clear loading, error, empty and success
 * states for both the list and the export.
 */
export function AttendanceAdminPanel() {
  const {
    data: records,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useAdminAttendanceList();
  const fetchAttendance = useFetchAttendance();
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const hasRecords = !!records && records.length > 0;

  async function handleExport() {
    setIsExporting(true);
    setExportError(false);
    setExportSuccess(false);
    try {
      const latest = await fetchAttendance();
      if (latest.length === 0) {
        setExportError(true);
        return;
      }
      downloadAttendanceXlsx(latest);
      setExportSuccess(true);
    } catch {
      setExportError(true);
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div
      data-ocid="admin.attendance_panel"
      className="mt-10 rounded-2xl border border-white/20 bg-card/60 p-6 shadow-elevated backdrop-blur-md md:p-8"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
            <Users className="size-5" />
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-xl font-bold tracking-tight text-white md:text-2xl">
              Asistentes registrados
            </h2>
            <p className="text-sm text-white/80">
              {hasRecords
                ? records.length === 1
                  ? "1 persona ha confirmado su asistencia."
                  : `${records.length} personas han confirmado su asistencia.`
                : "Lista completa de registros de la asamblea."}
            </p>
          </div>
        </div>

        <button
          type="button"
          data-ocid="admin.attendance_panel.export_button"
          onClick={() => void handleExport()}
          disabled={isExporting || isLoading || isError}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground transition-smooth hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isExporting ? (
            <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />
          ) : (
            <Download className="size-4" />
          )}
          {isExporting ? "Generando Excel…" : "Descargar Excel"}
        </button>
      </div>

      {exportError && (
        <p
          role="alert"
          data-ocid="admin.attendance_panel.export_error_state"
          className="mt-4 flex items-start gap-2 rounded-xl border border-destructive/50 bg-destructive/20 p-3 text-sm text-white"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          No se pudo generar el archivo Excel. Intenta de nuevo.
        </p>
      )}

      {exportSuccess && (
        <output
          data-ocid="admin.attendance_panel.export_success_state"
          className="mt-4 flex items-start gap-2 rounded-xl border border-success/60 bg-success/25 p-3 text-sm font-medium text-white"
        >
          <Download className="mt-0.5 size-4 shrink-0" />
          El archivo asistentes-asamblea-productores.xlsx se descargó
          correctamente.
        </output>
      )}

      <div className="mt-6">
        {isLoading ? (
          <output
            data-ocid="admin.attendance_panel.loading_state"
            className="flex items-center gap-2 text-white/85"
          >
            <Loader2 className="size-5 animate-spin motion-reduce:animate-none" />
            Cargando los registros de asistencia…
          </output>
        ) : isError ? (
          <div
            data-ocid="admin.attendance_panel.error_state"
            className="flex flex-col items-start gap-4 rounded-xl border border-white/20 bg-background/30 p-6"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/25 text-white">
              <AlertTriangle className="size-6" />
            </span>
            <div>
              <h3 className="font-display text-lg font-semibold text-white">
                No pudimos cargar los registros
              </h3>
              <p className="mt-1 text-sm text-white/85">
                Ocurrió un problema al consultar la lista de asistentes. Intenta
                de nuevo.
              </p>
            </div>
            <button
              type="button"
              data-ocid="admin.attendance_panel.retry_button"
              onClick={() => void refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-semibold text-primary-foreground transition-smooth hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-60"
            >
              {isFetching ? (
                <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />
              ) : (
                <RefreshCw className="size-4" />
              )}
              Reintentar
            </button>
          </div>
        ) : hasRecords ? (
          <ul
            data-ocid="admin.attendance_panel.list"
            className="grid gap-3 lg:grid-cols-2"
          >
            {records.map((record, index) => (
              <AttendanceRow
                key={record.id.toString()}
                record={record}
                position={index + 1}
              />
            ))}
          </ul>
        ) : (
          <div
            data-ocid="admin.attendance_panel.empty_state"
            className="flex flex-col items-center gap-3 rounded-xl border border-white/20 bg-background/30 p-10 text-center"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary">
              <UserRound className="size-6" />
            </span>
            <h3 className="font-display text-lg font-semibold text-white">
              Todavía no hay asistentes registrados
            </h3>
            <p className="max-w-md text-sm text-white/85">
              Cuando las personas confirmen su asistencia desde la página
              pública, aparecerán aquí y podrás descargarlas en Excel.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function AttendanceRow({
  record,
  position,
}: {
  record: Attendance;
  position: number;
}) {
  return (
    <li
      data-ocid={`admin.attendance_panel.item.${position}`}
      className="rounded-xl border border-white/15 bg-white/10 p-4"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/25 font-mono text-xs font-semibold text-white">
          {position}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-base font-semibold text-white">
            {record.fullName}
          </p>
          <p className="mt-0.5 font-mono text-xs text-white/75">
            V-{record.cedula}
          </p>
          <dl className="mt-3 grid gap-x-4 gap-y-1.5 text-sm sm:grid-cols-2">
            <div className="flex min-w-0 gap-1.5">
              <dt className="shrink-0 text-white/60">Teléfono:</dt>
              <dd className="min-w-0 truncate text-white/90">{record.phone}</dd>
            </div>
            <div className="flex min-w-0 gap-1.5">
              <dt className="shrink-0 text-white/60">Email:</dt>
              <dd className="min-w-0 truncate text-white/90">{record.email}</dd>
            </div>
            <div className="flex min-w-0 gap-1.5">
              <dt className="shrink-0 text-white/60">Municipio:</dt>
              <dd className="min-w-0 truncate text-white/90">
                {record.municipio}
              </dd>
            </div>
            <div className="flex min-w-0 gap-1.5">
              <dt className="shrink-0 text-white/60">Parroquia:</dt>
              <dd className="min-w-0 truncate text-white/90">
                {record.parroquia}
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-white/60">
            Registrado el {formatRegisteredAt(record.registeredAt)}
          </p>
        </div>
      </div>
    </li>
  );
}
