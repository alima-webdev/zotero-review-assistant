import { getPref } from "../utils/prefs";
// import { ReviewStatus } from "../types"

// Load Preferences
export const allStatuses: ReviewStatus[] = JSON.parse(String(getPref('statuses')))
export const statusTagPrefix = String(getPref('status-tag-prefix'))
export const reasonTagPrefix = statusTagPrefix + String(getPref('reason-tag-prefix'))