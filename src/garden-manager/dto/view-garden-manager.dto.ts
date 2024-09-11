import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { BaseGardenManagerDto } from './base.garden-manager.dto'
import { DataResponse, PaginateResponse } from '@common/contracts/openapi-builder'
import { GARDEN_MANAGER_LIST_PROJECTION } from '@garden-manager/contracts/constant'
import { IsOptional, IsString, MaxLength } from 'class-validator'
import { GardenManagerStatus } from '@common/contracts/constant'
import { Transform } from 'class-transformer'
import { BaseGardenDto } from '@garden/dto/base.garden.dto'

export class QueryGardenManagerDto {
  @ApiPropertyOptional({
    description: 'Name to search'
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  name: string

  @ApiPropertyOptional({
    description: 'Email to search'
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  email: string

  @ApiPropertyOptional({
    enum: GardenManagerStatus,
    isArray: true
  })
  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : Array(value)))
  status: GardenManagerStatus[]
}

class GardenDetailResponse extends PickType(BaseGardenDto, ['_id', 'name']) {}

class GardenManagerDetailResponse extends PickType(BaseGardenManagerDto, GARDEN_MANAGER_LIST_PROJECTION) {
  @ApiProperty({ type: GardenDetailResponse, isArray: true })
  gardens: GardenDetailResponse[]
}

class GardenManagerListResponse extends PaginateResponse(GardenManagerDetailResponse) {}

export class GardenManagerListDataResponse extends DataResponse(GardenManagerListResponse) {}

export class GardenManagerDetailDataResponse extends DataResponse(GardenManagerDetailResponse) {}
