import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50)
  email: string

  @ApiProperty({ example: '123456789' })
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  password: string
}
