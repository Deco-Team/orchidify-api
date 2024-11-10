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
exports.PayoutRequestRepository = exports.IPayoutRequestRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const payout_request_schema_1 = require("../schemas/payout-request.schema");
const repositories_1 = require("../../common/repositories");
exports.IPayoutRequestRepository = Symbol('IPayoutRequestRepository');
let PayoutRequestRepository = class PayoutRequestRepository extends repositories_1.AbstractRepository {
    constructor(model) {
        super(model);
    }
};
exports.PayoutRequestRepository = PayoutRequestRepository;
exports.PayoutRequestRepository = PayoutRequestRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(payout_request_schema_1.PayoutRequest.name)),
    __metadata("design:paramtypes", [Object])
], PayoutRequestRepository);
//# sourceMappingURL=payout-request.repository.js.map