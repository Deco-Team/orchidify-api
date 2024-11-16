import {
  IsMongoId,
  IsNotEmpty,
  IsString} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class BaseNotificationDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  _id: string

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  title: string

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  body: string

  @ApiProperty({ type: Object })
  data: Object

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date
}
