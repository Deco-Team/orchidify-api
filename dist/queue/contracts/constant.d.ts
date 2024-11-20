export declare enum QueueName {
    CLASS_REQUEST = "CLASS_REQUEST",
    PAYOUT_REQUEST = "PAYOUT_REQUEST",
    RECRUITMENT = "RECRUITMENT",
    CLASS = "CLASS",
    SLOT = "SLOT"
}
export declare enum JobName {
    ClassRequestAutoExpired = "ClassRequestAutoExpired",
    UpdateClassStatus = "UpdateClassStatus",
    UpdateClassProgressEndSlot = "UpdateClassProgressEndSlot",
    ClassAutoCompleted = "ClassAutoCompleted",
    SendClassCertificate = "SendClassCertificate",
    RemindClassStartSlot = "RemindClassStartSlot",
    RemindClassStartSoon = "RemindClassStartSoon",
    RecruitmentAutoExpired = "RecruitmentAutoExpired",
    PayoutRequestAutoExpired = "PayoutRequestAutoExpired"
}
export declare enum JobSchedulerKey {
    UpdateClassStatusScheduler = "UpdateClassStatusScheduler",
    CompleteClassScheduler = "CompleteClassScheduler",
    SendClassCertificateScheduler = "SendClassCertificateScheduler",
    UpdateClassProgressEndSlot1Scheduler = "UpdateClassProgressEndSlot1Scheduler",
    UpdateClassProgressEndSlot2Scheduler = "UpdateClassProgressEndSlot2Scheduler",
    UpdateClassProgressEndSlot3Scheduler = "UpdateClassProgressEndSlot3Scheduler",
    UpdateClassProgressEndSlot4Scheduler = "UpdateClassProgressEndSlot4Scheduler",
    RemindClassStartSlot1Scheduler = "RemindClassStartSlot1Scheduler",
    RemindClassStartSlot2Scheduler = "RemindClassStartSlot2Scheduler",
    RemindClassStartSlot3Scheduler = "RemindClassStartSlot3Scheduler",
    RemindClassStartSlot4Scheduler = "RemindClassStartSlot4Scheduler",
    RemindClassStartSoonScheduler = "RemindClassStartSoonScheduler"
}
