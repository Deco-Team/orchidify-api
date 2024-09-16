import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
  IsUrl,
  MaxLength
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { GardenStatus } from '@common/contracts/constant'

export class BaseGardenDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  _id: string

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  description: string

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  address: string

  @ApiProperty({ type: String, isArray: true })
  @IsArray()
  @IsUrl({}, { each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(8)
  images: string[]

  @ApiProperty({ type: String, enum: GardenStatus })
  @IsEnum(GardenStatus)
  status: GardenStatus

  @ApiProperty({ type: String })
  @IsMongoId()
  gardenManagerId: string

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date
}
