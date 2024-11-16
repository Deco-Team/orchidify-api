export declare enum UserSide {
    LEARNER = "LEARNER",
    INSTRUCTOR = "INSTRUCTOR",
    MANAGEMENT = "MANAGEMENT"
}
export declare enum UserRole {
    LEARNER = "LEARNER",
    INSTRUCTOR = "INSTRUCTOR",
    ADMIN = "ADMIN",
    STAFF = "STAFF",
    GARDEN_MANAGER = "GARDEN_MANAGER"
}
export declare enum TimesheetType {
    MONTH = "MONTH",
    WEEK = "WEEK"
}
export declare enum LearnerStatus {
    UNVERIFIED = "UNVERIFIED",
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}
export declare enum InstructorStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}
export declare enum StaffStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}
export declare enum GardenManagerStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}
export declare enum GardenStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}
export declare enum RecruitmentStatus {
    PENDING = "PENDING",
    INTERVIEWING = "INTERVIEWING",
    SELECTED = "SELECTED",
    EXPIRED = "EXPIRED",
    REJECTED = "REJECTED"
}
export declare enum CourseStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    DELETED = "DELETED"
}
export declare enum ClassStatus {
    PUBLISHED = "PUBLISHED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELED = "CANCELED",
    DELETED = "DELETED"
}
export declare enum LearnerClassStatus {
    ENROLLED = "ENROLLED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELED = "CANCELED",
    DELETED = "DELETED"
}
export declare enum GardenTimesheetStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}
export declare enum SlotStatus {
    AVAILABLE = "AVAILABLE",
    LOCKED = "LOCKED",
    NOT_AVAILABLE = "NOT_AVAILABLE"
}
export declare enum CourseLevel {
    BASIC = "BASIC",
    INTERMEDIATE = "INTERMEDIATE",
    ADVANCED = "ADVANCED"
}
export declare enum ClassRequestStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    EXPIRED = "EXPIRED",
    REJECTED = "REJECTED",
    CANCELED = "CANCELED"
}
export declare enum TransactionStatus {
    DRAFT = "DRAFT",
    CAPTURED = "CAPTURED",
    ERROR = "ERROR",
    CANCELED = "CANCELED",
    DELETED = "DELETED",
    REFUNDED = "REFUNDED"
}
export declare enum ClassRequestType {
    PUBLISH_CLASS = "PUBLISH_CLASS",
    CANCEL_CLASS = "CANCEL_CLASS"
}
export declare enum Weekday {
    MONDAY = "Monday",
    TUESDAY = "Tuesday",
    WEDNESDAY = "Wednesday",
    THURSDAY = "Thursday",
    FRIDAY = "Friday",
    SATURDAY = "Saturday",
    SUNDAY = "Sunday"
}
export declare enum SlotNumber {
    ONE = 1,
    TWO = 2,
    THREE = 3,
    FOUR = 4
}
export declare const SLOT_NUMBERS: number[];
export declare enum SubmissionStatus {
    SUBMITTED = "SUBMITTED",
    GRADED = "GRADED"
}
export declare enum AttendanceStatus {
    NOT_YET = "NOT_YET",
    PRESENT = "PRESENT",
    ABSENT = "ABSENT"
}
export declare enum PayoutRequestStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    EXPIRED = "EXPIRED",
    REJECTED = "REJECTED",
    CANCELED = "CANCELED"
}
