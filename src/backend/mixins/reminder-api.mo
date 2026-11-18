import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import AttendanceTypes "../types/attendance";
import Types "../types/reminder";
import ReminderLib "../lib/reminder";

mixin (
  records : Map.Map<AttendanceTypes.AttendanceId, AttendanceTypes.Attendance>,
  sent : { var value : Bool },
  accessControlState : AccessControl.AccessControlState,
) {
  /// Read the reminder's scheduled date/time, notice text and recipient count.
  /// Administrator only.
  public query ({ caller }) func getReminderInfo() : async Types.ReminderInfo {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: only administrators can read the reminder info");
    };
    ReminderLib.info(records);
  };

  /// Trigger the reminder immediately. Administrator only.
  public shared ({ caller }) func sendReminderNow() : async Types.SendOutcome {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: only administrators can send the reminder");
    };
    await ReminderLib.send(records, sent);
  };
};
