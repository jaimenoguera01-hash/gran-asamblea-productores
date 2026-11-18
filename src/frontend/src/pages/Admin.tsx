import { AttendanceAdminPanel } from "@/components/AttendanceAdminPanel";
import { AdminGate } from "@/components/InternetIdentity";

/**
 * Administration section.
 * The route and the reusable protected access live here; the body lists the
 * attendance registrations for the administrator and offers the Excel export.
 */
export function Admin() {
  return (
    <AdminGate>
      <AdminPanel />
    </AdminGate>
  );
}

function AdminPanel() {
  return (
    <section
      id="administracion"
      data-ocid="admin.page"
      className="mx-auto w-full max-w-6xl px-4 py-16 md:px-8 md:py-24"
    >
      <header className="max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-widest text-white/70">
          Administración
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-white md:text-5xl">
          Panel de administración
        </h1>
        <p className="mt-4 text-base text-white/85 md:text-lg">
          Consulta los registros de asistencia guardados en el sistema y
          descárgalos en Excel.
        </p>
      </header>

      <AttendanceAdminPanel />
    </section>
  );
}
