import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { DataResponse, PaginateResponse } from '@common/contracts/openapi-builder'
import { IsOptional, IsString, MaxLength } from 'class-validator'
import { GardenStatus } from '@common/contracts/constant'
import { Transform } from 'class-transformer'
import { BaseGardenDto } from '@garden/dto/base.garden.dto'
import { GARDEN_DETAIL_PROJECTION, GARDEN_LIST_PROJECTION } from '@garden/contracts/constant'
import { BaseGardenManagerDto } from '@garden-manager/dto/base.garden-manager.dto'

export class QueryGardenDto {
  @ApiPropertyOptional({
    description: 'Name to search'
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name: string

  @ApiPropertyOptional({
    description: 'Address to search'
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  address: string

  @ApiPropertyOptional({
    enum: GardenStatus,
    isArray: true
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  status: GardenStatus[]
}

class GardenListItemResponse extends PickType(BaseGardenDto, GARDEN_LIST_PROJECTION) {
  @ApiProperty({ type: PickType(BaseGardenManagerDto, ['_id', 'name']) })
  gardenManager: BaseGardenManagerDto
}
class GardenListResponse extends PaginateResponse(GardenListItemResponse) {}
export class GardenListDataResponse extends DataResponse(GardenListResponse) {}

class GardenDetailResponse extends PickType(BaseGardenDto, GARDEN_DETAIL_PROJECTION) {
  @ApiProperty({ type: PickType(BaseGardenManagerDto, ['_id', 'name']) })
  gardenManager: BaseGardenManagerDto
}
export class GardenDetailDataResponse extends DataResponse(GardenDetailResponse) {}
