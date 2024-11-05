import { PaginateModel } from 'mongoose'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { PayoutRequest, PayoutRequestDocument } from '@src/payout-request/schemas/payout-request.schema'
import { AbstractRepository } from '@common/repositories'

export const IPayoutRequestRepository = Symbol('IPayoutRequestRepository')

export interface IPayoutRequestRepository extends AbstractRepository<PayoutRequestDocument> {}

@Injectable()
export class PayoutRequestRepository extends AbstractRepository<PayoutRequestDocument> implements IPayoutRequestRepository {
  constructor(@InjectModel(PayoutRequest.name) model: PaginateModel<PayoutRequestDocument>) {
    super(model)
  }
}
