import { Injectable, Inject } from '@nestjs/common'
import { Lesson } from '@src/class/schemas/lesson.schema'
import { Types } from 'mongoose'
import { ICourseRepository } from '@course/repositories/course.repository'

export const ICourseLessonService = Symbol('ICourseLessonService')

export interface ICourseLessonService {
  findOneBy(params: { lessonId: string; courseId: string; instructorId?: string }): Promise<Lesson>
}

@Injectable()
export class CourseLessonService implements ICourseLessonService {
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
      projection: 'lessons',
      options: { lean: true }
    })

    const lessonIndex = course?.lessons?.findIndex((lesson) => lesson._id.toString() === lessonId)
    if (lessonIndex === -1) return null

    return { ...course?.lessons[lessonIndex], index: lessonIndex }
  }
}
