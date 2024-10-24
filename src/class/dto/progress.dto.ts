import { ApiProperty } from '@nestjs/swagger'

export class BaseProgressDto {
  constructor(total: number, completed: number) {
    this.total = total
    this.completed = completed
    this.percentage = Math.round((completed / total) * 100)
  }

  @ApiProperty({ type: Number })
  total: number

  @ApiProperty({ type: Number })
  completed: number

  @ApiProperty({ type: Number })
  percentage: number
}
