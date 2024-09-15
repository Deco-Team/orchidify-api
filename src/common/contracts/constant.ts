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
  GARDEN_MANAGER = 'GARDEN_MANAGER',
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
  PENDING = 'PENDING',
  PUBLISHED = 'PUBLISHED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  DELETED = 'DELETED'
}