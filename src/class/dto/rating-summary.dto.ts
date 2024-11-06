import { ApiProperty } from '@nestjs/swagger'

export class BaseRatingTotalCountByRateDto {
  constructor() {
    this['1'] = 0
    this['2'] = 0
    this['3'] = 0
    this['4'] = 0
    this['5'] = 0
  }

  @ApiProperty({ type: Number })
  1: number

  @ApiProperty({ type: Number })
  2: number

  @ApiProperty({ type: Number })
  3: number

  @ApiProperty({ type: Number })
  4: number

  @ApiProperty({ type: Number })
  5: number
}

export class BaseRatingSummaryDto {
  constructor(totalSum: number, totalCount: number, totalCountByRate: BaseRatingTotalCountByRateDto) {
    this.totalSum = totalSum
    this.totalCount = totalCount
    this.totalCountByRate = totalCountByRate
  }

  @ApiProperty({ type: Number })
  totalSum: number

  @ApiProperty({ type: Number })
  totalCount: number

  @ApiProperty({ type: BaseRatingTotalCountByRateDto })
  totalCountByRate: BaseRatingTotalCountByRateDto
}
