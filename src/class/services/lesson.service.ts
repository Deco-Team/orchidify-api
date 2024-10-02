import { Injectable, Inject } from '@nestjs/common'
import { IClassRepository } from '@src/class/repositories/class.repository'
import { Lesson } from '@src/class/schemas/lesson.schema'
import { Types } from 'mongoose'

export const ILessonService = Symbol('ILessonService')

export interface ILessonService {
  findOneBy(params: { lessonId: string; classId: string; instructorId?: string }): Promise<Lesson>
}

@Injectable()
export class LessonService implements ILessonService {
  constructor(
    @Inject(IClassRepository)
    private readonly classRepository: IClassRepository
  ) {}

  public async findOneBy(params: { lessonId: string; classId: string; instructorId?: string }) {
    const { lessonId, classId, instructorId } = params
    const courseClass = await this.classRepository.findOne({
      conditions: {
        _id: classId,
        instructorId: new Types.ObjectId(instructorId)
      },
      projection: 'lessons',
      options: { lean: true }
    })

    const lessonIndex = courseClass?.lessons.findIndex((lesson) => lesson._id.toString() === lessonId)
    if (lessonIndex === -1) return null

    return { ...courseClass?.lessons[lessonIndex], index: lessonIndex }
  }
}
