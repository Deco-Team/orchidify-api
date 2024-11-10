import { IPaymentService } from '@src/transaction/services/payment.service';
export declare class PaymentController {
    private readonly paymentService;
    private readonly logger;
    constructor(paymentService: IPaymentService);
    webhookMomo(momoPaymentResponseDto: any): false | Promise<any>;
    webhookStripe(req: Request, body: any): Promise<any>;
}
