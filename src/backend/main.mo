import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import OQL "mo:caffeineai-oql";
import Expose "mo:caffeineai-oql/Expose";
import Entity "mo:caffeineai-oql/Entity";
import MapEntity "mo:caffeineai-oql/MapEntity";
import RecordValue "mo:caffeineai-oql/RecordValue";
import NatValue "mo:caffeineai-oql/NatValue";
import TextValue "mo:caffeineai-oql/TextValue";
import IntValue "mo:caffeineai-oql/IntValue";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Timer "mo:core/Timer";
import AttendanceTypes "types/attendance";
import AttendanceApi "mixins/attendance-api";
import ReminderApi "mixins/reminder-api";
import ReminderLib "lib/reminder";
import ApiDocMixin "mixins/api-doc";

actor {
  let accessControlState : AccessControl.AccessControlState;
  let attendanceRecords : Map.Map<AttendanceTypes.AttendanceId, AttendanceTypes.Attendance>;
  let attendanceNextId : { var value : AttendanceTypes.AttendanceId };
  let reminderSent : { var value : Bool };

  include MixinAuthorization(accessControlState, null);
  include AttendanceApi(attendanceRecords, attendanceNextId, accessControlState);
  include ReminderApi(attendanceRecords, reminderSent, accessControlState);
  // Data-intelligence reads of the attendance table are reserved to the
  // administrator. Controllers read every row; any other signed-in caller is
  // scoped to the rows `canSeeAttendance` admits (only the admin), and an
  // anonymous caller is denied outright.
  func canSeeAttendance(caller : Principal, _owner : OQL.Value) : Bool =
    AccessControl.isAdmin(accessControlState, caller);

  include Expose({
    entities = [
      attendanceRecords.toEntity("attendance", "Attendance", "id")
        .sample({
          id = 0;
          fullName = "";
          cedula = "";
          phone = "";
          email = "";
          municipio = "";
          parroquia = "";
          registeredAt = 0;
        })
        .ownedByWith("id", canSeeAttendance)
        .controllerOrScoped()
        .build(),
    ];
  });
  include ApiDocMixin();

  // Arm the one-shot scheduled reminder. Runs on every (re)start; the send
  // itself is guarded by `reminderSent`, so it fires at most once.
  do {
    let delayNs = ReminderLib.scheduledAt - Time.now();
    if (delayNs > 0) {
      ignore Timer.setTimer<system>(
        #nanoseconds(delayNs.toNat()),
        func() : async () {
          ignore await ReminderLib.send(attendanceRecords, reminderSent);
        },
      );
    };
  };
};
