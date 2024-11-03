export const RECRUITMENT_DETAIL_PROJECTION = [
  '_id',
  'applicationInfo',
  'meetingUrl',
  'status',
  'histories',
  'rejectReason',
  'handledBy',
  'isInstructorAdded',
  'createdAt',
  'updatedAt'
] as const

export const RECRUITMENT_LIST_PROJECTION = [
  '_id',
  'applicationInfo',
  'meetingUrl',
  'status',
  'rejectReason',
  'handledBy',
  'createdAt',
  'updatedAt'
] as const
