import { Injectable, Inject } from '@nestjs/common'
import { Lesson } from '@course/schemas/lesson.schema'
import { Types } from 'mongoose'
import { ICourseTemplateRepository } from '@course-template/repositories/course-template.repository'

export const ITemplateLessonService = Symbol('ITemplateLessonService')

export interface ITemplateLessonService {
  findOneBy(params: { lessonId: string; courseTemplateId: string; instructorId?: string }): Promise<Lesson>
}

@Injectable()
export class TemplateLessonService implements ITemplateLessonService {
  constructor(
    @Inject(ICourseTemplateRepository)
    private readonly courseTemplateRepository: ICourseTemplateRepository
  ) {}

  public async findOneBy(params: { lessonId: string; courseTemplateId: string; instructorId?: string }) {
    const { lessonId, courseTemplateId, instructorId } = params
    const courseTemplate = await this.courseTemplateRepository.findOne({
      conditions: {
        _id: courseTemplateId,
        instructorId: new Types.ObjectId(instructorId)
      },
      projection: 'lessons'
    })
    return courseTemplate?.lessons?.find((lesson) => lesson._id.toString() === lessonId)
  }
}
