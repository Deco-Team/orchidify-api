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
var PaymentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = exports.IPaymentService = void 0;
const common_1 = require("@nestjs/common");
const momo_strategy_1 = require("../strategies/momo.strategy");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const transaction_repository_1 = require("../repositories/transaction.repository");
const constant_1 = require("../../common/contracts/constant");
const constant_2 = require("../contracts/constant");
const payos_strategy_1 = require("../strategies/payos.strategy");
const zalopay_strategy_1 = require("../strategies/zalopay.strategy");
const stripe_strategy_1 = require("../strategies/stripe.strategy");
exports.IPaymentService = Symbol('IPaymentService');
let PaymentService = PaymentService_1 = class PaymentService {
    constructor(connection, transactionRepository, momoPaymentStrategy, zaloPayPaymentStrategy, payOSPaymentStrategy, stripePaymentStrategy) {
        this.connection = connection;
        this.transactionRepository = transactionRepository;
        this.momoPaymentStrategy = momoPaymentStrategy;
        this.zaloPayPaymentStrategy = zaloPayPaymentStrategy;
        this.payOSPaymentStrategy = payOSPaymentStrategy;
        this.stripePaymentStrategy = stripePaymentStrategy;
        this.logger = new common_1.Logger(PaymentService_1.name);
    }
    setStrategy(paymentMethod) {
        switch (paymentMethod) {
            case constant_2.PaymentMethod.MOMO:
                this.strategy = this.momoPaymentStrategy;
                break;
            case constant_2.PaymentMethod.ZALO_PAY:
                this.strategy = this.zaloPayPaymentStrategy;
                break;
            case constant_2.PaymentMethod.PAY_OS:
                this.strategy = this.payOSPaymentStrategy;
                break;
            case constant_2.PaymentMethod.STRIPE:
            default:
                this.strategy = this.stripePaymentStrategy;
                break;
        }
    }
    verifyPaymentWebhookData(webhookData) {
        return this.strategy.verifyPaymentWebhookData(webhookData);
    }
    createTransaction(createPaymentDto) {
        return this.strategy.createTransaction(createPaymentDto);
    }
    getTransaction(queryPaymentDto) {
        return this.strategy.getTransaction(queryPaymentDto);
    }
    refundTransaction(refundPaymentDto) {
        return this.strategy.refundTransaction(refundPaymentDto);
    }
    getRefundTransaction(queryPaymentDto) {
        return this.strategy.getRefundTransaction(queryPaymentDto);
    }
    async getPaymentList(filter, paginationParams) {
        const result = await this.transactionRepository.paginate({
            ...filter,
            transactionStatus: {
                $in: [constant_1.TransactionStatus.CAPTURED, constant_1.TransactionStatus.REFUNDED]
            }
        }, {
            projection: '-transactionHistory',
            ...paginationParams
        });
        return result;
    }
    async processWebhook(webhookData) {
        this.logger.log('processWebhook::', JSON.stringify(webhookData));
        return this.strategy.processWebhook(webhookData);
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = PaymentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectConnection)()),
    __param(1, (0, common_1.Inject)(transaction_repository_1.ITransactionRepository)),
    __metadata("design:paramtypes", [mongoose_2.Connection, Object, momo_strategy_1.MomoPaymentStrategy,
        zalopay_strategy_1.ZaloPayPaymentStrategy,
        payos_strategy_1.PayOSPaymentStrategy,
        stripe_strategy_1.StripePaymentStrategy])
], PaymentService);
//# sourceMappingURL=payment.service.js.map