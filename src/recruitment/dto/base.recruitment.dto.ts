import { IsBoolean, IsEnum, IsMongoId, IsOptional, IsString, IsUrl } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { RecruitmentStatus, UserRole } from '@common/contracts/constant'
import { Types } from 'mongoose'
import { Staff } from '@staff/schemas/staff.schema'

export class ApplicationInfoDto {
  @ApiProperty({ type: String })
  name: string

  @ApiProperty({ type: String })
  email: string

  @ApiProperty({ type: String })
  phone: string

  @ApiProperty({ type: String })
  cv: string

  @ApiProperty({ type: String })
  note: string
}

export class RecruitmentStatusHistoryDto {
  @ApiProperty({ type: String, enum: RecruitmentStatus })
  status: RecruitmentStatus

  @ApiProperty({ type: Date })
  timestamp: Date

  @ApiProperty({ type: String })
  userId: Types.ObjectId

  @ApiProperty({ type: String, enum: UserRole })
  userRole: UserRole
}

export class BaseRecruitmentDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  _id: string

  @ApiProperty({ type: ApplicationInfoDto })
  applicationInfo: ApplicationInfoDto

  @ApiProperty({ type: String })
  @IsUrl()
  meetingUrl: string

  @ApiProperty({ type: String })
  @Í()
  meetingDate: string

  @ApiProperty({ type: String, enum: RecruitmentStatus })
  @IsEnum(RecruitmentStatus)
  status: RecruitmentStatus

  @ApiProperty({ type: RecruitmentStatusHistoryDto, isArray: true })
  histories: RecruitmentStatusHistoryDto[]

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  rejectReason: string

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @IsBoolean()
  isInstructorAdded: boolean

  @ApiProperty({ type: String })
  @IsMongoId()
  handledBy: Types.ObjectId | Staff

  @ApiProperty({ type: Date })
  createdAt: Date

  @ApiProperty({ type: Date })
  updatedAt: Date
}
