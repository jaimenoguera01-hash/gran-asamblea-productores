import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import Types "../types/attendance";

mixin (
  records : Map.Map<Types.AttendanceId, Types.Attendance>,
  nextId : { var value : Types.AttendanceId },
  accessControlState : AccessControl.AccessControlState,
) {
  /// Register attendance for the event. Open to any visitor, no sign-in required.
  public shared func registerAttendance(input : Types.AttendanceInput) : async Types.Attendance {
    let id = nextId.value;
    nextId.value := id + 1;
    let record : Types.Attendance = {
      id;
      fullName = input.fullName;
      cedula = input.cedula;
      phone = input.phone;
      email = input.email;
      municipio = input.municipio;
      parroquia = input.parroquia;
      registeredAt = Time.now();
    };
    records.add(id, record);
    record;
  };

  /// Return all attendance registrations. Administrator only.
  public query ({ caller }) func listAttendance() : async [Types.Attendance] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: only administrators can read the attendance list");
    };
    records.values().toArray();
  };
};
