"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutRequestStatus = exports.AttendanceStatus = exports.SubmissionStatus = exports.SLOT_NUMBERS = exports.SlotNumber = exports.Weekday = exports.ClassRequestType = exports.TransactionStatus = exports.ClassRequestStatus = exports.CourseLevel = exports.SlotStatus = exports.GardenTimesheetStatus = exports.LearnerClassStatus = exports.ClassStatus = exports.CourseStatus = exports.RecruitmentStatus = exports.GardenStatus = exports.GardenManagerStatus = exports.StaffStatus = exports.InstructorStatus = exports.LearnerStatus = exports.TimesheetType = exports.UserRole = exports.UserSide = void 0;
var UserSide;
(function (UserSide) {
    UserSide["LEARNER"] = "LEARNER";
    UserSide["INSTRUCTOR"] = "INSTRUCTOR";
    UserSide["MANAGEMENT"] = "MANAGEMENT";
})(UserSide || (exports.UserSide = UserSide = {}));
var UserRole;
(function (UserRole) {
    UserRole["LEARNER"] = "LEARNER";
    UserRole["INSTRUCTOR"] = "INSTRUCTOR";
    UserRole["ADMIN"] = "ADMIN";
    UserRole["STAFF"] = "STAFF";
    UserRole["GARDEN_MANAGER"] = "GARDEN_MANAGER";
})(UserRole || (exports.UserRole = UserRole = {}));
var TimesheetType;
(function (TimesheetType) {
    TimesheetType["MONTH"] = "MONTH";
    TimesheetType["WEEK"] = "WEEK";
})(TimesheetType || (exports.TimesheetType = TimesheetType = {}));
var LearnerStatus;
(function (LearnerStatus) {
    LearnerStatus["UNVERIFIED"] = "UNVERIFIED";
    LearnerStatus["ACTIVE"] = "ACTIVE";
    LearnerStatus["INACTIVE"] = "INACTIVE";
})(LearnerStatus || (exports.LearnerStatus = LearnerStatus = {}));
var InstructorStatus;
(function (InstructorStatus) {
    InstructorStatus["ACTIVE"] = "ACTIVE";
    InstructorStatus["INACTIVE"] = "INACTIVE";
})(InstructorStatus || (exports.InstructorStatus = InstructorStatus = {}));
var StaffStatus;
(function (StaffStatus) {
    StaffStatus["ACTIVE"] = "ACTIVE";
    StaffStatus["INACTIVE"] = "INACTIVE";
})(StaffStatus || (exports.StaffStatus = StaffStatus = {}));
var GardenManagerStatus;
(function (GardenManagerStatus) {
    GardenManagerStatus["ACTIVE"] = "ACTIVE";
    GardenManagerStatus["INACTIVE"] = "INACTIVE";
})(GardenManagerStatus || (exports.GardenManagerStatus = GardenManagerStatus = {}));
var GardenStatus;
(function (GardenStatus) {
    GardenStatus["ACTIVE"] = "ACTIVE";
    GardenStatus["INACTIVE"] = "INACTIVE";
})(GardenStatus || (exports.GardenStatus = GardenStatus = {}));
var RecruitmentStatus;
(function (RecruitmentStatus) {
    RecruitmentStatus["PENDING"] = "PENDING";
    RecruitmentStatus["INTERVIEWING"] = "INTERVIEWING";
    RecruitmentStatus["SELECTED"] = "SELECTED";
    RecruitmentStatus["EXPIRED"] = "EXPIRED";
    RecruitmentStatus["REJECTED"] = "REJECTED";
})(RecruitmentStatus || (exports.RecruitmentStatus = RecruitmentStatus = {}));
var CourseStatus;
(function (CourseStatus) {
    CourseStatus["DRAFT"] = "DRAFT";
    CourseStatus["ACTIVE"] = "ACTIVE";
    CourseStatus["DELETED"] = "DELETED";
})(CourseStatus || (exports.CourseStatus = CourseStatus = {}));
var ClassStatus;
(function (ClassStatus) {
    ClassStatus["PUBLISHED"] = "PUBLISHED";
    ClassStatus["IN_PROGRESS"] = "IN_PROGRESS";
    ClassStatus["COMPLETED"] = "COMPLETED";
    ClassStatus["CANCELED"] = "CANCELED";
    ClassStatus["DELETED"] = "DELETED";
})(ClassStatus || (exports.ClassStatus = ClassStatus = {}));
var LearnerClassStatus;
(function (LearnerClassStatus) {
    LearnerClassStatus["ENROLLED"] = "ENROLLED";
    LearnerClassStatus["IN_PROGRESS"] = "IN_PROGRESS";
    LearnerClassStatus["COMPLETED"] = "COMPLETED";
    LearnerClassStatus["CANCELED"] = "CANCELED";
    LearnerClassStatus["DELETED"] = "DELETED";
})(LearnerClassStatus || (exports.LearnerClassStatus = LearnerClassStatus = {}));
var GardenTimesheetStatus;
(function (GardenTimesheetStatus) {
    GardenTimesheetStatus["ACTIVE"] = "ACTIVE";
    GardenTimesheetStatus["INACTIVE"] = "INACTIVE";
})(GardenTimesheetStatus || (exports.GardenTimesheetStatus = GardenTimesheetStatus = {}));
var SlotStatus;
(function (SlotStatus) {
    SlotStatus["AVAILABLE"] = "AVAILABLE";
    SlotStatus["LOCKED"] = "LOCKED";
    SlotStatus["NOT_AVAILABLE"] = "NOT_AVAILABLE";
})(SlotStatus || (exports.SlotStatus = SlotStatus = {}));
var CourseLevel;
(function (CourseLevel) {
    CourseLevel["BASIC"] = "BASIC";
    CourseLevel["INTERMEDIATE"] = "INTERMEDIATE";
    CourseLevel["ADVANCED"] = "ADVANCED";
})(CourseLevel || (exports.CourseLevel = CourseLevel = {}));
var ClassRequestStatus;
(function (ClassRequestStatus) {
    ClassRequestStatus["PENDING"] = "PENDING";
    ClassRequestStatus["APPROVED"] = "APPROVED";
    ClassRequestStatus["EXPIRED"] = "EXPIRED";
    ClassRequestStatus["REJECTED"] = "REJECTED";
    ClassRequestStatus["CANCELED"] = "CANCELED";
})(ClassRequestStatus || (exports.ClassRequestStatus = ClassRequestStatus = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["DRAFT"] = "DRAFT";
    TransactionStatus["CAPTURED"] = "CAPTURED";
    TransactionStatus["ERROR"] = "ERROR";
    TransactionStatus["CANCELED"] = "CANCELED";
    TransactionStatus["DELETED"] = "DELETED";
    TransactionStatus["REFUNDED"] = "REFUNDED";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
var ClassRequestType;
(function (ClassRequestType) {
    ClassRequestType["PUBLISH_CLASS"] = "PUBLISH_CLASS";
    ClassRequestType["CANCEL_CLASS"] = "CANCEL_CLASS";
})(ClassRequestType || (exports.ClassRequestType = ClassRequestType = {}));
var Weekday;
(function (Weekday) {
    Weekday["MONDAY"] = "Monday";
    Weekday["TUESDAY"] = "Tuesday";
    Weekday["WEDNESDAY"] = "Wednesday";
    Weekday["THURSDAY"] = "Thursday";
    Weekday["FRIDAY"] = "Friday";
    Weekday["SATURDAY"] = "Saturday";
    Weekday["SUNDAY"] = "Sunday";
})(Weekday || (exports.Weekday = Weekday = {}));
var SlotNumber;
(function (SlotNumber) {
    SlotNumber[SlotNumber["ONE"] = 1] = "ONE";
    SlotNumber[SlotNumber["TWO"] = 2] = "TWO";
    SlotNumber[SlotNumber["THREE"] = 3] = "THREE";
    SlotNumber[SlotNumber["FOUR"] = 4] = "FOUR";
})(SlotNumber || (exports.SlotNumber = SlotNumber = {}));
exports.SLOT_NUMBERS = [1, 2, 3, 4];
var SubmissionStatus;
(function (SubmissionStatus) {
    SubmissionStatus["SUBMITTED"] = "SUBMITTED";
    SubmissionStatus["GRADED"] = "GRADED";
})(SubmissionStatus || (exports.SubmissionStatus = SubmissionStatus = {}));
var AttendanceStatus;
(function (AttendanceStatus) {
    AttendanceStatus["NOT_YET"] = "NOT_YET";
    AttendanceStatus["PRESENT"] = "PRESENT";
    AttendanceStatus["ABSENT"] = "ABSENT";
})(AttendanceStatus || (exports.AttendanceStatus = AttendanceStatus = {}));
var PayoutRequestStatus;
(function (PayoutRequestStatus) {
    PayoutRequestStatus["PENDING"] = "PENDING";
    PayoutRequestStatus["APPROVED"] = "APPROVED";
    PayoutRequestStatus["EXPIRED"] = "EXPIRED";
    PayoutRequestStatus["REJECTED"] = "REJECTED";
    PayoutRequestStatus["CANCELED"] = "CANCELED";
})(PayoutRequestStatus || (exports.PayoutRequestStatus = PayoutRequestStatus = {}));
//# sourceMappingURL=constant.js.map