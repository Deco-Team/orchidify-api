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
exports.HelperService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const crypto_1 = require("crypto");
const bcrypt = require("bcrypt");
const mongoose_2 = require("mongoose");
const constant_1 = require("../contracts/constant");
const config_1 = require("../../config");
const moment = require("moment-timezone");
let HelperService = class HelperService {
    constructor(connection) {
        this.connection = connection;
        this.generateRandomString = (length = 6, characters = '0123456789') => {
            let randomString = '';
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                randomString += characters.charAt(randomIndex);
            }
            return randomString;
        };
    }
    async executeCommandsInTransaction(fn, data) {
        let result;
        const session = await this.connection.startSession();
        await session.withTransaction(async () => {
            result = await fn(session, data);
        });
        return result;
    }
    createSignature(rawData, key) {
        const signature = (0, crypto_1.createHmac)('sha256', key).update(rawData).digest('hex');
        return signature;
    }
    async hashPassword(password) {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }
    async comparePassword(password, hash) {
        return await bcrypt.compare(password, hash);
    }
    validateWeekdays(weekdays) {
        if (!weekdays || weekdays.length !== 2) {
            return false;
        }
        const validWeekdayTuples = [
            [constant_1.Weekday.MONDAY, constant_1.Weekday.THURSDAY],
            [constant_1.Weekday.TUESDAY, constant_1.Weekday.FRIDAY],
            [constant_1.Weekday.WEDNESDAY, constant_1.Weekday.SATURDAY]
        ];
        return validWeekdayTuples.some((tuple) => weekdays[0] === tuple[0] && weekdays[1] === tuple[1]);
    }
    convertDataToPaging({ docs, totalDocs, limit, page }) {
        const totalPages = totalDocs < limit ? 1 : Math.ceil(totalDocs / limit);
        return {
            docs,
            totalDocs,
            limit,
            page,
            totalPages,
            pagingCounter: null,
            hasPrevPage: page > totalPages,
            hasNextPage: page < totalPages,
            prevPage: page - 1 === 0 ? null : page - 1,
            nextPage: page < totalPages ? page + 1 : null
        };
    }
    getDiffTimeByMilliseconds(date) {
        const diffTime = moment.tz(date, config_1.VN_TIMEZONE).diff(moment().tz(config_1.VN_TIMEZONE), 'milliseconds');
        return diffTime > 0 ? diffTime : 0;
    }
};
exports.HelperService = HelperService;
exports.HelperService = HelperService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectConnection)()),
    __metadata("design:paramtypes", [mongoose_2.Connection])
], HelperService);
//# sourceMappingURL=helper.service.js.map