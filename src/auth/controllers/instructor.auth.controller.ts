import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import { IAuthService } from '@auth/services/auth.service'
import { LoginDto } from '@auth/dto/login.dto'
import { ErrorResponse, SuccessDataResponse } from '@common/contracts/dto'
import { RefreshTokenDto, TokenResponse } from '@auth/dto/token.dto'
import { UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'

@ApiTags('Auth - Instructor')
@Controller('instructor')
@ApiBadRequestResponse({ type: ErrorResponse })
export class InstructorAuthController {
  constructor(
    @Inject(IAuthService)
    private readonly authService: IAuthService
  ) {}

  @Post('login')
  @ApiCreatedResponse({ type: TokenResponse })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto, UserRole.INSTRUCTOR)
  }

  @Post('logout')
  @ApiCreatedResponse({ type: SuccessDataResponse })
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.logout(refreshTokenDto)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard.REFRESH_TOKEN)
  @Post('refresh')
  @ApiCreatedResponse({ type: TokenResponse })
  refreshToken(@Req() req) {
    return this.authService.refreshToken(req.user?._id, req.user?.role, req.user?.refreshToken)
  }
}
