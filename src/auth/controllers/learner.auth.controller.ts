import { Controller, Inject, Post, Req, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { IAuthService } from '@auth/services/auth.service'

@ApiTags('Learner - Auth')
@Controller('learners')
export class LearnerAuthController {
  constructor(
    @Inject(IAuthService)
    private readonly authService: IAuthService
  ) {}

  // @Post('login')
  // @ApiBody({ type: LoginReqDto })
  // @ApiOkResponse({ type: DataResponse(TokenResDto) })
  // @ApiBadRequestResponse({ type: ErrorResponse })
  // login(@Body() loginReqDto: LoginReqDto): Promise<TokenResDto> {
  //   return this.authService.login(loginReqDto, UserSide.LEARNER)
  // }

  // @Post('register')
  // @ApiBody({ type: RegisterReqDto })
  // @ApiOkResponse({ type: SuccessDataResponse })
  // @ApiBadRequestResponse({ type: ErrorResponse })
  // async register(@Body() registerReqDto: RegisterReqDto) {
  //   return await this.authService.register(registerReqDto)
  // }

  // @UseGuards(JwtAuthGuard.REFRESH_TOKEN)
  // @Post('refresh')
  // @ApiBearerAuth()
  // @ApiOkResponse({ type: DataResponse(TokenResDto) })
  // @ApiBadRequestResponse({ type: ErrorResponse })
  // refreshToken(@Req() req): Promise<TokenResDto> {
  //   return this.authService.refreshToken(req.user.id, UserRole.LEARNER)
  // }
}
