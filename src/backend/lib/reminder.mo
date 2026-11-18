import Map "mo:core/Map";
import Set "mo:core/Set";
import EmailClient "mo:caffeineai-email/emailClient";
import AttendanceTypes "../types/attendance";
import Types "../types/reminder";

module {
  public type ReminderInfo = Types.ReminderInfo;
  public type SendOutcome = Types.SendOutcome;

  /// The reminder's fixed schedule: 27 November 2026, 12:00 noon Venezuela
  /// time (UTC-4), expressed as nanoseconds since the Unix epoch.
  public let scheduledAt : Types.Timestamp = 1_764_259_200_000_000_000;

  /// The exact notice text delivered to every registered recipient.
  public let notice : Text = "Venezuela, Guárico y Calabozo cuentan contigo. Asiste hoy a la asamblea de productores en el Hotel Giardini, Salón de Reuniones, el 27 de noviembre de 2026 a las 12:00 del mediodía.";

  /// The subject line of the reminder email.
  let subject : Text = "Recordatorio: Asamblea de Productores — 27 de noviembre de 2026";

  /// Collect the distinct, non-empty phone numbers of every attendance
  /// record that has a registered phone number. Deduplicated by phone number,
  /// so a record with a phone but no email is still reached.
  func recipients(
    records : Map.Map<AttendanceTypes.AttendanceId, AttendanceTypes.Attendance>,
  ) : [Text] {
    let seen = Set.empty<Text>();
    for (record in records.values()) {
      if (record.phone != "") {
        seen.add(record.phone);
      };
    };
    seen.toArray();
  };

  /// Return the reminder's schedule, notice text and current recipient count.
  public func info(
    records : Map.Map<AttendanceTypes.AttendanceId, AttendanceTypes.Attendance>,
  ) : ReminderInfo {
    {
      scheduledAt;
      notice;
      recipientCount = recipients(records).size();
    };
  };

  /// Send the reminder once to every distinct registered recipient.
  public func send(
    records : Map.Map<AttendanceTypes.AttendanceId, AttendanceTypes.Attendance>,
    sent : { var value : Bool },
  ) : async SendOutcome {
    if (sent.value) {
      return #failed("El recordatorio ya fue enviado.");
    };
    let addresses = recipients(records);
    if (addresses.size() == 0) {
      return #noRecipients;
    };
    let result = await EmailClient.sendServiceEmail(
      "no-reply",
      addresses,
      subject,
      notice,
    );
    switch (result) {
      case (#ok) {
        sent.value := true;
        #sent({ recipients = addresses.size() });
      };
      case (#err(error)) {
        #failed(error);
      };
    };
  };
};
