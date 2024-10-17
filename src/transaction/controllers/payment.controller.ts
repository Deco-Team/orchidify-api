import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import * as _ from 'lodash'
import { IPaymentService } from '@src/transaction/services/payment.service'
import { PaymentMethod } from '@src/transaction/contracts/constant'

@ApiTags('Payment')
@ApiBearerAuth()
@Controller('payment')
export class PaymentController {
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
    console.log('Handling MOMO webhook', JSON.stringify(momoPaymentResponseDto))
    this.paymentService.setStrategy(PaymentMethod.MOMO)

    //1. Validate signature with other data
    const result = this.paymentService.verifyPaymentWebhookData(momoPaymentResponseDto)
    if (!result) return false

    //2. Process webhook
    this.paymentService.setStrategy(PaymentMethod.MOMO)
    return this.paymentService.processWebhook(momoPaymentResponseDto)
  }
}
