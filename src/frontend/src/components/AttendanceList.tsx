import type { Attendance } from "@/backend";
import { Users } from "lucide-react";

interface AttendanceListProps {
  records: Attendance[];
  /** Optional heading override for the list panel. */
  title?: string;
}

/**
 * Visible list of the attendance records already saved in the backend, showing
 * each attendee's name and surname so the page proves the registrations stuck.
 */
export function AttendanceList({
  records,
  title = "Asistentes registrados",
}: AttendanceListProps) {
  return (
    <div
      data-ocid="registro.attendance_list"
      className="rounded-2xl border border-white/20 bg-card/60 p-6 shadow-elevated backdrop-blur-md md:p-8"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
          <Users className="size-5" />
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-xl font-bold tracking-tight text-white md:text-2xl">
            {title}
          </h3>
          <p className="text-sm text-white/80">
            {records.length === 1
              ? "1 persona ha confirmado su asistencia."
              : `${records.length} personas han confirmado su asistencia.`}
          </p>
        </div>
      </div>

      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
        {records.map((record, index) => (
          <li
            key={record.id.toString()}
            data-ocid={`registro.attendance_list.item.${index + 1}`}
            className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-4 py-3"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/25 font-mono text-xs font-semibold text-white">
              {index + 1}
            </span>
            <span className="min-w-0 truncate text-sm font-medium text-white">
              {record.fullName}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
