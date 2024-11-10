"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructorGardenTimesheetController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const _ = require("lodash");
const dto_1 = require("../../common/contracts/dto");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const constant_1 = require("../../common/contracts/constant");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const garden_timesheet_service_1 = require("../services/garden-timesheet.service");
const view_teaching_timesheet_dto_1 = require("../dto/view-teaching-timesheet.dto");
const view_available_timesheet_dto_1 = require("../dto/view-available-timesheet.dto");
const error_1 = require("../../common/contracts/error");
const api_response_decorator_1 = require("../../common/decorators/api-response.decorator");
const app_exception_1 = require("../../common/exceptions/app.exception");
const slot_dto_1 = require("../dto/slot.dto");
let InstructorGardenTimesheetController = class InstructorGardenTimesheetController {
    constructor(gardenTimesheetService) {
        this.gardenTimesheetService = gardenTimesheetService;
    }
    async viewAvailableTime(req, queryAvailableTimeDto) {
        const { _id } = _.get(req, 'user');
        queryAvailableTimeDto.instructorId = _id;
        const result = await this.gardenTimesheetService.viewAvailableTime(queryAvailableTimeDto);
        return result;
    }
    async viewTeachingTimesheet(req, queryTeachingTimesheetDto) {
        const { _id } = _.get(req, 'user');
        queryTeachingTimesheetDto.instructorId = _id;
        const docs = await this.gardenTimesheetService.viewTeachingTimesheet(queryTeachingTimesheetDto);
        return { docs };
    }
    async getSlotDetail(req, slotId) {
        const { _id: instructorId } = _.get(req, 'user');
        const slot = await this.gardenTimesheetService.findSlotBy({ slotId, instructorId });
        if (!slot)
            throw new app_exception_1.AppException(error_1.Errors.SLOT_NOT_FOUND);
        return slot;
    }
};
exports.InstructorGardenTimesheetController = InstructorGardenTimesheetController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View Available Time (SlotNumbers) of Garden Timesheet`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_available_timesheet_dto_1.ViewAvailableTimeDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.WEEKDAYS_OF_CLASS_INVALID]),
    (0, common_1.Get)('available-time'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, view_available_timesheet_dto_1.QueryAvailableTimeDto]),
    __metadata("design:returntype", Promise)
], InstructorGardenTimesheetController.prototype, "viewAvailableTime", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View Teaching Timesheet List`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_teaching_timesheet_dto_1.ViewTeachingTimesheetListDataResponse }),
    (0, common_1.Get)('teaching-timesheet'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, view_teaching_timesheet_dto_1.QueryTeachingTimesheetDto]),
    __metadata("design:returntype", Promise)
], InstructorGardenTimesheetController.prototype, "viewTeachingTimesheet", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View Slot Detail`
    }),
    (0, swagger_1.ApiOkResponse)({ type: slot_dto_1.ViewSlotDto }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.SLOT_NOT_FOUND]),
    (0, common_1.Get)('slots/:slotId([0-9a-f]{24})'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('slotId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InstructorGardenTimesheetController.prototype, "getSlotDetail", null);
exports.InstructorGardenTimesheetController = InstructorGardenTimesheetController = __decorate([
    (0, swagger_1.ApiTags)('GardenTimesheet - Instructor'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.INSTRUCTOR),
    (0, common_1.Controller)('instructor'),
    __param(0, (0, common_1.Inject)(garden_timesheet_service_1.IGardenTimesheetService)),
    __metadata("design:paramtypes", [Object])
], InstructorGardenTimesheetController);
//# sourceMappingURL=instructor.garden-timesheet.controller.js.map