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
exports.LearnerGardenTimesheetController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const _ = require("lodash");
const dto_1 = require("../../common/contracts/dto");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const constant_1 = require("../../common/contracts/constant");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const garden_timesheet_service_1 = require("../services/garden-timesheet.service");
const view_my_timesheet_dto_1 = require("../dto/view-my-timesheet.dto");
let LearnerGardenTimesheetController = class LearnerGardenTimesheetController {
    constructor(gardenTimesheetService) {
        this.gardenTimesheetService = gardenTimesheetService;
    }
    async viewMyTimesheet(req, queryMyTimesheetDto) {
        const { _id: learnerId } = _.get(req, 'user');
        queryMyTimesheetDto.learnerId = learnerId;
        const docs = await this.gardenTimesheetService.viewMyTimesheet(queryMyTimesheetDto);
        return { docs };
    }
};
exports.LearnerGardenTimesheetController = LearnerGardenTimesheetController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: `View My Timesheet`
    }),
    (0, swagger_1.ApiOkResponse)({ type: view_my_timesheet_dto_1.ViewMyTimesheetListDataResponse }),
    (0, common_1.Get)('my-timesheet'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, view_my_timesheet_dto_1.QueryMyTimesheetDto]),
    __metadata("design:returntype", Promise)
], LearnerGardenTimesheetController.prototype, "viewMyTimesheet", null);
exports.LearnerGardenTimesheetController = LearnerGardenTimesheetController = __decorate([
    (0, swagger_1.ApiTags)('GardenTimesheet - Learner'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiBadRequestResponse)({ type: dto_1.ErrorResponse }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard.ACCESS_TOKEN, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(constant_1.UserRole.LEARNER),
    (0, common_1.Controller)('learner'),
    __param(0, (0, common_1.Inject)(garden_timesheet_service_1.IGardenTimesheetService)),
    __metadata("design:paramtypes", [Object])
], LearnerGardenTimesheetController);
//# sourceMappingURL=learner.garden-timesheet.controller.js.map