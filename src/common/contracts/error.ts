import { HttpStatus } from '@nestjs/common'
export const Errors = {
  /**
   * General
   */
  INTERNAL_SERVER_ERROR: {
    error: 'INTERNAL_SERVER_ERROR',
    message: 'Hệ thống của chúng tôi đang gặp sự cố. Vui lòng thử lại sau.',
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR
  },
  OBJECT_NOT_FOUND: {
    error: 'OBJECT_NOT_FOUND',
    message: 'Không tìm thấy đối tượng.',
    httpStatus: HttpStatus.NOT_FOUND
  },
  UPLOAD_MEDIA_ERROR: {
    error: 'UPLOAD_MEDIA_ERROR',
    message: 'Upload đang gặp sự cố. Vui lòng thử lại sau.',
    httpStatus: HttpStatus.BAD_REQUEST
  },
  VALIDATION_FAILED: {
    error: 'VALIDATION_FAILED',
    message: 'Dữ liệu không hợp lệ.',
    httpStatus: HttpStatus.BAD_REQUEST
  },
  EMAIL_ALREADY_EXIST: {
    error: 'EMAIL_ALREADY_EXIST',
    message: 'Email này đã được sử dụng. Vui lòng sử dụng email khác.',
    httpStatus: HttpStatus.BAD_REQUEST
  },

  /**
   * Setting
   */
  SETTING_NOT_FOUND: {
    error: 'SETTING_NOT_FOUND',
    message: 'Không tìm thấy thông tin cài đặt.',
    httpStatus: HttpStatus.NOT_FOUND
  },

  /**
   * Authentication
   */
  WRONG_EMAIL_OR_PASSWORD: {
    error: 'WRONG_EMAIL_OR_PASSWORD',
    message: 'Email hoặc mật khẩu không chính xác.',
    httpStatus: HttpStatus.BAD_REQUEST
  },
  UNVERIFIED_ACCOUNT: {
    error: 'UNVERIFIED_ACCOUNT',
    message: 'Tài khoản chưa được xác thực. Vui lòng xác thực và thử lại.',
    httpStatus: HttpStatus.BAD_REQUEST
  },
  INACTIVE_ACCOUNT: {
    error: 'INACTIVE_ACCOUNT',
    message: 'Tài khoản bị vô hiệu hóa.',
    httpStatus: HttpStatus.BAD_REQUEST
  },
  REFRESH_TOKEN_INVALID: {
    error: 'REFRESH_TOKEN_INVALID',
    message: 'Phiên đăng nhập không hợp lệ.',
    httpStatus: HttpStatus.NOT_ACCEPTABLE
  },
  WRONG_OTP_CODE: {
    error: 'WRONG_OTP',
    message: 'Mã OTP không hợp lệ.',
    httpStatus: HttpStatus.BAD_REQUEST
  },
  OTP_CODE_IS_EXPIRED: {
    error: 'OTP_CODE_IS_EXPIRED',
    message: 'Mã OTP hết hạn.',
    httpStatus: HttpStatus.BAD_REQUEST
  },
  RESEND_OTP_CODE_LIMITED: {
    error: 'RESEND_OTP_CODE_LIMITED',
    message: 'Bạn đã đạt giới hạn số lần gửi lại OTP trong ngày.',
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
  INSTRUCTOR_HAS_PUBLISHED_OR_IN_PROGRESSING_CLASSES: {
    error: 'INSTRUCTOR_HAS_PUBLISHED_OR_IN_PROGRESSING_CLASSES',
    message: 'Giảng viên đang có lớp học đang được mở hoặc đang diễn ra.',
    httpStatus: HttpStatus.BAD_REQUEST
  },
  INSTRUCTOR_HAS_NO_SELECTED_APPLICATIONS: {
    error: 'INSTRUCTOR_HAS_NO_SELECTED_APPLICATIONS',
    message: 'Hồ sơ của giảng viên chưa được duyệt bởi tuyển dụng.',
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

  /**
   * Garden
   */
  GARDEN_NOT_FOUND: {
    error: 'GARDEN_NOT_FOUND',
    message: 'Thông tin nhà vườn không tồn tại.',
    httpStatus: HttpStatus.NOT_FOUND
  },
  GARDEN_NAME_EXISTED: {
    error: 'GARDEN_NAME_EXISTED',
    message: 'Tên nhà vườn đã tồn tại. Vui lòng thử tên khác.',
    httpStatus: HttpStatus.BAD_REQUEST
  },
  SCHEDULED_OR_IN_PROGRESSING_CLASS_IN_GARDEN: {
    error: 'SCHEDULED_OR_IN_PROGRESSING_CLASS_IN_GARDEN',
    message: 'Có lớp học đã lên lịch hoặc đang diễn ra, nhà vườn không thể bị vô hiệu hóa.',
    httpStatus: HttpStatus.BAD_REQUEST
  },
  GARDEN_INACTIVE: {
    error: 'GARDEN_INACTIVE',
    message: 'Nhà vườn đã bị vô hiệu hóa.',
    httpStatus: HttpStatus.BAD_REQUEST
  },

  /**
   * Course
   */
  COURSE_NOT_FOUND: {
    error: 'COURSE_NOT_FOUND',
    message: 'Không tìm thấy khóa học.',
    httpStatus: HttpStatus.NOT_FOUND
  },
  CAN_NOT_UPDATE_COURSE: {
    error: 'CAN_NOT_UPDATE_COURSE',
    message: 'Khóa học không thể cập nhật.',
    httpStatus: HttpStatus.BAD_REQUEST
  },
  CAN_NOT_DELETE_COURSE: {
    error: 'CAN_NOT_DELETE_COURSE',
    message: 'Khóa học không thể xóa.',
    httpStatus: HttpStatus.BAD_REQUEST
  },
  COURSE_CAN_NOT_CREATE_REQUEST_TO_PUBLISH_CLASS: {
    error: 'COURSE_CAN_NOT_CREATE_REQUEST_TO_PUBLISH_CLASS',
    message: 'Không thể tạo yêu cầu mở lớp học từ khóa học này.',
    httpStatus: HttpStatus.BAD_REQUEST
  },
  COURSE_STATUS_INVALID: {
    error: 'COURSE_STATUS_INVALID',
    message: 'Trạng thái của khóa học không hợp lệ.',
    httpStatus: HttpStatus.BAD_REQUEST
  },
  TOTAL_SESSIONS_OF_COURSE_INVALID: {
    error: 'TOTAL_SESSIONS_OF_COURSE_INVALID',
    message: 'Tổng số lượng buổi học của khóa học không hợp lệ.',
    httpStatus: HttpStatus.BAD_REQUEST
  },
  TOTAL_ASSIGNMENTS_OF_COURSE_INVALID: {
    error: 'TOTAL_ASSIGNMENTS_OF_COURSE_INVALID',
    message: 'Tổng số lượng bài tập của khóa học không hợp lệ.',
    httpStatus: HttpStatus.BAD_REQUEST
  },

  /**
   * Class
   */
  CLASS_NOT_FOUND: {
    error: 'CLASS_NOT_FOUND',
    message: 'Không tìm thấy lớp học.',
    httpStatus: HttpStatus.NOT_FOUND
  },
  WEEKDAYS_OF_CLASS_INVALID: {
    error: 'WEEKDAYS_OF_CLASS_INVALID',
    message: 'Số buổi học trong tuần của lớp học không hợp lệ.',
    httpStatus: HttpStatus.BAD_REQUEST
  },
  CLASS_STATUS_INVALID: {
    error: 'CLASS_STATUS_INVALID',
    message: 'Trạng thái của lớp học không hợp lệ.',
    httpStatus: HttpStatus.BAD_REQUEST
  },
  CLASS_LEARNER_LIMIT: {
    error: 'CLASS_LEARNER_LIMIT',
    message: 'Số lượng học viên trong lớp đã đủ.',
    httpStatus: HttpStatus.BAD_REQUEST
  },

  /**
   * Session
   */
  SESSION_NOT_FOUND: {
    error: 'SESSION_NOT_FOUND',
    message: 'Không tìm thấy buổi học.',
    httpStatus: HttpStatus.NOT_FOUND
  },

  /**
   * Assignment
   */
  ASSIGNMENT_NOT_FOUND: {
    error: 'ASSIGNMENT_NOT_FOUND',
    message: 'Không tìm thấy bài tập.',
    httpStatus: HttpStatus.NOT_FOUND
  },

  /**
   * Assignment Submission
   */
  ASSIGNMENT_SUBMISSION_NOT_FOUND: {
    error: 'ASSIGNMENT_SUBMISSION_NOT_FOUND',
    message: 'Không tìm thấy bài làm.',
    httpStatus: HttpStatus.NOT_FOUND
  },
  ASSIGNMENT_SUBMITTED: {
    error: 'ASSIGNMENT_SUBMITTED',
    message: 'Bạn đã nộp bài tập.',
    httpStatus: HttpStatus.BAD_REQUEST
  },
  ASSIGNMENT_SUBMISSION_GRADED: {
    error: 'ASSIGNMENT_SUBMISSION_GRADED',
    message: 'Bài tập đã được chấm.',
    httpStatus: HttpStatus.BAD_REQUEST
  },

  /**
   * Staff
   */
  STAFF_NOT_FOUND: {
    error: 'STAFF_NOT_FOUND',
    message: 'Thông tin nhân viên không tồn tại.',
    httpStatus: HttpStatus.NOT_FOUND
  },
  STAFF_IS_ASSIGNED_TO_RECRUITMENT_PROCESS: {
    error: 'STAFF_IS_ASSIGNED_TO_RECRUITMENT_PROCESS',
    message: 'Nhân viên được phân công vào một quá trình tuyển dụng.',
    httpStatus: HttpStatus.BAD_REQUEST
  },

  /**
   * Recruitment
   */
  RECRUITMENT_NOT_FOUND: {
    error: 'RECRUITMENT_NOT_FOUND',
    message: 'Thông tin ứng tuyển không tồn tại.',
    httpStatus: HttpStatus.NOT_FOUND
  },
  RECRUITMENT_STATUS_INVALID: {
    error: 'RECRUITMENT_STATUS_INVALID',
    message: 'Trạng thái của đơn ứng tuyển không hợp lệ.',
    httpStatus: HttpStatus.BAD_REQUEST
  },
  RECRUITMENT_IS_IN_CHARGED_BY_ANOTHER_STAFF: {
    error: 'RECRUITMENT_IS_IN_CHARGED_BY_ANOTHER_STAFF',
    message: 'Đơn ứng tuyển đang được xử lý bởi nhân viên khác.',
    httpStatus: HttpStatus.BAD_REQUEST
  },

  /**
   * Class Request
   */
  CLASS_REQUEST_NOT_FOUND: {
    error: 'CLASS_REQUEST_NOT_FOUND',
    message: 'Không tìm thấy yêu cầu lớp học.',
    httpStatus: HttpStatus.NOT_FOUND
  },
  CREATE_CLASS_REQUEST_LIMIT: {
    error: 'CREATE_CLASS_REQUEST_LIMIT',
    message: 'Bạn đã đạt số lượng tạo yêu cầu khóa học trong ngày.',
    httpStatus: HttpStatus.BAD_REQUEST
  },
  CREATE_CLASS_REQUEST_SLOT_NUMBERS_INVALID: {
    error: 'CREATE_CLASS_REQUEST_SLOT_NUMBERS_INVALID',
    message: 'Tiết học của yêu cầu khóa học không hợp lệ.',
    httpStatus: HttpStatus.BAD_REQUEST
  },
  CLASS_REQUEST_STATUS_INVALID: {
    error: 'CLASS_REQUEST_STATUS_INVALID',
    message: 'Trạng thái của yêu cầu khóa học không hợp lệ.',
    httpStatus: HttpStatus.BAD_REQUEST
  },
  GARDEN_NOT_AVAILABLE_FOR_CLASS_REQUEST: {
    error: 'GARDEN_NOT_AVAILABLE_FOR_CLASS_REQUEST',
    message: 'Vườn đã chọn không phù hợp với yêu cầu khóa học.',
    httpStatus: HttpStatus.BAD_REQUEST
  },

  /**
   * LearnClass
   */
  LEARNER_CLASS_EXISTED: {
    error: 'LEARNER_CLASS_EXISTED',
    message: 'Bạn đã tham gia vào lớp học này.',
    httpStatus: HttpStatus.BAD_REQUEST
  },

  /**
   * Transaction
   */
  TRANSACTION_NOT_FOUND: {
    error: 'TRANSACTION_NOT_FOUND',
    message: 'Không tìm thấy giao dịch.',
    httpStatus: HttpStatus.NOT_FOUND
  },

   /**
   * Slot
   */
   SLOT_NOT_FOUND: {
    error: 'SLOT_NOT_FOUND',
    message: 'Không tìm thấy tiết học.',
    httpStatus: HttpStatus.NOT_FOUND
  },
}
