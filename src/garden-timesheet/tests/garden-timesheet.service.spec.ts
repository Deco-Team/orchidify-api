import { Test, TestingModule } from '@nestjs/testing'
import { Types } from 'mongoose'
import * as moment from 'moment-timezone'
import { GardenTimesheetService, IGardenTimesheetService } from '../services/garden-timesheet.service'
import { IGardenTimesheetRepository } from '../repositories/garden-timesheet.repository'
import { IGardenRepository } from '@garden/repositories/garden.repository'
import { IClassService } from '@class/services/class.service'
import { ILearnerClassService } from '@class/services/learner-class.service'
import { HelperService } from '@common/services/helper.service'
import {
  GardenStatus,
  GardenTimesheetStatus,
  SlotNumber,
  SlotStatus,
  TimesheetType,
  Weekday
} from '@common/contracts/constant'
import { VN_TIMEZONE } from '@src/config'
import { GardenTimesheet, GardenTimesheetDocument } from '@garden-timesheet/schemas/garden-timesheet.schema'
import { GardenDocument } from '@garden/schemas/garden.schema'
import { Course } from '@course/schemas/course.schema'

describe('GardenTimesheetService', () => {
  let service: IGardenTimesheetService
  let gardenTimesheetRepository: IGardenTimesheetRepository
  let gardenRepository: IGardenRepository
  let classService: IClassService
  let learnerClassService: ILearnerClassService
  let helperService: HelperService

  const mockGardenId = new Types.ObjectId()
  const mockInstructorId = new Types.ObjectId()
  const mockClassId = new Types.ObjectId()
  const mockLearnerId = new Types.ObjectId()
  const mockDate = moment().tz(VN_TIMEZONE).startOf('date').toDate()

  const mockGardenTimesheet = {
    _id: new Types.ObjectId(),
    gardenId: mockGardenId,
    date: mockDate,
    status: GardenTimesheetStatus.ACTIVE,
    gardenMaxClass: 2,
    slots: [
      {
        _id: new Types.ObjectId(),
        slotNumber: SlotNumber.ONE,
        start: moment(mockDate).add(7, 'hour').toDate(),
        end: moment(mockDate).add(9, 'hour').toDate(),
        status: SlotStatus.NOT_AVAILABLE,
        instructorId: mockInstructorId,
        classId: mockClassId
      }
    ]
  } as unknown as GardenTimesheetDocument

  const mockGarden = {
    _id: mockGardenId,
    status: GardenStatus.ACTIVE,
    maxClass: 2
  } as unknown as GardenDocument

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GardenTimesheetService,
        {
          provide: IGardenTimesheetRepository,
          useValue: {
            findOne: jest.fn(),
            findMany: jest.fn(),
            findOneAndUpdate: jest.fn(),
            updateMany: jest.fn(),
            model: {
              insertMany: jest.fn(),
              aggregate: jest.fn()
            }
          }
        },
        {
          provide: IGardenRepository,
          useValue: {
            findOne: jest.fn(),
            findMany: jest.fn()
          }
        },
        {
          provide: IClassService,
          useValue: {
            findById: jest.fn()
          }
        },
        {
          provide: ILearnerClassService,
          useValue: {
            findMany: jest.fn()
          }
        },
        {
          provide: HelperService,
          useValue: {
            validateWeekdays: jest.fn()
          }
        }
      ]
    }).compile()

    service = module.get<IGardenTimesheetService>(GardenTimesheetService)
    gardenTimesheetRepository = module.get(IGardenTimesheetRepository)
    gardenRepository = module.get(IGardenRepository)
    classService = module.get(IClassService)
    learnerClassService = module.get(ILearnerClassService)
    helperService = module.get(HelperService)
  })

  describe('viewGardenTimesheetList', () => {
    const queryDto = {
      gardenId: mockGardenId.toString(),
      date: mockDate,
      type: TimesheetType.DAY
    }

    it('should return garden timesheet list successfully', async () => {
      jest.spyOn(gardenTimesheetRepository, 'findOne').mockResolvedValue(mockGardenTimesheet)
      jest.spyOn(gardenTimesheetRepository, 'findMany').mockResolvedValue([mockGardenTimesheet])

      const result = await service.viewGardenTimesheetList(queryDto, mockGarden)

      expect(result).toBeDefined()
      expect(result.length).toBe(1)
    })

    it('should generate timesheet if not exists', async () => {
      jest.spyOn(gardenTimesheetRepository, 'findOne').mockResolvedValue(null)
      jest.spyOn(gardenTimesheetRepository.model, 'insertMany').mockResolvedValue([])
      jest.spyOn(gardenTimesheetRepository, 'findMany').mockResolvedValue([mockGardenTimesheet])

      const result = await service.viewGardenTimesheetList(queryDto, mockGarden)

      expect(gardenTimesheetRepository.model.insertMany).toHaveBeenCalled()
      expect(result).toBeDefined()
    })
  })

  describe('viewTeachingTimesheet', () => {
    const queryDto = {
      date: mockDate,
      type: TimesheetType.DAY,
      instructorId: mockInstructorId.toString()
    }

    it('should return teaching timesheet list successfully', async () => {
      jest.spyOn(gardenTimesheetRepository, 'findMany').mockResolvedValue([mockGardenTimesheet])

      const result = await service.viewTeachingTimesheet(queryDto)

      expect(result).toBeDefined()
      expect(result.length).toBe(1)
    })
  })

  describe('viewAvailableTime', () => {
    const queryDto = {
      startDate: mockDate,
      duration: 4,
      weekdays: [Weekday.MONDAY, Weekday.THURSDAY],
      instructorId: mockInstructorId
    }

    it('should return available time slots successfully', async () => {
      jest.spyOn(gardenRepository, 'findMany').mockResolvedValue([mockGarden])
      jest.spyOn(gardenTimesheetRepository, 'findMany').mockResolvedValue([])
      jest.spyOn(gardenTimesheetRepository.model, 'aggregate').mockResolvedValue([
        {
          _id: mockGardenId,
          timesheets: [mockGardenTimesheet],
          count: 8
        }
      ])
      jest.spyOn(helperService, 'validateWeekdays').mockResolvedValue(true as never)

      const result = await service.viewAvailableTime(queryDto)

      expect(result).toBeDefined()
      expect(result.slotNumbers).toBeDefined()
      expect(result.availableTimeOfGardens).toBeDefined()
    })

    it('should throw error for invalid weekdays', async () => {
      const invalidQuery = {
        ...queryDto,
        weekdays: [Weekday.MONDAY, Weekday.MONDAY]
      }

      await expect(service.viewAvailableTime(invalidQuery)).rejects.toThrow()
    })
  })

  describe('generateSlotsForClass', () => {
    const params = {
      startDate: mockDate,
      duration: 4,
      weekdays: [Weekday.MONDAY, Weekday.THURSDAY],
      slotNumbers: [SlotNumber.ONE],
      gardenId: mockGardenId,
      instructorId: mockInstructorId,
      classId: mockClassId,
      metadata: {
        code: 'TEST-001',
        title: 'Test Class'
      },
      courseData: {
        sessions: [
          {
            _id: new Types.ObjectId(),
            sessionNumber: 1,
            title: 'Session 1'
          }
        ]
      } as unknown as Course
    }

    it('should generate slots for class successfully', async () => {
      jest.spyOn(gardenTimesheetRepository, 'findMany').mockResolvedValue([mockGardenTimesheet])
      jest.spyOn(gardenTimesheetRepository, 'findOneAndUpdate').mockResolvedValue(mockGardenTimesheet)

      const result = await service.generateSlotsForClass(params)

      expect(result).toBe(true)
      expect(gardenTimesheetRepository.findOneAndUpdate).toHaveBeenCalled()
    })
  })

  describe('findSlotBy', () => {
    const params = {
      slotId: mockGardenTimesheet.slots[0]._id.toString(),
      instructorId: mockInstructorId.toString()
    }

    it('should find slot successfully', async () => {
      jest.spyOn(gardenTimesheetRepository, 'findOne').mockResolvedValue(mockGardenTimesheet)
      jest.spyOn(gardenRepository, 'findOne').mockResolvedValue(mockGarden)
      jest.spyOn(classService, 'findById').mockResolvedValue(null)

      const result = await service.findSlotBy(params)

      expect(result).toBeDefined()
      expect(result._id.toString()).toBe(params.slotId)
    })

    it('should return null when slot not found', async () => {
      jest.spyOn(gardenTimesheetRepository, 'findOne').mockResolvedValue(null)

      const result = await service.findSlotBy(params)

      expect(result).toBeNull()
    })
  })
})
