import { Injectable, Inject } from '@nestjs/common'
import { ICourseRepository } from '@course/repositories/course.repository'
import { Lesson } from '@course/schemas/lesson.schema'
import { Types } from 'mongoose'

export const ILessonService = Symbol('ILessonService')

export interface ILessonService {
  findOneBy(params: { lessonId: string; courseId: string; instructorId?: string }): Promise<Lesson>
}

@Injectable()
export class LessonService implements ILessonService {
  constructor(
    @Inject(ICourseRepository)
    private readonly courseRepository: ICourseRepository
  ) {}

  public async findOneBy(params: { lessonId: string; courseId: string; instructorId?: string }) {
    const { lessonId, courseId, instructorId } = params
    const course = await this.courseRepository.findOne({
      conditions: {
        _id: courseId,
        instructorId: new Types.ObjectId(instructorId)
      },
      projection: 'lessons'
    })
    return course?.lessons?.find((lesson) => lesson._id.toString() === lessonId)
  }
}
