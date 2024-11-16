import { Injectable, Inject } from '@nestjs/common'
import * as _ from 'lodash'
import { IFirebaseRepository } from '@firebase/repositories/firebase.repository'
import { AppLogger } from '@common/services/app-logger.service'
import { IInstructorService } from '@instructor/services/instructor.service'
import { ILearnerService } from '@learner/services/learner.service'
import {
  SendFirebaseMessagingDto,
  SendFirebaseMulticastMessagingDto,
  SendFirebaseTopicMessagingDto
} from '@firebase/dto/firebase-messaging.dto'
import { BatchResponse } from 'firebase-admin/lib/messaging/messaging-api'

export const IFirebaseMessagingService = Symbol('IFirebaseMessagingService')

export interface IFirebaseMessagingService {
  send({ token, title, body, icon }: SendFirebaseMessagingDto): Promise<{
    success: boolean
    response?: string
  }>
  sendMulticast({ tokens, title, body, icon }: SendFirebaseMulticastMessagingDto): Promise<{
    success: boolean
    response?: BatchResponse
  }>
  sendTopicNotification({ topic, title, body, icon }: SendFirebaseTopicMessagingDto): Promise<{
    success: boolean
    response?: string
  }>
}

@Injectable()
export class FirebaseMessagingService implements IFirebaseMessagingService {
  private readonly appLogger = new AppLogger(FirebaseMessagingService.name)
  constructor(
    @Inject(IFirebaseRepository)
    private readonly firebaseRepository: IFirebaseRepository,
    @Inject(IInstructorService)
    private readonly instructorService: IInstructorService,
    @Inject(ILearnerService)
    private readonly learnerService: ILearnerService
  ) {}

  async send({ token, title, body, icon }: SendFirebaseMessagingDto) {
    try {
      const response = await this.firebaseRepository.getMessaging().send({
        token,
        notification: {
          title,
          body,
        },
        // webpush: {
        //   notification: {
        //     title,
        //     body,
        //     icon
        //   }
        // }
      })
      return {
        success: true,
        response
      }
    } catch (error) {
      console.log('Error sending messages:', error)
      return { success: false }
    }
  }

  async sendMulticast({ tokens, title, body, icon }: SendFirebaseMulticastMessagingDto) {
    const message = {
      notification: {
        title,
        body,
        icon
      },
      tokens
    }

    try {
      const response = await this.firebaseRepository.getMessaging().sendEachForMulticast(message)
      console.log('Successfully sent messages:', response)
      return {
        success: true,
        response
      }
    } catch (error) {
      console.log('Error sending messages:', error)
      return { success: false }
    }
  }

  async sendTopicNotification({ topic, title, body, icon }: SendFirebaseTopicMessagingDto) {
    const message = {
      notification: {
        title,
        body,
        icon
      },
      topic
    }

    try {
      const response = await this.firebaseRepository.getMessaging().send(message)
      console.log('Successfully sent message:', response)
      return { success: true, response }
    } catch (error) {
      console.log('Error sending message:', error)
      return { success: false }
    }
  }
}
