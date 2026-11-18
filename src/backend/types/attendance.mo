import Common "../types/common";

module {
  public type AttendanceId = Common.AttendanceId;
  public type Timestamp = Common.Timestamp;

  /// A single attendance registration for the event.
  public type Attendance = {
    id : AttendanceId;
    fullName : Text;
    cedula : Text;
    phone : Text;
    email : Text;
    municipio : Text;
    parroquia : Text;
    registeredAt : Timestamp;
  };

  /// Input payload supplied by the registration form.
  public type AttendanceInput = {
    fullName : Text;
    cedula : Text;
    phone : Text;
    email : Text;
    municipio : Text;
    parroquia : Text;
  };
};
