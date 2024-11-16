"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobSchedulerKey = exports.JobName = exports.QueueName = void 0;
var QueueName;
(function (QueueName) {
    QueueName["CLASS_REQUEST"] = "CLASS_REQUEST";
    QueueName["PAYOUT_REQUEST"] = "PAYOUT_REQUEST";
    QueueName["RECRUITMENT"] = "RECRUITMENT";
    QueueName["CLASS"] = "CLASS";
    QueueName["SLOT"] = "SLOT";
})(QueueName || (exports.QueueName = QueueName = {}));
var JobName;
(function (JobName) {
    JobName["ClassRequestAutoExpired"] = "ClassRequestAutoExpired";
    JobName["UpdateClassStatus"] = "UpdateClassStatus";
    JobName["UpdateClassProgressEndSlot"] = "UpdateClassProgressEndSlot";
    JobName["ClassAutoCompleted"] = "ClassAutoCompleted";
    JobName["SendClassCertificate"] = "SendClassCertificate";
    JobName["RecruitmentAutoExpired"] = "RecruitmentAutoExpired";
    JobName["PayoutRequestAutoExpired"] = "PayoutRequestAutoExpired";
})(JobName || (exports.JobName = JobName = {}));
var JobSchedulerKey;
(function (JobSchedulerKey) {
    JobSchedulerKey["UpdateClassStatusScheduler"] = "UpdateClassStatusScheduler";
    JobSchedulerKey["UpdateClassProgressEndSlot1Scheduler"] = "UpdateClassProgressEndSlot1Scheduler";
    JobSchedulerKey["UpdateClassProgressEndSlot2Scheduler"] = "UpdateClassProgressEndSlot2Scheduler";
    JobSchedulerKey["UpdateClassProgressEndSlot3Scheduler"] = "UpdateClassProgressEndSlot3Scheduler";
    JobSchedulerKey["UpdateClassProgressEndSlot4Scheduler"] = "UpdateClassProgressEndSlot4Scheduler";
    JobSchedulerKey["CompleteClassScheduler"] = "CompleteClassScheduler";
    JobSchedulerKey["SendClassCertificateScheduler"] = "SendClassCertificateScheduler";
})(JobSchedulerKey || (exports.JobSchedulerKey = JobSchedulerKey = {}));
//# sourceMappingURL=constant.js.map