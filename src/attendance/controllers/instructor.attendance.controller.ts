import { Controller, Get, UseGuards, Inject, Param, Req, Post, Body } from '@nestjs/common'
import * as moment from 'moment-timezone'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger'
import * as _ from 'lodash'

import { ErrorResponse, SuccessDataResponse, SuccessResponse } from '@common/contracts/dto'
import { Roles } from '@auth/decorators/roles.decorator'
import { AttendanceStatus, UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { RolesGuard } from '@auth/guards/roles.guard'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'
import { ApiErrorResponse } from '@common/decorators/api-response.decorator'
import { IAttendanceService } from '@attendance/services/attendance.service'
import { AttendanceListDataResponse } from '@attendance/dto/view-attendance.dto'
import { TakeMultipleAttendanceDto } from '@attendance/dto/take-attendance.dto'
import { IGardenTimesheetService } from '@garden-timesheet/services/garden-timesheet.service'
import { Types } from 'mongoose'
import { ILearnerClassService } from '@class/services/learner-class.service'
import { ATTENDANCE_LIST_PROJECTION } from '@attendance/contracts/constant'
import { VN_TIMEZONE } from '@src/config'

@ApiTags('Attendance - Instructor')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN, RolesGuard)
@Roles(UserRole.INSTRUCTOR)
@Controller('instructor')
export class InstructorAttendanceController {
  constructor(
    @Inject(IAttendanceService)
    private readonly attendanceService: IAttendanceService,
    @Inject(IGardenTimesheetService)
    private readonly gardenTimesheetService: IGardenTimesheetService,
    @Inject(ILearnerClassService)
    private readonly learnerClassService: ILearnerClassService
  ) {}

  @ApiOperation({
    summary: `View Attendance List`
  })
  @ApiOkResponse({ type: AttendanceListDataResponse })
  @ApiErrorResponse([Errors.SLOT_NOT_FOUND])
  @Get(':slotId([0-9a-f]{24})')
  async list(@Req() req, @Param('slotId') slotId: string) {
    const { _id: instructorId } = _.get(req, 'user')

    const gardenTimesheet = await this.gardenTimesheetService.findOneBy({
      'slots._id': new Types.ObjectId(slotId),
      'slots.instructorId': new Types.ObjectId(instructorId)
    })
    if (!gardenTimesheet) throw new AppException(Errors.SLOT_NOT_FOUND)

    const slot = gardenTimesheet?.slots.find((slot) => slot._id.toString() === slotId)
    if (!slot) throw new AppException(Errors.SLOT_NOT_FOUND)

    if (!slot.hasTakenAttendance) {
      // fetch learners class
      const learnerClasses = await this.learnerClassService.findMany(
        {
          classId: slot.classId
        },
        ['-_id', 'learnerId'],
        [
          {
            path: 'learner',
            select: ['_id', 'name', 'avatar']
          }
        ]
      )
      return {
        docs: learnerClasses.map((learnerClass) => ({
          ...learnerClass.toObject(),
          status: AttendanceStatus.NOT_YET
        })),
        slot
      }
    } else {
      // fetch attendances
      const attendances = await this.attendanceService.findMany(
        {
          slotId: slot._id
        },
        ATTENDANCE_LIST_PROJECTION,
        [
          {
            path: 'learner',
            select: ['_id', 'name', 'avatar']
          }
        ]
      )
      return { docs: attendances, slot }
    }
  }

  @ApiOperation({
    summary: `Take Attendance`
  })
  @ApiCreatedResponse({ type: SuccessDataResponse })
  @ApiErrorResponse([
    Errors.SLOT_NOT_FOUND,
    Errors.NUMBER_OF_ATTENDANCES_INVALID,
    Errors.NOT_TIME_TO_TAKE_ATTENDANCE,
    Errors.TAKE_ATTENDANCE_IS_OVER
  ])
  @Post(':slotId([0-9a-f]{24})')
  async takeAttendance(
    @Req() req,
    @Param('slotId') slotId: string,
    @Body() takeMultipleAttendanceDto: TakeMultipleAttendanceDto
  ) {
    const { _id: instructorId } = _.get(req, 'user')
    const { attendances } = takeMultipleAttendanceDto

    const gardenTimesheet = await this.gardenTimesheetService.findOneBy({
      'slots._id': new Types.ObjectId(slotId),
      'slots.instructorId': new Types.ObjectId(instructorId)
    })
    if (!gardenTimesheet) throw new AppException(Errors.SLOT_NOT_FOUND)

    const slot = gardenTimesheet?.slots.find((slot) => slot._id.toString() === slotId)
    if (!slot) throw new AppException(Errors.SLOT_NOT_FOUND)

    // const nowMoment = moment().tz(VN_TIMEZONE)
    // // BR-46: Instructors can take attendance when the slots start.
    // const startOfSlot = moment(slot.start).tz(VN_TIMEZONE)
    // if (nowMoment.isBefore(startOfSlot)) throw new AppException(Errors.NOT_TIME_TO_TAKE_ATTENDANCE)

    // // BR-47: Instructors can only update the attendance until the end of the day
    // const endOfDate = startOfSlot.clone().endOf('date')
    // if (nowMoment.isAfter(endOfDate)) throw new AppException(Errors.TAKE_ATTENDANCE_IS_OVER)

    // check learner in class
    const learnerClasses = await this.learnerClassService.findMany(
      {
        classId: slot.classId
      },
      ['_id', 'learnerId']
    )
    const classLearnerIds = learnerClasses.map((learnerClass) => learnerClass.learnerId.toString())
    const attendanceLearners = attendances.filter((attendance) => classLearnerIds.includes(attendance.learnerId))
    const attendanceLearnersSet = new Set([
      ...attendanceLearners.map((attendanceLearner) => attendanceLearner.learnerId)
    ])

    if (attendanceLearners.length !== attendanceLearnersSet.size)
      throw new AppException(Errors.NUMBER_OF_ATTENDANCES_INVALID)

    if (!slot.hasTakenAttendance) {
      if (attendanceLearners.length !== classLearnerIds.length)
        throw new AppException(Errors.NUMBER_OF_ATTENDANCES_INVALID)
      await this.attendanceService.bulkWrite(slotId, attendanceLearners)

      // update slot hasTakenAttendance true
      await this.gardenTimesheetService.update(
        { 'slots._id': new Types.ObjectId(slotId) },
        { $set: { 'slots.$.hasTakenAttendance': true } }
      )
    } else {
      // take attendance just for updated learners
      await this.attendanceService.bulkWrite(slotId, attendanceLearners)
    }

    return new SuccessResponse(true)
  }
}
