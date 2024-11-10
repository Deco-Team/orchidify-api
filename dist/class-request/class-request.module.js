"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassRequestModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const class_request_schema_1 = require("./schemas/class-request.schema");
const class_request_repository_1 = require("./repositories/class-request.repository");
const class_request_service_1 = require("./services/class-request.service");
const instructor_class_request_controller_1 = require("./controllers/instructor.class-request.controller");
const management_class_request_controller_1 = require("./controllers/management.class-request.controller");
let ClassRequestModule = class ClassRequestModule {
};
exports.ClassRequestModule = ClassRequestModule;
exports.ClassRequestModule = ClassRequestModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: class_request_schema_1.ClassRequest.name, schema: class_request_schema_1.ClassRequestSchema }])],
        controllers: [instructor_class_request_controller_1.InstructorClassRequestController, management_class_request_controller_1.ManagementClassRequestController],
        providers: [
            {
                provide: class_request_service_1.IClassRequestService,
                useClass: class_request_service_1.ClassRequestService
            },
            {
                provide: class_request_repository_1.IClassRequestRepository,
                useClass: class_request_repository_1.ClassRequestRepository
            }
        ],
        exports: [
            {
                provide: class_request_service_1.IClassRequestService,
                useClass: class_request_service_1.ClassRequestService
            }
        ]
    })
], ClassRequestModule);
//# sourceMappingURL=class-request.module.js.map