"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Errors = void 0;
const common_1 = require("@nestjs/common");
exports.Errors = {
    INTERNAL_SERVER_ERROR: {
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Hệ thống của chúng tôi đang gặp sự cố. Vui lòng thử lại sau.',
        httpStatus: common_1.HttpStatus.INTERNAL_SERVER_ERROR
    },
    OBJECT_NOT_FOUND: {
        error: 'OBJECT_NOT_FOUND',
        message: 'Không tìm thấy đối tượng.',
        httpStatus: common_1.HttpStatus.NOT_FOUND
    },
    UPLOAD_MEDIA_ERROR: {
        error: 'UPLOAD_MEDIA_ERROR',
        message: 'Upload đang gặp sự cố. Vui lòng thử lại sau.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    VALIDATION_FAILED: {
        error: 'VALIDATION_FAILED',
        message: 'Dữ liệu không hợp lệ.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    EMAIL_ALREADY_EXIST: {
        error: 'EMAIL_ALREADY_EXIST',
        message: 'Email này đã được sử dụng. Vui lòng sử dụng email khác.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    SETTING_NOT_FOUND: {
        error: 'SETTING_NOT_FOUND',
        message: 'Không tìm thấy thông tin cài đặt.',
        httpStatus: common_1.HttpStatus.NOT_FOUND
    },
    WRONG_EMAIL_OR_PASSWORD: {
        error: 'WRONG_EMAIL_OR_PASSWORD',
        message: 'Email hoặc mật khẩu không chính xác.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    UNVERIFIED_ACCOUNT: {
        error: 'UNVERIFIED_ACCOUNT',
        message: 'Tài khoản chưa được xác thực. Vui lòng xác thực và thử lại.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    INACTIVE_ACCOUNT: {
        error: 'INACTIVE_ACCOUNT',
        message: 'Tài khoản bị vô hiệu hóa.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    REFRESH_TOKEN_INVALID: {
        error: 'REFRESH_TOKEN_INVALID',
        message: 'Phiên đăng nhập không hợp lệ.',
        httpStatus: common_1.HttpStatus.NOT_ACCEPTABLE
    },
    WRONG_OTP_CODE: {
        error: 'WRONG_OTP',
        message: 'Mã OTP không hợp lệ.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    OTP_CODE_IS_EXPIRED: {
        error: 'OTP_CODE_IS_EXPIRED',
        message: 'Mã OTP hết hạn.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    RESEND_OTP_CODE_LIMITED: {
        error: 'RESEND_OTP_CODE_LIMITED',
        message: 'Bạn đã đạt giới hạn số lần gửi lại OTP trong ngày.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    LEARNER_NOT_FOUND: {
        error: 'LEARNER_NOT_FOUND',
        message: 'Thông tin học viên không tồn tại.',
        httpStatus: common_1.HttpStatus.NOT_FOUND
    },
    INSTRUCTOR_NOT_FOUND: {
        error: 'INSTRUCTOR_NOT_FOUND',
        message: 'Thông tin giảng viên không tồn tại.',
        httpStatus: common_1.HttpStatus.NOT_FOUND
    },
    INSTRUCTOR_HAS_IN_PROGRESSING_APPLICATIONS: {
        error: 'INSTRUCTOR_HAS_IN_PROGRESSING_APPLICATIONS',
        message: 'Chúng tôi đang tiến hành đánh giá hồ sơ ứng tuyển. Vui lòng chờ đợi.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    INSTRUCTOR_HAS_PUBLISHED_OR_IN_PROGRESSING_CLASSES: {
        error: 'INSTRUCTOR_HAS_PUBLISHED_OR_IN_PROGRESSING_CLASSES',
        message: 'Giảng viên đang có lớp học đang được mở hoặc đang diễn ra.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    INSTRUCTOR_HAS_NO_SELECTED_APPLICATIONS: {
        error: 'INSTRUCTOR_HAS_NO_SELECTED_APPLICATIONS',
        message: 'Hồ sơ của giảng viên chưa được duyệt bởi tuyển dụng.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    GARDEN_MANAGER_NOT_FOUND: {
        error: 'GARDEN_MANAGER_NOT_FOUND',
        message: 'Thông tin quản lý vườn không tồn tại.',
        httpStatus: common_1.HttpStatus.NOT_FOUND
    },
    GARDEN_MANAGER_IS_ASSIGNED_TO_GARDEN: {
        error: 'GARDEN_MANAGER_IS_ASSIGNED_TO_GARDEN',
        message: 'Người quản lý vườn đang quản lý vườn nên không thể bị vô hiệu hóa.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    GARDEN_NOT_FOUND: {
        error: 'GARDEN_NOT_FOUND',
        message: 'Thông tin nhà vườn không tồn tại.',
        httpStatus: common_1.HttpStatus.NOT_FOUND
    },
    GARDEN_NAME_EXISTED: {
        error: 'GARDEN_NAME_EXISTED',
        message: 'Tên nhà vườn đã tồn tại. Vui lòng thử tên khác.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    SCHEDULED_OR_IN_PROGRESSING_CLASS_IN_GARDEN: {
        error: 'SCHEDULED_OR_IN_PROGRESSING_CLASS_IN_GARDEN',
        message: 'Có lớp học đã lên lịch hoặc đang diễn ra, nhà vườn không thể bị vô hiệu hóa.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    GARDEN_INACTIVE: {
        error: 'GARDEN_INACTIVE',
        message: 'Nhà vườn đã bị vô hiệu hóa.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    GARDEN_TIMESHEET_NOT_FOUND: {
        error: 'GARDEN_TIMESHEET_NOT_FOUND',
        message: 'Thông tin lịch nhà vườn không tồn tại.',
        httpStatus: common_1.HttpStatus.NOT_FOUND
    },
    CAN_NOT_UPDATE_GARDEN_TIMESHEET: {
        error: 'CAN_NOT_UPDATE_GARDEN_TIMESHEET',
        message: 'Không thể cập nhật lịch nhà vườn.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    COURSE_NOT_FOUND: {
        error: 'COURSE_NOT_FOUND',
        message: 'Không tìm thấy khóa học.',
        httpStatus: common_1.HttpStatus.NOT_FOUND
    },
    CAN_NOT_UPDATE_COURSE: {
        error: 'CAN_NOT_UPDATE_COURSE',
        message: 'Khóa học không thể cập nhật.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    CAN_NOT_DELETE_COURSE: {
        error: 'CAN_NOT_DELETE_COURSE',
        message: 'Khóa học không thể xóa.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    COURSE_CAN_NOT_CREATE_REQUEST_TO_PUBLISH_CLASS: {
        error: 'COURSE_CAN_NOT_CREATE_REQUEST_TO_PUBLISH_CLASS',
        message: 'Không thể tạo yêu cầu mở lớp học từ khóa học này.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    COURSE_STATUS_INVALID: {
        error: 'COURSE_STATUS_INVALID',
        message: 'Trạng thái của khóa học không hợp lệ.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    TOTAL_SESSIONS_OF_COURSE_INVALID: {
        error: 'TOTAL_SESSIONS_OF_COURSE_INVALID',
        message: 'Tổng số lượng buổi học của khóa học không hợp lệ.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    TOTAL_ASSIGNMENTS_OF_COURSE_INVALID: {
        error: 'TOTAL_ASSIGNMENTS_OF_COURSE_INVALID',
        message: 'Tổng số lượng bài tập của khóa học không hợp lệ.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    LAST_SESSION_MUST_NOT_HAVE_ASSIGNMENTS: {
        error: 'LAST_SESSION_MUST_NOT_HAVE_ASSIGNMENTS',
        message: 'Bài học cuối không được bao gồm bài tập.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    CHILD_COURSE_COMBO_INVALID: {
        error: 'CHILD_COURSE_COMBO_INVALID',
        message: 'Khóa học trong combo không hợp lệ.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    COURSE_COMBO_NOT_FOUND: {
        error: 'COURSE_COMBO_NOT_FOUND',
        message: 'Không tìm thấy combo khóa học.',
        httpStatus: common_1.HttpStatus.NOT_FOUND
    },
    COURSE_COMBO_EXISTED: {
        error: 'COURSE_COMBO_EXISTED',
        message: 'Combo khóa học đã tồn tại.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    CLASS_NOT_FOUND: {
        error: 'CLASS_NOT_FOUND',
        message: 'Không tìm thấy lớp học.',
        httpStatus: common_1.HttpStatus.NOT_FOUND
    },
    WEEKDAYS_OF_CLASS_INVALID: {
        error: 'WEEKDAYS_OF_CLASS_INVALID',
        message: 'Số buổi học trong tuần của lớp học không hợp lệ.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    CLASS_STATUS_INVALID: {
        error: 'CLASS_STATUS_INVALID',
        message: 'Trạng thái của lớp học không hợp lệ.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    CLASS_LEARNER_LIMIT: {
        error: 'CLASS_LEARNER_LIMIT',
        message: 'Số lượng học viên trong lớp đã đủ.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    CLASS_TIMESHEET_INVALID: {
        error: 'CLASS_TIMESHEET_INVALID',
        message: 'Thời gian học của lớp trùng với thời gian học của bạn.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    CLASS_NOT_START_YET: {
        error: 'CLASS_NOT_START_YET',
        message: 'Lớp học chưa bắt đầu. Vui lòng quay lại sau.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    CLASS_ENDED: {
        error: 'CLASS_ENDED',
        message: 'Lớp học đã kết thúc.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    CLASS_END_TIME_INVALID: {
        error: 'CLASS_END_TIME_INVALID',
        message: 'Chưa đến thời gian kết thúc lớp học.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    NOT_ENROLL_CLASS_YET: {
        error: 'NOT_ENROLL_CLASS_YET',
        message: 'Bạn chưa đăng ký lớp học này.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    CLASS_CAN_NOT_CREATE_REQUEST_TO_CANCEL_CLASS: {
        error: 'CLASS_CAN_NOT_CREATE_REQUEST_TO_CANCEL_CLASS',
        message: 'Không thể tạo yêu cầu hủy lớp học này.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    SESSION_NOT_FOUND: {
        error: 'SESSION_NOT_FOUND',
        message: 'Không tìm thấy buổi học.',
        httpStatus: common_1.HttpStatus.NOT_FOUND
    },
    ASSIGNMENT_NOT_FOUND: {
        error: 'ASSIGNMENT_NOT_FOUND',
        message: 'Không tìm thấy bài tập.',
        httpStatus: common_1.HttpStatus.NOT_FOUND
    },
    ASSIGNMENT_DEADLINE_INVALID: {
        error: 'ASSIGNMENT_DEADLINE_INVALID',
        message: 'Thời hạn nộp bài tập không hợp lệ.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    ASSIGNMENT_SUBMISSION_NOT_FOUND: {
        error: 'ASSIGNMENT_SUBMISSION_NOT_FOUND',
        message: 'Không tìm thấy bài làm.',
        httpStatus: common_1.HttpStatus.NOT_FOUND
    },
    ASSIGNMENT_SUBMITTED: {
        error: 'ASSIGNMENT_SUBMITTED',
        message: 'Bạn đã nộp bài tập.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    ASSIGNMENT_SUBMISSION_GRADED: {
        error: 'ASSIGNMENT_SUBMISSION_GRADED',
        message: 'Bài tập đã được chấm.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    ASSIGNMENT_SUBMISSION_NOT_START_YET: {
        error: 'ASSIGNMENT_SUBMISSION_NOT_START_YET',
        message: 'Chưa đến thời gian nộp bài tập. Vui lòng quay lại sau.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    ASSIGNMENT_SUBMISSION_DEADLINE_IS_OVER: {
        error: 'ASSIGNMENT_SUBMISSION_DEADLINE_IS_OVER',
        message: 'Đã hết thời gian nộp bài tập.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    STAFF_NOT_FOUND: {
        error: 'STAFF_NOT_FOUND',
        message: 'Thông tin nhân viên không tồn tại.',
        httpStatus: common_1.HttpStatus.NOT_FOUND
    },
    STAFF_IS_ASSIGNED_TO_RECRUITMENT_PROCESS: {
        error: 'STAFF_IS_ASSIGNED_TO_RECRUITMENT_PROCESS',
        message: 'Nhân viên được phân công vào một quá trình tuyển dụng.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    RECRUITMENT_NOT_FOUND: {
        error: 'RECRUITMENT_NOT_FOUND',
        message: 'Thông tin ứng tuyển không tồn tại.',
        httpStatus: common_1.HttpStatus.NOT_FOUND
    },
    RECRUITMENT_STATUS_INVALID: {
        error: 'RECRUITMENT_STATUS_INVALID',
        message: 'Trạng thái của đơn ứng tuyển không hợp lệ.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    RECRUITMENT_IS_IN_CHARGED_BY_ANOTHER_STAFF: {
        error: 'RECRUITMENT_IS_IN_CHARGED_BY_ANOTHER_STAFF',
        message: 'Đơn ứng tuyển đang được xử lý bởi nhân viên khác.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    CLASS_REQUEST_NOT_FOUND: {
        error: 'CLASS_REQUEST_NOT_FOUND',
        message: 'Không tìm thấy yêu cầu lớp học.',
        httpStatus: common_1.HttpStatus.NOT_FOUND
    },
    CREATE_CLASS_REQUEST_LIMIT: {
        error: 'CREATE_CLASS_REQUEST_LIMIT',
        message: 'Bạn đã đạt số lượng tạo yêu cầu khóa học trong ngày.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    CREATE_CLASS_REQUEST_SLOT_NUMBERS_INVALID: {
        error: 'CREATE_CLASS_REQUEST_SLOT_NUMBERS_INVALID',
        message: 'Tiết học của yêu cầu khóa học không hợp lệ.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    CLASS_REQUEST_STATUS_INVALID: {
        error: 'CLASS_REQUEST_STATUS_INVALID',
        message: 'Trạng thái của yêu cầu khóa học không hợp lệ.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    GARDEN_NOT_AVAILABLE_FOR_CLASS_REQUEST: {
        error: 'GARDEN_NOT_AVAILABLE_FOR_CLASS_REQUEST',
        message: 'Vườn đã chọn không phù hợp với yêu cầu khóa học.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    CANCEL_CLASS_REQUEST_CAN_NOT_BE_APPROVED: {
        error: 'CANCEL_CLASS_REQUEST_CAN_NOT_BE_APPROVED',
        message: 'Không thể duyệt yêu cầu hủy lớp này. Lớp học đã có học viên đăng ký.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    LEARNER_CLASS_EXISTED: {
        error: 'LEARNER_CLASS_EXISTED',
        message: 'Bạn đã tham gia vào lớp học này.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    TRANSACTION_NOT_FOUND: {
        error: 'TRANSACTION_NOT_FOUND',
        message: 'Không tìm thấy giao dịch.',
        httpStatus: common_1.HttpStatus.NOT_FOUND
    },
    SLOT_NOT_FOUND: {
        error: 'SLOT_NOT_FOUND',
        message: 'Không tìm thấy tiết học.',
        httpStatus: common_1.HttpStatus.NOT_FOUND
    },
    NUMBER_OF_ATTENDANCES_INVALID: {
        error: 'NUMBER_OF_ATTENDANCES_INVALID',
        message: 'Số lượng điểm danh không đúng.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    NOT_TIME_TO_TAKE_ATTENDANCE: {
        error: 'NOT_TIME_TO_TAKE_ATTENDANCE',
        message: 'Chưa tới giờ điểm danh. Vui lòng quay lại sau.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    TAKE_ATTENDANCE_IS_OVER: {
        error: 'TAKE_ATTENDANCE_IS_OVER',
        message: 'Đã hết thời gian điểm danh.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    PAYOUT_REQUEST_NOT_FOUND: {
        error: 'PAYOUT_REQUEST_NOT_FOUND',
        message: 'Không tìm thấy yêu cầu rút tiền.',
        httpStatus: common_1.HttpStatus.NOT_FOUND
    },
    PAYOUT_REQUEST_STATUS_INVALID: {
        error: 'PAYOUT_REQUEST_STATUS_INVALID',
        message: 'Trạng thái của yêu cầu rút tiền không hợp lệ.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    CREATE_PAYOUT_REQUEST_LIMIT: {
        error: 'CREATE_PAYOUT_REQUEST_LIMIT',
        message: 'Bạn đã đạt số lượng tạo yêu cầu rút tiền trong ngày.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    NOT_ENOUGH_BALANCE_TO_CREATE_PAYOUT_REQUEST: {
        error: 'NOT_ENOUGH_BALANCE_TO_CREATE_PAYOUT_REQUEST',
        message: 'Số dư không đủ để tạo yêu cầu rút tiền.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    PAYOUT_AMOUNT_LIMIT_PER_DAY: {
        error: 'PAYOUT_AMOUNT_LIMIT_PER_DAY',
        message: 'Bạn đã đạt hạn mức rút tiền trong ngày.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    REQUEST_ALREADY_HAS_MADE_PAYOUT: {
        error: 'REQUEST_ALREADY_HAS_MADE_PAYOUT',
        message: 'Yêu cầu rút tiền đã được thanh toán.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    FEEDBACK_NOT_FOUND: {
        error: 'FEEDBACK_NOT_FOUND',
        message: 'Không tìm thấy đánh giá của bạn.',
        httpStatus: common_1.HttpStatus.NOT_FOUND
    },
    FEEDBACK_NOT_OPEN_YET: {
        error: 'FEEDBACK_NOT_OPEN_YET',
        message: 'Chưa đến thời gian đánh giá lớp học.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    FEEDBACK_IS_OVER: {
        error: 'FEEDBACK_IS_OVER',
        message: 'Đã hết thời gian đánh giá lớp học.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    FEEDBACK_SUBMITTED: {
        error: 'FEEDBACK_SUBMITTED',
        message: 'Bạn đã gửi đánh giá.',
        httpStatus: common_1.HttpStatus.BAD_REQUEST
    },
    CERTIFICATE_NOT_FOUND: {
        error: 'CERTIFICATE_NOT_FOUND',
        message: 'Thông tin chứng chỉ không tồn tại.',
        httpStatus: common_1.HttpStatus.NOT_FOUND
    },
    USER_DEVICE_NOT_FOUND: {
        error: 'USER_DEVICE_NOT_FOUND',
        message: 'Không tìm thấy thôn tin thiết bị sử dụng.',
        httpStatus: common_1.HttpStatus.NOT_FOUND
    },
};
//# sourceMappingURL=error.js.map