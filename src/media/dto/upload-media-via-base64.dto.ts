import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { DataResponse } from '@common/contracts/openapi-builder'
import { MediaType } from '@media/contracts/constant'

export class UploadMediaViaBase64Dto {
  @ApiProperty({ type: String, example: 'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4...' })
  @IsNotEmpty()
  @IsString()
  contents: string

  @ApiProperty({ enum: MediaType })
  @IsOptional()
  @IsEnum(MediaType)
  type: string

  @ApiPropertyOptional({ type: String, example: 'public_id' })
  @IsOptional()
  @IsString()
  public_id: string

  @ApiPropertyOptional({ type: String, example: 'images' })
  @IsOptional()
  @IsString()
  folder: string
}

class UploadMediaViaBase64ResponseDto {
  @ApiProperty({ type: String, example: '15a66cd41cb44ebdc518f767a2fffb52' })
  asset_id: string

  @ApiProperty({ type: String, example: 'images/jlhqjvxdqjshg9xtfvkt' })
  public_id: string

  @ApiProperty({
    type: String,
    example:
      'http://res.cloudinary.com/orchidify/image/authenticated/s--hJ8eOb6---/v1726296687/orchidify_upload/jlhqjvxdqjshg9xtfvkt.jpg'
  })
  url: string

  @ApiProperty({ type: String, example: 'jlhqjvxdqjshg9xtfvkt' })
  display_name: string

  @ApiProperty({ type: String, example: 'IMG_0207' })
  original_filename: string

  @ApiProperty({ type: String, example: 'JPG' })
  original_extension: string
}

export class UploadMediaViaBase64DataResponseDto extends DataResponse(UploadMediaViaBase64ResponseDto) {}