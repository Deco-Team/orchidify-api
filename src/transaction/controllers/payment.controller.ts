import { Body, Controller, HttpCode, HttpStatus, Inject, Logger, Post, Req } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'
import { IPaymentService } from '@src/transaction/services/payment.service'
import { PaymentMethod } from '@src/transaction/contracts/constant'

@ApiTags('Payment')
@ApiBearerAuth()
@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name)
  constructor(
    @Inject(IPaymentService)
    private readonly paymentService: IPaymentService
  ) {}

  // @ApiOperation({
  //   summary: 'Get transaction list of payment'
  // })
  // @Get()
  // @Roles(UserRole.ADMIN)
  // @UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
  // @ApiOkResponse({ type: PaymentPaginateResponseDto })
  // @ApiQuery({ type: PaginationQuery })
  // paginate(@Pagination() paginationParams: PaginationParams) {
  //   return this.paymentService.getPaymentList({}, paginationParams)
  // }

  @ApiOperation({
    summary: 'Webhook Handler for Instant Payment Notification (MOMO)'
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('webhook/momo')
  webhookMomo(@Body() momoPaymentResponseDto) {
    this.logger.log('Handling MOMO webhook', JSON.stringify(momoPaymentResponseDto))
    this.paymentService.setStrategy(PaymentMethod.MOMO)

    //1. Validate signature with other data
    const result = this.paymentService.verifyPaymentWebhookData(momoPaymentResponseDto)
    if (!result) return false

    //2. Process webhook
    this.paymentService.setStrategy(PaymentMethod.MOMO)
    return this.paymentService.processWebhook(momoPaymentResponseDto)
  }

  @ApiOperation({
    summary: 'Webhook (STRIPE)'
  })
  @HttpCode(HttpStatus.OK)
  @Post('webhook/stripe')
  async webhookStripe(@Req() req: Request, @Body() body) {
    this.logger.log('Handling STRIPE webhook...')
    this.paymentService.setStrategy(PaymentMethod.STRIPE)
    // Get the signature sent by Stripe
    const signature = req.headers['stripe-signature']

    //1. Validate signature with other data
    const event = await this.paymentService.verifyPaymentWebhookData({ rawBody: body, signature })

    //2. Process webhook
    this.paymentService.setStrategy(PaymentMethod.STRIPE)
    return this.paymentService.processWebhook(event)
  }
}
