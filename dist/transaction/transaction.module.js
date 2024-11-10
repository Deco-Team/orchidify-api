"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const payment_controller_1 = require("./controllers/payment.controller");
const transaction_schema_1 = require("./schemas/transaction.schema");
const payment_service_1 = require("./services/payment.service");
const transaction_repository_1 = require("./repositories/transaction.repository");
const axios_1 = require("@nestjs/axios");
const zalopay_strategy_1 = require("./strategies/zalopay.strategy");
const momo_strategy_1 = require("./strategies/momo.strategy");
const payos_strategy_1 = require("./strategies/payos.strategy");
const transaction_service_1 = require("./services/transaction.service");
const learner_module_1 = require("../learner/learner.module");
const stripe_strategy_1 = require("./strategies/stripe.strategy");
const transaction_controller_1 = require("./controllers/transaction.controller");
let TransactionModule = class TransactionModule {
};
exports.TransactionModule = TransactionModule;
exports.TransactionModule = TransactionModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: transaction_schema_1.Transaction.name, schema: transaction_schema_1.TransactionSchema }]),
            axios_1.HttpModule,
            learner_module_1.LearnerModule
        ],
        controllers: [payment_controller_1.PaymentController, transaction_controller_1.TransactionController],
        providers: [
            {
                provide: payment_service_1.IPaymentService,
                useClass: payment_service_1.PaymentService
            },
            {
                provide: transaction_service_1.ITransactionService,
                useClass: transaction_service_1.TransactionService
            },
            {
                provide: transaction_repository_1.ITransactionRepository,
                useClass: transaction_repository_1.TransactionRepository
            },
            zalopay_strategy_1.ZaloPayPaymentStrategy,
            momo_strategy_1.MomoPaymentStrategy,
            payos_strategy_1.PayOSPaymentStrategy,
            stripe_strategy_1.StripePaymentStrategy
        ],
        exports: [
            {
                provide: payment_service_1.IPaymentService,
                useClass: payment_service_1.PaymentService
            },
            {
                provide: transaction_service_1.ITransactionService,
                useClass: transaction_service_1.TransactionService
            },
            {
                provide: transaction_repository_1.ITransactionRepository,
                useClass: transaction_repository_1.TransactionRepository
            }
        ]
    })
], TransactionModule);
//# sourceMappingURL=transaction.module.js.map