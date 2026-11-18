import Common "../types/common";

module {
  public type Timestamp = Common.Timestamp;

  /// The reminder's fixed schedule and notice text, as read by an administrator.
  public type ReminderInfo = {
    scheduledAt : Timestamp;
    notice : Text;
    recipientCount : Nat;
  };

  /// Outcome of a reminder send attempt.
  public type SendOutcome = {
    #sent : { recipients : Nat };
    #noRecipients;
    #failed : Text;
  };
};
