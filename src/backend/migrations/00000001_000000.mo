import AccessControl "mo:caffeineai-authorization/access-control";
import Map "mo:core/Map";

module {
  type Attendance = {
    id : Nat;
    fullName : Text;
    cedula : Text;
    phone : Text;
    email : Text;
    municipio : Text;
    parroquia : Text;
    registeredAt : Int;
  };

  public type OldActor = {
    accessControlState : AccessControl.AccessControlState;
    attendanceRecords : Map.Map<Nat, Attendance>;
    attendanceNextId : { var value : Nat };
  };

  public type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    attendanceRecords : Map.Map<Nat, Attendance>;
    attendanceNextId : { var value : Nat };
    reminderSent : { var value : Bool };
  };

  public func migration(old : OldActor) : NewActor {
    {
      accessControlState = old.accessControlState;
      attendanceRecords = old.attendanceRecords;
      attendanceNextId = old.attendanceNextId;
      reminderSent = { var value = false };
    };
  };
};
