export declare const COURSE_LIST_PROJECTION: readonly ["_id", "code", "title", "price", "level", "type", "duration", "thumbnail", "status", "learnerLimit", "rate", "ratingSummary", "discount", "instructorId", "isRequesting", "createdAt", "updatedAt"];
export declare const COURSE_DETAIL_PROJECTION: readonly ["_id", "code", "title", "description", "price", "level", "type", "duration", "thumbnail", "media", "status", "sessions", "learnerLimit", "rate", "ratingSummary", "discount", "gardenRequiredToolkits", "instructorId", "isRequesting", "createdAt", "updatedAt"];
export declare const PUBLIC_COURSE_DETAIL_PROJECTION: readonly ["_id", "code", "title", "description", "price", "level", "type", "duration", "thumbnail", "media", "status", "sessions._id", "sessions.title", "learnerLimit", "rate", "ratingSummary", "discount", "gardenRequiredToolkits", "instructorId", "isRequesting", "createdAt", "updatedAt"];
