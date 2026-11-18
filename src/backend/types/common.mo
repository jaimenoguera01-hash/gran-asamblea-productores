module {
  /// Identifier for an attendance record.
  public type AttendanceId = Nat;

  /// Timestamp in nanoseconds since the Unix epoch (signed, as returned by Time.now()).
  public type Timestamp = Int;

  /// A phone number registered in the event's attendance records.
  public type PhoneNumber = Text;
};
