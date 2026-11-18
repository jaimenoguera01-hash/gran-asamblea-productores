import type { Attendance } from "@/backend";
import { AttendanceList } from "@/components/AttendanceList";
import { Button } from "@/components/ui/button";
import { useFetchAttendance } from "@/hooks/useQueries";
import { downloadAttendanceXlsx } from "@/lib/export-attendance";
import { AlertCircle, CheckCircle2, Download, Loader2 } from "lucide-react";
import { useState } from "react";

type ExportStatus =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; count: number }
  | { kind: "empty" }
  | { kind: "error" };

export function AttendanceExport() {
  const fetchAttendance = useFetchAttendance();
  const [status, setStatus] = useState<ExportStatus>({ kind: "idle" });
  const [records, setRecords] = useState<Attendance[]>([]);

  const handleExport = async () => {
    setStatus({ kind: "loading" });
    try {
      const fetched = await fetchAttendance();
      setRecords(fetched);
      if (fetched.length === 0) {
        setStatus({ kind: "empty" });
        return;
      }
      downloadAttendanceXlsx(fetched);
      setStatus({ kind: "success", count: fetched.length });
    } catch {
      setStatus({ kind: "error" });
    }
  };

  const isLoading = status.kind === "loading";

  return (
    <div className="space-y-6">
      <div
        data-ocid="registro.export_panel"
        className="rounded-2xl border border-white/20 bg-card/60 p-6 shadow-elevated backdrop-blur-md md:p-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <h3 className="font-display text-xl font-bold tracking-tight text-white md:text-2xl">
              Lista de asistentes
            </h3>
            <p className="text-sm text-white/80">
              Descarga todos los registros guardados en una tabla de Excel.
            </p>
          </div>
          <Button
            type="button"
            onClick={handleExport}
            disabled={isLoading}
            aria-busy={isLoading}
            data-ocid="registro.export_button"
            className="h-12 shrink-0 rounded-full bg-primary px-7 text-base font-semibold text-primary-foreground shadow-elevated transition-smooth hover:-translate-y-0.5 hover:bg-primary/90 disabled:translate-y-0 disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Preparando…
              </>
            ) : (
              <>
                <Download className="size-4" />
                Descargar Excel
              </>
            )}
          </Button>
        </div>

        {status.kind === "loading" && (
          <p
            data-ocid="registro.export_loading_state"
            className="mt-4 flex items-center gap-2 text-sm font-medium text-white/85"
          >
            <Loader2 className="size-4 animate-spin" />
            Preparando la tabla de Excel…
          </p>
        )}

        {status.kind === "success" && (
          <output
            data-ocid="registro.export_success_state"
            className="mt-4 flex items-center gap-2 rounded-lg bg-success px-4 py-3 text-sm font-semibold text-success-foreground shadow-subtle"
          >
            <CheckCircle2 className="size-5" />
            {status.count === 1
              ? "Se descargó 1 registro en el archivo de Excel."
              : `Se descargaron ${status.count} registros en el archivo de Excel.`}
          </output>
        )}

        {status.kind === "empty" && (
          <p
            data-ocid="registro.export_empty_state"
            className="mt-4 rounded-lg border border-white/30 bg-white/10 px-4 py-3 text-sm font-medium text-white"
          >
            Todavía no hay registros guardados. Cuando alguien se registre
            podrás descargar la tabla de Excel.
          </p>
        )}

        {status.kind === "error" && (
          <p
            role="alert"
            data-ocid="registro.export_error_state"
            className="mt-4 flex items-center gap-2 rounded-lg border border-white/30 bg-destructive/30 px-4 py-3 text-sm font-medium text-white"
          >
            <AlertCircle className="size-5" />
            No pudimos preparar la descarga. Verifica tu conexión e inténtalo de
            nuevo.
          </p>
        )}
      </div>

      {records.length > 0 && (
        <AttendanceList records={records} title="Registros descargados" />
      )}
    </div>
  );
}
