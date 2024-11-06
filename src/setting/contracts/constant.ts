export enum SettingKey {
  // Course
  CourseTypes = 'CourseTypes',

  // Payment
  StripePublishableKey = 'StripePublishableKey',

  // Auth
  ResendOtpCodeLimit = 'ResendOtpCodeLimit',

  // Class Request
  CreateClassRequestLimitPerDay = 'CreateClassRequestLimitPerDay',
  ClassRequestAutoExpiration = 'ClassRequestAutoExpiration',

  // Course
  AssignmentsCountRange = 'AssignmentsCountRange',

  // Payout Request
  PayoutRequestAutoExpiration = 'PayoutRequestAutoExpiration',
  CreatePayoutRequestLimitPerDay = 'CreatePayoutRequestLimitPerDay',

  // Recruitment
  RecruitmentProcessAutoExpiration = 'RecruitmentProcessAutoExpiration',

  // System
  CommissionRate = 'CommissionRate',

  // Class
  ClassAutoCompleteAfterDay = 'ClassAutoCompleteAfterDay',

  // Feedback
  FeedbackOpenBeforeClassEndDay = 'FeedbackOpenBeforeClassEndDay',
}
