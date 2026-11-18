import { createActor } from "@/backend";
import type {
  Attendance,
  AttendanceInput,
  ReminderInfo,
  SendOutcome,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/** All attendance registrations, newest first. */
export function useAttendanceList() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Attendance[]>({
    queryKey: ["attendance"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAttendance();
    },
    enabled: !!actor && !isFetching,
  });
}

/**
 * Fetch the latest attendance records on demand, bypassing the cached list.
 * Used by the Excel export so it always downloads the saved records even when
 * the registration form has not been opened yet.
 */
export function useFetchAttendance() {
  const { actor, isFetching } = useActor(createActor);
  const queryClient = useQueryClient();
  return async (): Promise<Attendance[]> => {
    if (!actor || isFetching) {
      throw new Error("El servicio no está disponible todavía.");
    }
    return queryClient.fetchQuery<Attendance[]>({
      queryKey: ["attendance"],
      queryFn: async () => actor.listAttendance(),
      staleTime: 0,
    });
  };
}

/** Register a new attendance record. */
export function useRegisterAttendance() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<Attendance, Error, AttendanceInput>({
    mutationFn: async (input: AttendanceInput) => {
      if (!actor) throw new Error("El servicio no está disponible todavía.");
      return actor.registerAttendance(input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}

/** Whether the signed-in caller is an administrator. */
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<boolean>({
    queryKey: ["callerIsAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

/**
 * Attendance registrations for the administration section.
 * The query only runs once the caller is confirmed as an administrator, so a
 * non-admin never triggers the admin-only backend call. Exposes loading, error
 * and retry through the returned React Query result.
 */
export function useAdminAttendanceList() {
  const { actor, isFetching } = useActor(createActor);
  const { data: isAdmin } = useIsCallerAdmin();
  return useQuery<Attendance[]>({
    queryKey: ["attendance", "admin"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAttendance();
    },
    enabled: !!actor && !isFetching && isAdmin === true,
    retry: 1,
  });
}

/** Scheduled date/time, notice text and recipient count of the reminder. */
export function useReminderInfo() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ReminderInfo>({
    queryKey: ["reminderInfo"],
    queryFn: async () => {
      if (!actor) throw new Error("El servicio no está disponible todavía.");
      return actor.getReminderInfo();
    },
    enabled: !!actor && !isFetching,
  });
}

/** Trigger the reminder immediately. Administrator only. */
export function useSendReminderNow() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<SendOutcome, Error, void>({
    mutationFn: async () => {
      if (!actor) throw new Error("El servicio no está disponible todavía.");
      return actor.sendReminderNow();
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["reminderInfo"] });
    },
  });
}
