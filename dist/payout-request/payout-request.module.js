"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutRequestModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const payout_request_schema_1 = require("./schemas/payout-request.schema");
const payout_request_repository_1 = require("./repositories/payout-request.repository");
const payout_request_service_1 = require("./services/payout-request.service");
const instructor_payout_request_controller_1 = require("./controllers/instructor.payout-request.controller");
const management_payout_request_controller_1 = require("./controllers/management.payout-request.controller");
const instructor_module_1 = require("../instructor/instructor.module");
const staff_module_1 = require("../staff/staff.module");
let PayoutRequestModule = class PayoutRequestModule {
};
exports.PayoutRequestModule = PayoutRequestModule;
exports.PayoutRequestModule = PayoutRequestModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: payout_request_schema_1.PayoutRequest.name, schema: payout_request_schema_1.PayoutRequestSchema }]),
            instructor_module_1.InstructorModule,
            staff_module_1.StaffModule
        ],
        controllers: [instructor_payout_request_controller_1.InstructorPayoutRequestController, management_payout_request_controller_1.ManagementPayoutRequestController],
        providers: [
            {
                provide: payout_request_service_1.IPayoutRequestService,
                useClass: payout_request_service_1.PayoutRequestService
            },
            {
                provide: payout_request_repository_1.IPayoutRequestRepository,
                useClass: payout_request_repository_1.PayoutRequestRepository
            }
        ],
        exports: [
            {
                provide: payout_request_service_1.IPayoutRequestService,
                useClass: payout_request_service_1.PayoutRequestService
            }
        ]
    })
], PayoutRequestModule);
//# sourceMappingURL=payout-request.module.js.map