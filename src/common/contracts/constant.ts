export enum UserSide {
  LEARNER = 'LEARNER',
  INSTRUCTOR = 'INSTRUCTOR',
  MANAGEMENT = 'MANAGEMENT'
}

export enum UserRole {
  LEARNER = 'LEARNER',
  INSTRUCTOR = 'INSTRUCTOR',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  GARDEN_MANAGER = 'GARDEN_MANAGER'
}

export enum TimesheetType {
  MONTH = 'MONTH',
  WEEK = 'WEEK'
}

export enum LearnerStatus {
  UNVERIFIED = 'UNVERIFIED',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum InstructorStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum StaffStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum GardenManagerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum GardenStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum RecruitmentStatus {
  PENDING = 'PENDING',
  INTERVIEWING = 'INTERVIEWING',
  SELECTED = 'SELECTED',
  EXPIRED = 'EXPIRED',
  REJECTED = 'REJECTED'
}

export enum CourseStatus {
  DRAFT = 'DRAFT',
  REQUESTING = 'REQUESTING',
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED'
}

export enum ClassStatus {
  PUBLISHED = 'PUBLISHED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  DELETED = 'DELETED'
}

export enum GardenTimesheetStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum SlotStatus {
  AVAILABLE = 'AVAILABLE',
  LOCKED = 'LOCKED',
  NOT_AVAILABLE = 'NOT_AVAILABLE'
}

export enum CourseLevel {
  BASIC = 'BASIC',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export enum ClassRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  EXPIRED = 'EXPIRED',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED'
}

export enum ClassRequestType {
  PUBLISH_CLASS = 'PUBLISH_CLASS'
}

export enum Weekday {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday'
}

export enum SlotNumber {
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4
}
