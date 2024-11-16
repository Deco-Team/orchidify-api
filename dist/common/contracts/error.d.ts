import { HttpStatus } from '@nestjs/common';
export declare const Errors: {
    INTERNAL_SERVER_ERROR: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    OBJECT_NOT_FOUND: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    UPLOAD_MEDIA_ERROR: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    VALIDATION_FAILED: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    EMAIL_ALREADY_EXIST: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    SETTING_NOT_FOUND: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    WRONG_EMAIL_OR_PASSWORD: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    UNVERIFIED_ACCOUNT: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    INACTIVE_ACCOUNT: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    REFRESH_TOKEN_INVALID: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    WRONG_OTP_CODE: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    OTP_CODE_IS_EXPIRED: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    RESEND_OTP_CODE_LIMITED: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    LEARNER_NOT_FOUND: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    INSTRUCTOR_NOT_FOUND: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    INSTRUCTOR_HAS_IN_PROGRESSING_APPLICATIONS: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    INSTRUCTOR_HAS_PUBLISHED_OR_IN_PROGRESSING_CLASSES: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    INSTRUCTOR_HAS_NO_SELECTED_APPLICATIONS: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    GARDEN_MANAGER_NOT_FOUND: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    GARDEN_MANAGER_IS_ASSIGNED_TO_GARDEN: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    GARDEN_NOT_FOUND: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    GARDEN_NAME_EXISTED: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    SCHEDULED_OR_IN_PROGRESSING_CLASS_IN_GARDEN: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    GARDEN_INACTIVE: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    GARDEN_TIMESHEET_NOT_FOUND: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    CAN_NOT_UPDATE_GARDEN_TIMESHEET: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    COURSE_NOT_FOUND: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    CAN_NOT_UPDATE_COURSE: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    CAN_NOT_DELETE_COURSE: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    COURSE_CAN_NOT_CREATE_REQUEST_TO_PUBLISH_CLASS: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    COURSE_STATUS_INVALID: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    TOTAL_SESSIONS_OF_COURSE_INVALID: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    TOTAL_ASSIGNMENTS_OF_COURSE_INVALID: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    LAST_SESSION_MUST_NOT_HAVE_ASSIGNMENTS: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    CHILD_COURSE_COMBO_INVALID: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    COURSE_COMBO_NOT_FOUND: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    COURSE_COMBO_EXISTED: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    CLASS_NOT_FOUND: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    WEEKDAYS_OF_CLASS_INVALID: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    CLASS_STATUS_INVALID: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    CLASS_LEARNER_LIMIT: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    CLASS_TIMESHEET_INVALID: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    CLASS_NOT_START_YET: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    CLASS_ENDED: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    CLASS_END_TIME_INVALID: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    NOT_ENROLL_CLASS_YET: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    CLASS_CAN_NOT_CREATE_REQUEST_TO_CANCEL_CLASS: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    SESSION_NOT_FOUND: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    ASSIGNMENT_NOT_FOUND: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    ASSIGNMENT_DEADLINE_INVALID: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    ASSIGNMENT_SUBMISSION_NOT_FOUND: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    ASSIGNMENT_SUBMITTED: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    ASSIGNMENT_SUBMISSION_GRADED: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    ASSIGNMENT_SUBMISSION_NOT_START_YET: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    ASSIGNMENT_SUBMISSION_DEADLINE_IS_OVER: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    STAFF_NOT_FOUND: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    STAFF_IS_ASSIGNED_TO_RECRUITMENT_PROCESS: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    RECRUITMENT_NOT_FOUND: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    RECRUITMENT_STATUS_INVALID: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    RECRUITMENT_IS_IN_CHARGED_BY_ANOTHER_STAFF: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    CLASS_REQUEST_NOT_FOUND: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    CREATE_CLASS_REQUEST_LIMIT: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    CREATE_CLASS_REQUEST_SLOT_NUMBERS_INVALID: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    CLASS_REQUEST_STATUS_INVALID: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    GARDEN_NOT_AVAILABLE_FOR_CLASS_REQUEST: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    CANCEL_CLASS_REQUEST_CAN_NOT_BE_APPROVED: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    LEARNER_CLASS_EXISTED: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    TRANSACTION_NOT_FOUND: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    SLOT_NOT_FOUND: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    NUMBER_OF_ATTENDANCES_INVALID: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    NOT_TIME_TO_TAKE_ATTENDANCE: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    TAKE_ATTENDANCE_IS_OVER: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    PAYOUT_REQUEST_NOT_FOUND: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    PAYOUT_REQUEST_STATUS_INVALID: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    CREATE_PAYOUT_REQUEST_LIMIT: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    NOT_ENOUGH_BALANCE_TO_CREATE_PAYOUT_REQUEST: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    FEEDBACK_NOT_OPEN_YET: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    FEEDBACK_IS_OVER: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    FEEDBACK_SUBMITTED: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    CERTIFICATE_NOT_FOUND: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
    USER_DEVICE_NOT_FOUND: {
        error: string;
        message: string;
        httpStatus: HttpStatus;
    };
};
