import Map "mo:core/Map";
import Time "mo:core/Time";
import Types "../types/attendance";

module {
  public type Attendance = Types.Attendance;
  public type AttendanceId = Types.AttendanceId;
  public type AttendanceInput = Types.AttendanceInput;

  /// Persist a new attendance registration and return the stored record.
  public func register(
    records : Map.Map<AttendanceId, Attendance>,
    nextId : { var value : AttendanceId },
    input : AttendanceInput,
  ) : Attendance {
    let id = nextId.value;
    nextId.value := id + 1;
    let record : Attendance = {
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

  /// Return every stored attendance registration, ordered by registration time.
  public func listAll(records : Map.Map<AttendanceId, Attendance>) : [Attendance] {
    let all = records.values().toArray();
    all.sort(func(a, b) = Int.compare(a.registeredAt, b.registeredAt));
  };
};
