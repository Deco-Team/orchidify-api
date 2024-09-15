import { Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { v2 as cloudinary, SignApiOptions } from 'cloudinary'
import { GenerateSignedUrlDto } from '@media/dto/generate-signed-url.dto'
import * as _ from 'lodash'
import { UploadMediaViaBase64Dto } from '@media/dto/upload-media-via-base64.dto'
import { AppException } from '@common/exceptions/app.exception'
import { Errors } from '@common/contracts/error'

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

  public async uploadViaBase64(uploadMediaViaBase64Dto: UploadMediaViaBase64Dto) {
    try {
      const result = await this.cloudinary.uploader.upload(
        `data:image/png;base64,${uploadMediaViaBase64Dto.contents}`,
        {
          ..._.pick(['type', 'public_id', 'folder'])
        }
      )
      return result
    } catch (err) {
      console.error(err)
      throw new AppException(Errors.UPLOAD_MEDIA_ERROR)
    }
  }

  private async generateSignedUrl(params_to_sign: SignApiOptions) {
    return this.cloudinary.utils.api_sign_request(params_to_sign, this.configService.get('cloudinary.api_secret'))
  }
}
