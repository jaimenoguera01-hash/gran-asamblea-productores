import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Attendance {
    id: AttendanceId;
    municipio: string;
    parroquia: string;
    fullName: string;
    email: string;
    phone: string;
    registeredAt: Timestamp;
    cedula: string;
}
export type AttendanceId = bigint;
export interface AttendanceInput {
    municipio: string;
    parroquia: string;
    fullName: string;
    email: string;
    phone: string;
    cedula: string;
}
export interface Cell {
    value: Value;
    name: string;
}
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export interface ReminderInfo {
    notice: string;
    recipientCount: bigint;
    scheduledAt: Timestamp;
}
export interface Result {
    hasMore: boolean;
    rows: Array<Array<Cell>>;
}
export type Result__1 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export type SendOutcome = {
    __kind__: "sent";
    sent: {
        recipients: bigint;
    };
} | {
    __kind__: "noRecipients";
    noRecipients: null;
} | {
    __kind__: "failed";
    failed: string;
};
export type Timestamp = bigint;
export type Value = {
    __kind__: "int";
    int: bigint;
} | {
    __kind__: "nat";
    nat: bigint;
} | {
    __kind__: "float";
    float: number;
} | {
    __kind__: "bool";
    bool: boolean;
} | {
    __kind__: "null";
    null: null;
} | {
    __kind__: "text";
    text: string;
};
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    execute(qJson: string): Promise<Result>;
    getApiDoc(): Promise<string>;
    getCallerUserRole(): Promise<UserRole>;
    /**
     * / Read the reminder's scheduled date/time, notice text and recipient count.
     * / Administrator only.
     */
    getReminderInfo(): Promise<ReminderInfo>;
    isCallerAdmin(): Promise<boolean>;
    /**
     * / Return all attendance registrations so the page can export them as a table.
     */
    listAttendance(): Promise<Array<Attendance>>;
    /**
     * / Register attendance for the event. Open to any visitor, no sign-in required.
     */
    registerAttendance(input: AttendanceInput): Promise<Attendance>;
    schema(): Promise<string>;
    /**
     * / Trigger the reminder immediately. Administrator only.
     */
    sendReminderNow(): Promise<SendOutcome>;
}
