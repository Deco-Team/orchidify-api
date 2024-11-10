"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGardenTimesheetDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const moment = require("moment-timezone");
const base_garden_timesheet_dto_1 = require("./base.garden-timesheet.dto");
const constant_1 = require("../../common/contracts/constant");
const config_1 = require("../../config");
class CreateGardenTimesheetDto extends (0, swagger_1.PickType)(base_garden_timesheet_dto_1.BaseGardenTimesheetDto, ['date', 'status', 'gardenId', 'gardenMaxClass']) {
    constructor(gardenId, date, gardenMaxClass) {
        const startOfDate = moment(date).tz(config_1.VN_TIMEZONE).startOf('day');
        super();
        this.gardenId = gardenId;
        this.date = startOfDate.toDate();
        this.status = constant_1.GardenTimesheetStatus.ACTIVE;
        this.gardenMaxClass = gardenMaxClass;
        this.slots = [];
    }
}
exports.CreateGardenTimesheetDto = CreateGardenTimesheetDto;
//# sourceMappingURL=create-garden-timesheet.dto.js.map