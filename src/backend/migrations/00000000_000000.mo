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

  public type OldActor = {};
  public type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    attendanceRecords : Map.Map<Nat, Attendance>;
    attendanceNextId : { var value : Nat };
  };

  public func migration(_ : OldActor) : NewActor {
    {
      accessControlState = AccessControl.initState();
      attendanceRecords = Map.empty();
      attendanceNextId = { var value = 0 };
    };
  };
};
