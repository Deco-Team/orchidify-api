import { DataResponse } from '@common/contracts/openapi-builder'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class RefreshTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  refreshToken: string
}

export class TokenDataResponse {
  @ApiProperty()
  accessToken: string

  @ApiProperty()
  refreshToken: string
}

export class TokenResponse extends DataResponse(TokenDataResponse) {}
