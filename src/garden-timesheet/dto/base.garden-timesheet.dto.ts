import { IsArray, IsDateString, IsEnum, IsMongoId, ValidateNested } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { GardenTimesheetStatus } from '@common/contracts/constant'
import { Type } from 'class-transformer'
import { BaseSlotDto } from './slot.dto'
import { Types } from 'mongoose'

export class BaseGardenTimesheetDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  _id: string

  @ApiProperty({ type: Date, example: '2024-12-12' })
  @IsDateString({ strict: true })
  date: Date

  @ApiProperty({ type: String, enum: GardenTimesheetStatus })
  @IsEnum(GardenTimesheetStatus)
  status: GardenTimesheetStatus

  @ApiProperty({ type: String })
  gardenId: string | Types.ObjectId

  @ApiProperty({ type: BaseSlotDto, isArray: true })
  @IsArray()
  @Type(() => BaseSlotDto)
  @ValidateNested({ each: true })
  slots: BaseSlotDto[]

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date
}
