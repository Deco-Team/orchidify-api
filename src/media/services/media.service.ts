import { Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { v2 as cloudinary, SignApiOptions } from 'cloudinary'
import { GenerateSignedUrlDto } from '@media/dto/generate-signed-url.dto'

@Injectable()
export class MediaService implements OnModuleInit {
  private readonly cloudinary = cloudinary
  constructor(private readonly configService: ConfigService) {}
  onModuleInit() {
    const config = this.configService.get('cloudinary')
    this.cloudinary.config({ ...config, secure: true })
  }

  public async create(generateSignedUrlDto: GenerateSignedUrlDto) {
    const timestamp = Math.round(new Date().getTime() / 1000)
    const signature = await this.generateSignedUrl({
      ...generateSignedUrlDto,
      timestamp
    })
    return { ...generateSignedUrlDto, timestamp, signature }
  }

  private async generateSignedUrl(params_to_sign: SignApiOptions) {
    return this.cloudinary.utils.api_sign_request(params_to_sign, this.configService.get('cloudinary.api_secret'))
  }
}
