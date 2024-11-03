export enum QueueName {
  CLASS_REQUEST = 'CLASS_REQUEST',
  PAYOUT_REQUEST = 'PAYOUT_REQUEST',
  RECRUITMENT = 'RECRUITMENT',
  CLASS = 'CLASS',
  SLOT = 'SLOT'
}

export enum JobName {
  // Class Request
  ClassRequestAutoExpired = 'ClassRequestAutoExpired',
  // Class
  UpdateClassStatusInProgress = 'UpdateClassStatusInProgress',
  UpdateClassProgressEndSlot = 'UpdateClassProgressEndSlot',
  // Recruitment
  RecruitmentAutoExpired = 'RecruitmentAutoExpired'
}

export enum JobSchedulerKey {
  // Class
  UpdateClassStatusScheduler = 'UpdateClassStatusScheduler',
  UpdateClassProgressEndSlot1Scheduler = 'UpdateClassProgressEndSlot1Scheduler',
  UpdateClassProgressEndSlot2Scheduler = 'UpdateClassProgressEndSlot2Scheduler',
  UpdateClassProgressEndSlot3Scheduler = 'UpdateClassProgressEndSlot3Scheduler',
  UpdateClassProgressEndSlot4Scheduler = 'UpdateClassProgressEndSlot4Scheduler'
}
