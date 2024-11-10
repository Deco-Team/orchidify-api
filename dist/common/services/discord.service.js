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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const discord_js_1 = require("discord.js");
let DiscordService = class DiscordService {
    constructor(configService) {
        this.configService = configService;
        this.webhookClient = new discord_js_1.WebhookClient({
            id: this.configService.get('discord.webhookId'),
            token: this.configService.get('discord.webhookToken')
        });
    }
    async sendMessage({ content, fields }) {
        try {
            await this.webhookClient.send({
                content,
                username: `Orchidify API Bot`,
                avatarURL: 'https://cdn.pfps.gg/pfps/3323-como.gif',
                embeds: [
                    {
                        title: `ENV ${this.configService.get('NODE_ENV')}`,
                        color: 0x00ffff,
                        fields
                    }
                ]
            });
        }
        catch (err) { }
    }
};
exports.DiscordService = DiscordService;
exports.DiscordService = DiscordService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], DiscordService);
//# sourceMappingURL=discord.service.js.map