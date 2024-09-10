import { HttpStatus } from '@nestjs/common'
export const Errors = {
  /**
   * General
   */
  OBJECT_NOT_FOUND: {
    error: 'OBJECT_NOT_FOUND',
    message: 'Không tìm thấy đối tượng',
    httpStatus: HttpStatus.NOT_FOUND
  },
  VALIDATION_FAILED: {
    error: 'VALIDATION_FAILED',
    message: 'Dữ liệu không hợp lệ',
    httpStatus: HttpStatus.BAD_REQUEST
  },
  EMAIL_ALREADY_EXIST: {
    error: 'EMAIL_ALREADY_EXIST',
    message: 'Email đã được sử dụng',
    httpStatus: HttpStatus.BAD_REQUEST
  },

  /**
   * Authentication
   */
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
  REFRESH_TOKEN_INVALID: {
    error: 'REFRESH_TOKEN_INVALID',
    message: 'Phiên đăng nhập không hợp lệ',
    httpStatus: HttpStatus.NOT_ACCEPTABLE
  },
  WRONG_OTP_CODE: {
    error: 'WRONG_OTP',
    message: 'Mã OTP không hợp lệ',
    httpStatus: HttpStatus.BAD_REQUEST
  },
  OTP_CODE_IS_EXPIRED: {
    error: 'OTP_CODE_IS_EXPIRED',
    message: 'Mã OTP hết hạn',
    httpStatus: HttpStatus.BAD_REQUEST
  },
  RESEND_OTP_CODE_LIMITED: {
    error: 'RESEND_OTP_CODE_LIMITED',
    message: 'Bạn đã đạt giới hạn số lần gửi lại OTP',
    httpStatus: HttpStatus.BAD_REQUEST
  },

  /**
   * Learner
   */
  LEARNER_NOT_FOUND: {
    error: 'LEARNER_NOT_FOUND',
    message: 'Thông tin học viên không tồn tại.',
    httpStatus: HttpStatus.NOT_FOUND
  },

  /**
   * Instructor
   */
  INSTRUCTOR_NOT_FOUND: {
    error: 'INSTRUCTOR_NOT_FOUND',
    message: 'Thông tin giảng viên không tồn tại.',
    httpStatus: HttpStatus.NOT_FOUND
  },
  INSTRUCTOR_HAS_IN_PROGRESSING_APPLICATIONS: {
    error: 'INSTRUCTOR_HAS_IN_PROGRESSING_APPLICATIONS',
    message: 'Chúng tôi đang tiến hành đánh giá hồ sơ ứng tuyển. Vui lòng chờ đợi.',
    httpStatus: HttpStatus.BAD_REQUEST
  },

  /**
   * Garden Manager
   */
  GARDEN_MANAGER_NOT_FOUND: {
    error: 'GARDEN_MANAGER_NOT_FOUND',
    message: 'Thông tin quản lý vườn không tồn tại.',
    httpStatus: HttpStatus.NOT_FOUND
  },
  GARDEN_MANAGER_IS_ASSIGNED_TO_GARDEN: {
    error: 'GARDEN_MANAGER_IS_ASSIGNED_TO_GARDEN',
    message: 'Người quản lý vườn đang quản lý vườn nên không thể bị vô hiệu hóa.',
    httpStatus: HttpStatus.BAD_REQUEST
  },
}
