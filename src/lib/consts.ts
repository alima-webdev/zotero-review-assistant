import { getPref } from "../utils/prefs";

// Load Preferences
export const allStatuses: Status[] = JSON.parse(String(getPref('statuses')))
export const statusTagPrefix = String(getPref('status-tag-prefix'))
export const reasonTagPrefix = statusTagPrefix + String(getPref('reason-tag-prefix'))