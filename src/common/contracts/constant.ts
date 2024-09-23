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

export enum CourseTemplateStatus {
  DRAFT = 'DRAFT',
  REQUESTING = 'REQUESTING',
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED'
}

export enum CourseStatus {
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
