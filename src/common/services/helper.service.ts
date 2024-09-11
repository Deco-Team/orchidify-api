import { Injectable } from '@nestjs/common'
import { InjectConnection } from '@nestjs/mongoose'
import { createHmac } from 'crypto'
import * as bcrypt from 'bcrypt'
import { Connection, ClientSession } from 'mongoose'

@Injectable()
export class HelperService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async executeCommandsInTransaction(
    fn: (session: ClientSession, data?: Record<string, any>) => Promise<any>,
    data?: Record<string, any>
  ): Promise<any> {
    let result: any
    const session = await this.connection.startSession()
    await session.withTransaction(async () => {
      result = await fn(session, data)
    })
    return result
  }

  createSignature(rawData: string, key: string) {
    const signature = createHmac('sha256', key).update(rawData).digest('hex')
    return signature
  }

  generateRandomString = (length = 6, characters = '0123456789') => {
    let randomString = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
    return randomString;
  };

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt()
    const hash = await bcrypt.hash(password, salt)
    return hash
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }
}
