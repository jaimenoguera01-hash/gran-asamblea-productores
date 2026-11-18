import Map "mo:core/Map";
import Types "../types/attendance";
import AttendanceLib "../lib/attendance";

mixin (
  records : Map.Map<Types.AttendanceId, Types.Attendance>,
  nextId : { var value : Types.AttendanceId },
) {
  /// Register attendance for the event. Open to any visitor, no sign-in required.
  public shared func registerAttendance(input : Types.AttendanceInput) : async Types.Attendance {
    AttendanceLib.register(records, nextId, input);
  };

  /// Return all attendance registrations so the page can export them as a table.
  public query func listAttendance() : async [Types.Attendance] {
    AttendanceLib.listAll(records);
  };
};
