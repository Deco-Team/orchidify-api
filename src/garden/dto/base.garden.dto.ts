import { IsEnum, IsMongoId } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { GardenStatus } from '@common/contracts/constant'

export class BaseGardenDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  _id: string

  @ApiProperty({ type: String })
  // @IsNotEmpty()
  // @IsString()
  // @MaxLength(50)
  name: string

  @ApiProperty({ type: String })
  description: string

  @ApiProperty({ type: String })
  address: string

  @ApiProperty({ type: String, isArray: true })
  images: string[]

  @ApiProperty({ type: String, enum: GardenStatus })
  @IsEnum(GardenStatus)
  status: GardenStatus

  @ApiProperty({ type: String })
  gardenManagerId: String

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date
}
