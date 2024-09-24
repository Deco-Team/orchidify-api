import { Controller, Get, UseGuards, Inject, Put, Body, Post, Query, Param, Patch } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger'
import * as _ from 'lodash'

import {
  ErrorResponse,
  IDDataResponse,
  IDResponse,
  PaginationQuery,
  SuccessDataResponse,
  SuccessResponse
} from '@common/contracts/dto'
import { Roles } from '@auth/decorators/roles.decorator'
import { StaffStatus, RecruitmentStatus, UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import { Pagination, PaginationParams } from '@common/decorators/pagination.decorator'
import { QueryStaffDto, StaffDetailDataResponse, StaffListDataResponse } from '@staff/dto/view-staff.dto'
import { IUserTokenService } from '@auth/services/user-token.service'
import { Types } from 'mongoose'
import { IStaffService } from '@staff/services/staff.service'
import { CreateStaffDto } from '@staff/dto/create-staff.dto'
import { UpdateStaffDto } from '@staff/dto/update-staff.dto'
import { IRecruitmentService } from '@recruitment/services/recruitment.service'
import { STAFF_DETAIL_PROJECTION } from '@staff/contracts/constant'

@ApiTags('Staff')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Controller()
export class ManagementStaffController {
  constructor(
    @Inject(IStaffService)
    private readonly staffService: IStaffService,
    @Inject(IUserTokenService)
    private readonly userTokenService: IUserTokenService,
    @Inject(IRecruitmentService)
    private readonly recruitmentService: IRecruitmentService
  ) {}

  @ApiOperation({
    summary: `[${UserRole.ADMIN}] View Staff List`
  })
  @ApiQuery({ type: PaginationQuery })
  @ApiOkResponse({ type: StaffListDataResponse })
  @Roles(UserRole.ADMIN)
  @Get()
  async list(@Pagination() pagination: PaginationParams, @Query() queryStaffDto: QueryStaffDto) {
    return await this.staffService.list(pagination, queryStaffDto)
  }

  @ApiOperation({
    summary: `[${UserRole.ADMIN}] View Staff Detail`
  })
  @ApiOkResponse({ type: StaffDetailDataResponse })
  @ApiErrorResponse([Errors.STAFF_NOT_FOUND])
  @Roles(UserRole.ADMIN)
  @Get(':id([0-9a-f]{24})')
  async getDetail(@Param('id') staffId: string) {
    const staff = await this.staffService.findById(staffId, STAFF_DETAIL_PROJECTION)

    if (!staff || staff.role !== UserRole.STAFF) throw new AppException(Errors.STAFF_NOT_FOUND)
    return staff
  }

  @ApiOperation({
    summary: `[${UserRole.ADMIN}] Add Staff`
  })
  @ApiCreatedResponse({ type: IDDataResponse })
  @ApiErrorResponse([Errors.EMAIL_ALREADY_EXIST])
  @Roles(UserRole.ADMIN)
  @Post()
  async create(@Body() createStaffDto: CreateStaffDto) {
    const existedStaff = await this.staffService.findByEmail(createStaffDto.email)
    if (existedStaff) throw new AppException(Errors.EMAIL_ALREADY_EXIST)
      
    const staff = await this.staffService.create(createStaffDto)
    return new IDResponse(staff._id)
  }

  @ApiOperation({
    summary: `[${UserRole.ADMIN}] Update Staff`
  })
  @ApiOkResponse({ type: SuccessDataResponse })
  @ApiErrorResponse([Errors.STAFF_NOT_FOUND])
  @Roles(UserRole.ADMIN)
  @Put(':id([0-9a-f]{24})')
  async update(@Param('id') staffId: string, @Body() updateStaffDto: UpdateStaffDto) {
    const staff = await this.staffService.update({ _id: staffId, role: UserRole.STAFF }, updateStaffDto)

    if (!staff) throw new AppException(Errors.STAFF_NOT_FOUND)
    return new SuccessResponse(true)
  }

  @ApiOperation({
    summary: `[${UserRole.ADMIN}] Deactivate Staff`
  })
  @ApiOkResponse({ type: SuccessDataResponse })
  @ApiErrorResponse([Errors.STAFF_IS_ASSIGNED_TO_RECRUITMENT_PROCESS])
  @Roles(UserRole.ADMIN)
  @Patch('/:id([0-9a-f]{24})/deactivate')
  async deactivate(@Param('id') staffId: string) {
    // BR-69: If the staff is assigned to a recruitment process, the staff cannot be deactivated.
    const recruitments = await this.recruitmentService.findByHandledByAndStatus(staffId, [
      RecruitmentStatus.INTERVIEWING,
      RecruitmentStatus.SELECTED
    ])
    if (recruitments.length > 0) {
      throw new AppException(Errors.STAFF_IS_ASSIGNED_TO_RECRUITMENT_PROCESS)
    }

    await Promise.all([
      this.staffService.update(
        {
          _id: staffId,
          role: UserRole.STAFF
        },
        { status: StaffStatus.INACTIVE }
      ),
      this.userTokenService.clearAllRefreshTokensOfUser(new Types.ObjectId(staffId), UserRole.STAFF)
    ])
    return new SuccessResponse(true)
  }

  @ApiOperation({
    summary: `[${UserRole.ADMIN}] Activate Staff`
  })
  @ApiOkResponse({ type: SuccessDataResponse })
  @Roles(UserRole.ADMIN)
  @Patch('/:id([0-9a-f]{24})/active')
  async activate(@Param('id') staffId: string) {
    await this.staffService.update(
      {
        _id: staffId,
        role: UserRole.STAFF
      },
      { status: StaffStatus.ACTIVE }
    )
    return new SuccessResponse(true)
  }
}
