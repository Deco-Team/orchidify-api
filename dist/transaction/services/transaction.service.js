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
var TransactionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = exports.ITransactionService = void 0;
const common_1 = require("@nestjs/common");
const transaction_repository_1 = require("../repositories/transaction.repository");
const constant_1 = require("../../common/contracts/constant");
const app_logger_service_1 = require("../../common/services/app-logger.service");
const constant_2 = require("../contracts/constant");
exports.ITransactionService = Symbol('ITransactionService');
let TransactionService = TransactionService_1 = class TransactionService {
    constructor(transactionRepository) {
        this.transactionRepository = transactionRepository;
        this.appLogger = new app_logger_service_1.AppLogger(TransactionService_1.name);
    }
    async create(createTransactionDto, options) {
        return await this.transactionRepository.create(createTransactionDto, options);
    }
    async findById(transactionId, projection, populates) {
        const transaction = await this.transactionRepository.findOne({
            conditions: {
                _id: transactionId
            },
            projection,
            populates
        });
        return transaction;
    }
    async update(conditions, payload, options) {
        return await this.transactionRepository.findOneAndUpdate(conditions, payload, options);
    }
    async list(pagination, queryTransactionDto, projection = constant_2.TRANSACTION_LIST_PROJECTION, populate) {
        const { type, paymentMethod, status, fromAmount, toAmount } = queryTransactionDto;
        const filter = {
            status: {
                $in: [constant_1.TransactionStatus.CAPTURED, constant_1.TransactionStatus.ERROR, constant_1.TransactionStatus.CANCELED]
            }
        };
        const validType = type?.filter((type) => [constant_2.TransactionType.PAYMENT, constant_2.TransactionType.PAYOUT].includes(type));
        if (validType?.length > 0) {
            filter['type'] = {
                $in: validType
            };
        }
        const validPaymentMethod = paymentMethod?.filter((paymentMethod) => [constant_2.PaymentMethod.STRIPE, constant_2.PaymentMethod.MOMO].includes(paymentMethod));
        if (validPaymentMethod?.length > 0) {
            filter['paymentMethod'] = {
                $in: validPaymentMethod
            };
        }
        const validStatus = status?.filter((status) => [constant_1.TransactionStatus.CAPTURED, constant_1.TransactionStatus.ERROR, constant_1.TransactionStatus.CANCELED].includes(status));
        if (validStatus?.length > 0) {
            filter['status'] = {
                $in: validStatus
            };
        }
        if (fromAmount !== undefined && toAmount !== undefined) {
            filter['amount'] = {
                $gte: fromAmount,
                $lte: toAmount
            };
        }
        return this.transactionRepository.model.paginate(filter, {
            ...pagination,
            projection,
            populate
        });
    }
    async viewReportTransactionByDate({ fromDate, toDate }) {
        return this.transactionRepository.model.aggregate([
            {
                $match: {
                    status: constant_1.TransactionStatus.CAPTURED,
                    updatedAt: {
                        $gte: fromDate,
                        $lte: toDate
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$updatedAt'
                        }
                    },
                    paymentAmount: {
                        $sum: {
                            $switch: {
                                branches: [
                                    {
                                        case: {
                                            $eq: ['$type', constant_2.TransactionType.PAYMENT]
                                        },
                                        then: '$amount'
                                    }
                                ],
                                default: 0
                            }
                        }
                    },
                    payoutAmount: {
                        $sum: {
                            $switch: {
                                branches: [
                                    {
                                        case: {
                                            $eq: ['$type', constant_2.TransactionType.PAYOUT]
                                        },
                                        then: '$amount'
                                    }
                                ],
                                default: 0
                            }
                        }
                    }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);
    }
    async viewInstructorReportTransactionByDate({ fromDate, toDate, instructorId }) {
        return this.transactionRepository.model.aggregate([
            {
                $match: {
                    status: constant_1.TransactionStatus.CAPTURED,
                    type: constant_2.TransactionType.PAYOUT,
                    'creditAccount.userId': instructorId,
                    updatedAt: {
                        $gte: fromDate,
                        $lte: toDate
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$updatedAt'
                        }
                    },
                    payoutAmount: {
                        $sum: {
                            $switch: {
                                branches: [
                                    {
                                        case: {
                                            $eq: ['$type', constant_2.TransactionType.PAYOUT]
                                        },
                                        then: '$amount'
                                    }
                                ],
                                default: 0
                            }
                        }
                    }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);
    }
    async viewInstructorReportTransactionCountByMonth({ fromDate, toDate, instructorId }) {
        return this.transactionRepository.model.aggregate([
            {
                $match: {
                    status: constant_1.TransactionStatus.CAPTURED,
                    type: constant_2.TransactionType.PAYOUT,
                    'creditAccount.userId': instructorId,
                    updatedAt: {
                        $gte: fromDate,
                        $lte: toDate
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m',
                            date: '$updatedAt'
                        }
                    },
                    quantity: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ]);
    }
};
exports.TransactionService = TransactionService;
exports.TransactionService = TransactionService = TransactionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(transaction_repository_1.ITransactionRepository)),
    __metadata("design:paramtypes", [Object])
], TransactionService);
//# sourceMappingURL=transaction.service.js.map