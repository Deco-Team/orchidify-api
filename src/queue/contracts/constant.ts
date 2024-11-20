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
  UpdateClassStatus = 'UpdateClassStatus',
  UpdateClassProgressEndSlot = 'UpdateClassProgressEndSlot',
  ClassAutoCompleted = 'ClassAutoCompleted',
  SendClassCertificate = 'SendClassCertificate',
  RemindClassStartSlot = 'RemindClassStartSlot',
  RemindClassStartSoon = 'RemindClassStartSoon',
  // Recruitment
  RecruitmentAutoExpired = 'RecruitmentAutoExpired',
  // Payout Request
  PayoutRequestAutoExpired = 'PayoutRequestAutoExpired'
}

export enum JobSchedulerKey {
  UpdateClassStatusScheduler = 'UpdateClassStatusScheduler',
  CompleteClassScheduler = 'CompleteClassScheduler',
  SendClassCertificateScheduler = 'SendClassCertificateScheduler',

  // Update class progress when slot ended
  UpdateClassProgressEndSlot1Scheduler = 'UpdateClassProgressEndSlot1Scheduler',
  UpdateClassProgressEndSlot2Scheduler = 'UpdateClassProgressEndSlot2Scheduler',
  UpdateClassProgressEndSlot3Scheduler = 'UpdateClassProgressEndSlot3Scheduler',
  UpdateClassProgressEndSlot4Scheduler = 'UpdateClassProgressEndSlot4Scheduler',

  // Remind class slot start soon
  RemindClassStartSlot1Scheduler = 'RemindClassStartSlot1Scheduler',
  RemindClassStartSlot2Scheduler = 'RemindClassStartSlot2Scheduler',
  RemindClassStartSlot3Scheduler = 'RemindClassStartSlot3Scheduler',
  RemindClassStartSlot4Scheduler = 'RemindClassStartSlot4Scheduler',

  // Remind class start soon
  RemindClassStartSoonScheduler = 'RemindClassStartSoonScheduler',
}
