import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { IAuthService } from '@auth/services/auth.service'
import { LoginDto } from '@auth/dto/login.dto'
import { ErrorResponse, SuccessDataResponse } from '@common/contracts/dto'
import { RefreshTokenDto, TokenResponse } from '@auth/dto/token.dto'
import { UserRole } from '@common/contracts/constant'
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard'

@ApiTags('Auth - Management')
@Controller()
@ApiBadRequestResponse({ type: ErrorResponse })
export class ManagementAuthController {
  constructor(
    @Inject(IAuthService)
    private readonly authService: IAuthService
  ) {}

  @Post('staff/login')
  @ApiOperation({
    summary: `role: ${UserRole.STAFF}, ${UserRole.ADMIN}`
  })
  @ApiCreatedResponse({ type: TokenResponse })
  staffLogin(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto, UserRole.STAFF)
  }

  @Post('garden-manager/login')
  @ApiOperation({
    summary: `role: ${UserRole.GARDEN_MANAGER}`
  })
  @ApiCreatedResponse({ type: TokenResponse })
  gardenManagerLogin(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto, UserRole.GARDEN_MANAGER)
  }

  @Post('management/logout')
  @ApiOperation({
    summary: `role: ${UserRole.STAFF}, ${UserRole.ADMIN}, ${UserRole.GARDEN_MANAGER}`
  })
  @ApiCreatedResponse({ type: SuccessDataResponse })
  async staffLogout(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.logout(refreshTokenDto)
  }

  @Post('management/refresh')
  @UseGuards(JwtAuthGuard.REFRESH_TOKEN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: `role: ${UserRole.STAFF}, ${UserRole.ADMIN}, ${UserRole.GARDEN_MANAGER}`
  })
  @ApiCreatedResponse({ type: TokenResponse })
  refreshToken(@Req() req) {
    return this.authService.refreshToken(req.user?._id, req.user?.role, req.user?.refreshToken)
  }
}
