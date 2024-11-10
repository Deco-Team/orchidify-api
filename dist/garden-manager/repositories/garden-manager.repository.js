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
exports.GardenManagerRepository = exports.IGardenManagerRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const garden_manager_schema_1 = require("../schemas/garden-manager.schema");
const repositories_1 = require("../../common/repositories");
exports.IGardenManagerRepository = Symbol('IGardenManagerRepository');
let GardenManagerRepository = class GardenManagerRepository extends repositories_1.AbstractRepository {
    constructor(model) {
        super(model);
    }
};
exports.GardenManagerRepository = GardenManagerRepository;
exports.GardenManagerRepository = GardenManagerRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(garden_manager_schema_1.GardenManager.name)),
    __metadata("design:paramtypes", [Object])
], GardenManagerRepository);
//# sourceMappingURL=garden-manager.repository.js.map