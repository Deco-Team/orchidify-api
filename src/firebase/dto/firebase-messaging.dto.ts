import { ApiProperty } from '@nestjs/swagger'

export class SendFirebaseMessagingDto {
  @ApiProperty({ type: String })
  token: string

  @ApiProperty({ type: String })
  title: string

  @ApiProperty({ type: String })
  body: string

  @ApiProperty({ type: String })
  icon?: string
}

export class SendFirebaseMulticastMessagingDto {
  @ApiProperty({ type: String, isArray: true })
  tokens: string[]

  @ApiProperty({ type: String })
  title: string

  @ApiProperty({ type: String })
  body: string

  @ApiProperty({ type: String })
  icon?: string
}

export class SendFirebaseTopicMessagingDto {
  @ApiProperty({ type: String })
  topic: string

  @ApiProperty({ type: String })
  title: string

  @ApiProperty({ type: String })
  body: string

  @ApiProperty({ type: String })
  icon?: string
}
