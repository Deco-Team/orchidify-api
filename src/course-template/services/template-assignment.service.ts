import { Injectable, Inject } from '@nestjs/common'
import { Assignment } from '@course/schemas/assignment.schema'
import { Types } from 'mongoose'
import { ICourseTemplateRepository } from '@course-template/repositories/course-template.repository'

export const ITemplateAssignmentService = Symbol('ITemplateAssignmentService')

export interface ITemplateAssignmentService {
  findOneBy(params: { assignmentId: string; courseTemplateId: string; instructorId?: string }): Promise<Assignment>
}

@Injectable()
export class TemplateAssignmentService implements ITemplateAssignmentService {
  constructor(
    @Inject(ICourseTemplateRepository)
    private readonly courseTemplateRepository: ICourseTemplateRepository
  ) {}

  public async findOneBy(params: { assignmentId: string; courseTemplateId: string; instructorId?: string }) {
    const { assignmentId, courseTemplateId, instructorId } = params
    const courseTemplate = await this.courseTemplateRepository.findOne({
      conditions: {
        _id: courseTemplateId,
        instructorId: new Types.ObjectId(instructorId)
      },
      projection: 'assignments',
      options: { lean: true }
    })
    const assignmentIndex = courseTemplate?.assignments?.findIndex(
      (templateAssignment) => templateAssignment._id.toString() === assignmentId
    )
    if (assignmentIndex === -1) return null

    return { ...courseTemplate?.assignments[assignmentIndex], index: assignmentIndex }
  }
}
