import { MongoServerError } from 'mongodb'
import { IGardenRepository } from '@garden/repositories/garden.repository'
import { GardenService } from '@garden/services/garden.service'
import { Mocked } from '@suites/doubles.jest'
import { TestBed } from '@suites/unit'
import { GardenDocument } from '@garden/schemas/garden.schema'
import { Types } from 'mongoose'
import { IGardenTimesheetService } from '@garden-timesheet/services/garden-timesheet.service'
import { Weekday } from '@common/contracts/constant'
import { AppException } from '@common/exceptions/app.exception'

describe('GardenService', () => {
  let gardenService: GardenService
  let gardenTimesheetService: Mocked<IGardenTimesheetService>
  let gardenRepository: Mocked<IGardenRepository>

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(GardenService).compile()
    gardenService = unit
    gardenRepository = unitRef.get(IGardenRepository)
    gardenTimesheetService = unitRef.get(IGardenTimesheetService)
  })

  describe('create', () => {
    it('should throw an error if garden name already exists', async () => {
      const createGardenDto = {
        name: 'Garden 1',
        gardenManagerId: new Types.ObjectId().toString(),
        description: 'A beautiful garden',
        address: '123 Garden St',
        addressLink: 'http://maps.example.com/garden1',
        images: ['https://example.com/garden1.jpg'],
        maxClass: 3
      }

      gardenRepository.create.mockRejectedValue(new Error())

      await expect(gardenService.create(createGardenDto)).rejects.toThrow(Error)
    })
  })

  describe('findManyByGardenManagerId', () => {
    it('should find gardens successfully', async () => {
      const gardenManagerId = new Types.ObjectId().toString()

      gardenRepository.findMany.mockResolvedValue([{ gardenManagerId }] as any)

      const result = await gardenService.findManyByGardenManagerId(gardenManagerId)
      expect(result).toMatchObject([{ gardenManagerId }])
    })
  })

  describe('findOneBy', () => {
    it('should find a garden successfully', async () => {
      const gardenId = new Types.ObjectId().toString()

      gardenRepository.findOne.mockResolvedValue({ _id: gardenId } as GardenDocument)

      const result = await gardenService.findOneBy({ _id: gardenId })
      expect(result).toMatchObject({ _id: gardenId })
    })
  })

  describe('update', () => {
    it('should update a garden successfully', async () => {
      const gardenId = new Types.ObjectId().toString()
      const updatePayload = { name: 'Updated Garden' }

      gardenRepository.findOneAndUpdate.mockResolvedValue({ _id: gardenId } as GardenDocument)

      const result = await gardenService.update({ _id: gardenId }, updatePayload)
      expect(result).toMatchObject({ _id: gardenId })
    })

    it('should throw an error if garden name already exists', async () => {
      const gardenId = new Types.ObjectId().toString()
      const updatePayload = { name: 'Updated Garden' }

      class CustomMongoServerError {
        name = MongoServerError.name
        code = 11000
        keyPattern = { name: 1 }
      }

      gardenRepository.findOneAndUpdate.mockRejectedValue(new CustomMongoServerError())

      await expect(gardenService.update({ _id: gardenId }, updatePayload)).rejects.toThrow(AppException)
    })
  })

  describe('getAvailableGardenList', () => {
    it('should return an empty list if no available slots match the requested slot numbers', async () => {
      const queryAvailableGardenDto = {
        startDate: new Date(),
        duration: 60,
        weekdays: [Weekday.MONDAY, Weekday.THURSDAY],
        slotNumbers: [1, 2],
        instructorId: new Types.ObjectId()
      }

      gardenTimesheetService.viewAvailableTime.mockResolvedValue({
        slotNumbers: [3, 4],
        availableTimeOfGardens: []
      })

      const result = await gardenService.getAvailableGardenList(queryAvailableGardenDto)
      expect(result).toEqual([])
    })

    it('should return an empty list if no available gardens match the requested slot numbers', async () => {
      const queryAvailableGardenDto = {
        startDate: new Date(),
        duration: 60,
        weekdays: [Weekday.MONDAY, Weekday.THURSDAY],
        slotNumbers: [1, 2],
        instructorId: new Types.ObjectId()
      }

      gardenTimesheetService.viewAvailableTime.mockResolvedValue({
        slotNumbers: [1, 2],
        availableTimeOfGardens: [{ gardenId: new Types.ObjectId(), slotNumbers: [3, 4] }]
      })

      const result = await gardenService.getAvailableGardenList(queryAvailableGardenDto)
      expect(result).toEqual([])
    })
  })
})
