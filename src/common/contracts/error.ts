import { HttpStatus } from '@nestjs/common'
import { ErrorResponse } from '@common/exceptions/app.exception'
export const Errors: Record<string, ErrorResponse> = {
  VALIDATION_FAILED: {
    error: 'VALIDATION_FAILED',
    message: 'Dữ liệu không hợp lệ',
    httpStatus: HttpStatus.BAD_REQUEST
  },
  OBJECT_NOT_FOUND: {
    error: 'OBJECT_NOT_FOUND',
    message: 'Không tìm thấy đối tượng',
    httpStatus: HttpStatus.NOT_FOUND
  },
  WRONG_EMAIL_OR_PASSWORD: {
    error: 'WRONG_EMAIL_OR_PASSWORD',
    message: 'Email hoặc mật khẩu không đúng.',
    httpStatus: HttpStatus.BAD_REQUEST
  },
  UNVERIFIED_ACCOUNT: {
    error: 'UNVERIFIED_ACCOUNT',
    message: 'Tài khoản của bạn chưa được xác thực.',
    httpStatus: HttpStatus.BAD_REQUEST
  },
  INACTIVE_ACCOUNT: {
    error: 'INACTIVE_ACCOUNT',
    message: 'Tài khoản của bạn đã bị vô hiệu hóa.',
    httpStatus: HttpStatus.BAD_REQUEST
  },
  EMAIL_ALREADY_EXIST: {
    error: 'EMAIL_ALREADY_EXIST',
    message: 'Email đã được sử dụng',
    httpStatus: HttpStatus.BAD_REQUEST
  },
  LEARNER_NOT_FOUND: {
    error: 'LEARNER_NOT_FOUND',
    message: 'Thông tin học viên không tồn tại.',
    httpStatus: HttpStatus.NOT_FOUND
  },
}
