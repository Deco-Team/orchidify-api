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
exports.ManagementGardenTimesheetController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const _ = require("lodash");
const dto_1 = require("../../common/contracts/dto");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const constant_1 = require("../../common/contracts/constant");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const garden_timesheet_service_1 = require("../services/garden-timesheet.service");
const view_garden_timesheet_dto_1 = require("../dto/view-garden-timesheet.dto");
const garden_service_1 = require("../../garden/services/garden.service");
const app_exception_1 = require("../../common/exceptions/app.exception");
const error_1 = require("../../common/contracts/error");
const api_response_decorator_1 = require("../../common/decorators/api-response.decorator");
const view_teaching_timesheet_dto_1 = require("../dto/view-teaching-timesheet.dto");
const update_garden_timesheet_dto_1 = require("../dto/update-garden-timesheet.dto");
const mongoose_1 = require("mongoose");
let ManagementGardenTimesheetController = class ManagementGardenTimesheetController {
    constructor(gardenTimesheetService, gardenService) {
        this.gardenTimesheetService = gardenTimesheetService;
        this.gardenService = gardenService;
    }
    async viewGardenTimesheet(req, queryGardenTimesheetDto) {
        const { _id, role } = _.get(req, 'user');
        const garden = await this.gardenService.findById(queryGardenTimesheetDto.gardenId);
        if (!garden || (role === constant_1.UserRole.GARDEN_MANAGER && garden?.gardenManagerId?.toString() !== _id))
            throw new app_exception_1.AppException(error_1.Errors.GARDEN_NOT_FOUND);
        if (garden.status === constant_1.GardenStatus.INACTIVE)
            throw new app_exception_1.AppException(error_1.Errors.GARDEN_INACTIVE);
        const docs = await this.gardenTimesheetService.viewGardenTimesheetList(queryGardenTimesheetDto, garden);
        return { docs };
    }
    async viewInstructorTimesheet(queryTeachingTimesheetDto) {
        const docs = await this.gardenTimesheetService.viewTeachingTimesheet(queryTeachingTimesheetDto);
        return { docs };
    }
    async updateGardenTimesheet(updateGardenTimesheetDto) {
        const { date, gardenId, status } = updateGardenTimesheetDto;
        const gardenTimesheet = await this.gardenTimesheetService.findOneBy({
            date: date,
            gardenId: new mongoose_1.Types.ObjectId(gardenId)
        });
        if (!gardenTimesheet)
            throw new app_exception_1.AppException(error_1.Errors.GARDEN_TIMESHEET_NOT_FOUND);
        if (gardenTimesheet.slots.length > 0 && status === constant_1.GardenTimesheetStatus.INACTIVE)
            throw new app_exception_1.AppException(error_1.Errors.CAN_NOT_UPDATE_GARDEN_TIMESHEET);
        await this.gardenTimesheetService.update({ _id: gardenTimesheet._id }, {
            $set: { status }
        });
        return new dto_1.SuccessResponse(true);
    }
};
exports.ManagementGardenTimesheetController = ManagementGardenTimesheetController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}][${constant_1.UserRole.GARDEN_MANAGER}] View GardenTimesheet List`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_garden_timesheet_dto_1.ViewGardenTimesheetListDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.GARDEN_NOT_FOUND, error_1.Errors.GARDEN_INACTIVE]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF, constant_1.UserRole.GARDEN_MANAGER),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, view_garden_timesheet_dto_1.QueryGardenTimesheetDto]),
    __metadata("design:returntype", Promise)
], ManagementGardenTimesheetController.prototype, "viewGardenTimesheet", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View Instructor Timesheet List`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_teaching_timesheet_dto_1.ViewTeachingTimesheetListDataResponse }),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Get)('instructor-timesheet'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [view_teaching_timesheet_dto_1.QueryInstructorTimesheetDto]),
    __metadata("design:returntype", Promise)
], ManagementGardenTimesheetController.prototype, "viewInstructorTimesheet", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `[${constant_1.UserRole.STAFF}] Update Garden Timesheet`
    }),
    (0, swagger_1.ApiOkResponse)({ type: dto_1.SuccessDataResponse }),
    (0, api_response_decorator_1.ApiErrorResponse)([error_1.Errors.GARDEN_TIMESHEET_NOT_FOUND, error_1.Errors.CAN_NOT_UPDATE_GARDEN_TIMESHEET]),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.STAFF),
    (0, common_1.Put)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_garden_timesheet_dto_1.UpdateGardenTimesheetDto]),
    __metadata("design:returntype", Promise)
], ManagementGardenTimesheetController.prototype, "updateGardenTimesheet", null);
exports.ManagementGardenTimesheetController = ManagementGardenTimesheetController = __decorate([
    (0, swagger_1.ApiTags)('GardenTimesheet - Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('management'),
    __param(0, (0, common_1.Inject)(garden_timesheet_service_1.IGardenTimesheetService)),
    __param(1, (0, common_1.Inject)(garden_service_1.IGardenService)),
    __metadata("design:paramtypes", [Object, Object])
], ManagementGardenTimesheetController);
//# sourceMappingURL=management.garden-timesheet.controller.js.map