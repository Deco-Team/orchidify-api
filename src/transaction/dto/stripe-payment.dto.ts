import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { DataResponse } from '@common/contracts/openapi-builder'
import Stripe from 'stripe'

export class CreateStripePaymentDto {
  @ApiProperty()
  customerEmail: string

  @ApiProperty()
  amount: number

  @ApiProperty()
  description: string

  @ApiProperty()
  metadata: Stripe.MetadataParam
}
export class CreateStripePaymentResponse {
  @ApiProperty()
  id: string
  @ApiProperty()
  paymentIntent: string
  @ApiProperty()
  ephemeralKey: string
  @ApiProperty()
  customer: string
  @ApiProperty()
  publishableKey: number
}
export class CreateStripePaymentDataResponse extends DataResponse(CreateStripePaymentResponse) {}

export class QueryStripePaymentDto {
  @ApiProperty()
  id: string
}
export class StripePaymentResponseDto {
  @ApiProperty()
  amount: number
}

export class RefundStripePaymentDto {
  @ApiProperty()
  id: string

  @ApiPropertyOptional({ type: Number })
  amount?: number

  @ApiPropertyOptional({ type: Object })
  metadata?: Stripe.Emptyable<Stripe.MetadataParam>;
}

// export class RefundStripePaymentResponseDto {
//   @ApiProperty()
//   partnerCode: string
//   @ApiProperty()
//   orderId: string
//   @ApiProperty()
//   requestId: string
//   @ApiProperty()
//   amount: number
//   @ApiProperty()
//   transId: number
//   @ApiProperty()
//   resultCode: number
//   @ApiProperty()
//   message: string
//   @ApiProperty()
//   responseTime: number
// }
