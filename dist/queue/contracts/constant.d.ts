export declare enum QueueName {
    CLASS_REQUEST = "CLASS_REQUEST",
    PAYOUT_REQUEST = "PAYOUT_REQUEST",
    RECRUITMENT = "RECRUITMENT",
    CLASS = "CLASS",
    SLOT = "SLOT"
}
export declare enum JobName {
    ClassRequestAutoExpired = "ClassRequestAutoExpired",
    UpdateClassStatusInProgress = "UpdateClassStatusInProgress",
    UpdateClassProgressEndSlot = "UpdateClassProgressEndSlot",
    ClassAutoCompleted = "ClassAutoCompleted",
    SendClassCertificate = "SendClassCertificate",
    RecruitmentAutoExpired = "RecruitmentAutoExpired",
    PayoutRequestAutoExpired = "PayoutRequestAutoExpired"
}
export declare enum JobSchedulerKey {
    UpdateClassStatusScheduler = "UpdateClassStatusScheduler",
    UpdateClassProgressEndSlot1Scheduler = "UpdateClassProgressEndSlot1Scheduler",
    UpdateClassProgressEndSlot2Scheduler = "UpdateClassProgressEndSlot2Scheduler",
    UpdateClassProgressEndSlot3Scheduler = "UpdateClassProgressEndSlot3Scheduler",
    UpdateClassProgressEndSlot4Scheduler = "UpdateClassProgressEndSlot4Scheduler",
    CompleteClassScheduler = "CompleteClassScheduler",
    SendClassCertificateScheduler = "SendClassCertificateScheduler"
}
