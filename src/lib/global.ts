import { getPref } from "../utils/prefs";

// Load Preferences
export let allStatuses: Status[] = JSON.parse(String(getPref("statuses")));
export let statusTagPrefix = String(getPref("status-tag-prefix"));
export let reasonTagPrefix = statusTagPrefix + String(getPref("reason-tag-prefix"));

// Load and reload prefs
export function reloadPrefs() {
  loadPrefs()
}
export function loadPrefs() {
  ztoolkit.log("Fn: loadPrefs")
  allStatuses = JSON.parse(String(getPref("statuses")));
  statusTagPrefix = String(getPref("status-tag-prefix"));
  reasonTagPrefix = statusTagPrefix + String(getPref("reason-tag-prefix"));
}
