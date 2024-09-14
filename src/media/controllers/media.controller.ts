import { Controller, UseGuards, Body, Post } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { ErrorResponse } from '@common/contracts/dto'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'
import { MediaService } from '@media/services/media.service'
import { GenerateSignedUrlDataResponse, GenerateSignedUrlDto } from '@media/dto/generate-signed-url.dto'

@ApiTags('Media')
@ApiBearerAuth()
@ApiBadRequestResponse({ type: ErrorResponse })
@UseGuards(JwtAuthGuard.ACCESS_TOKEN)
@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @ApiOperation({
    summary: `Generating authentication signatures`
  })
  @ApiCreatedResponse({ type: GenerateSignedUrlDataResponse })
  @Post()
  generateSignedURL(@Body() generateSignedUrlDto: GenerateSignedUrlDto) {
    return this.mediaService.create(generateSignedUrlDto)
  }
}
