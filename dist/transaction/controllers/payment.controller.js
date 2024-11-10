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
var PaymentController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payment_service_1 = require("../services/payment.service");
const constant_1 = require("../contracts/constant");
let PaymentController = PaymentController_1 = class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
        this.logger = new common_1.Logger(PaymentController_1.name);
    }
    webhookMomo(momoPaymentResponseDto) {
        this.logger.log('Handling MOMO webhook', JSON.stringify(momoPaymentResponseDto));
        this.paymentService.setStrategy(constant_1.PaymentMethod.MOMO);
        const result = this.paymentService.verifyPaymentWebhookData(momoPaymentResponseDto);
        if (!result)
            return false;
        this.paymentService.setStrategy(constant_1.PaymentMethod.MOMO);
        return this.paymentService.processWebhook(momoPaymentResponseDto);
    }
    async webhookStripe(req, body) {
        this.logger.log('Handling STRIPE webhook...');
        this.paymentService.setStrategy(constant_1.PaymentMethod.STRIPE);
        const signature = req.headers['stripe-signature'];
        const event = await this.paymentService.verifyPaymentWebhookData({ rawBody: body, signature });
        this.paymentService.setStrategy(constant_1.PaymentMethod.STRIPE);
        return this.paymentService.processWebhook(event);
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Webhook Handler for Instant Payment Notification (MOMO)'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, common_1.Post)('webhook/momo'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "webhookMomo", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Webhook (STRIPE)'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('webhook/stripe'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Request, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "webhookStripe", null);
exports.PaymentController = PaymentController = PaymentController_1 = __decorate([
    (0, swagger_1.ApiTags)('Payment'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('payment'),
    __param(0, (0, common_1.Inject)(payment_service_1.IPaymentService)),
    __metadata("design:paramtypes", [Object])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map