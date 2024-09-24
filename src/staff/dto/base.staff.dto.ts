import { IsEnum, IsMongoId, IsNotEmpty, IsString, IsUrl, MaxLength, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { StaffStatus, UserRole } from '@common/contracts/constant'
import { EmailDto } from '@common/dto/email.dto'

export class BaseStaffDto extends EmailDto {
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
  staffCode: string

  @ApiProperty({ type: String })
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  password: string

  @ApiProperty({ type: String })
  @IsUrl()
  idCardPhoto: string

  @ApiProperty({ type: String, enum: StaffStatus })
  @IsEnum(StaffStatus)
  status: StaffStatus

  @ApiProperty({ type: String, enum: [UserRole.ADMIN, UserRole.STAFF] })
  @IsEnum([UserRole.ADMIN, UserRole.STAFF])
  role: StaffStatus

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date
}
