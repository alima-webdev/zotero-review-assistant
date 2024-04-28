import { Keystroke } from "../ui/form/keystrokeInput";
import { getPref } from "../utils/prefs";

// Load Preferences
export let allStatuses: Status[] = JSON.parse(String(getPref("statuses")));
export let statusTagPrefix = String(getPref("status-tag-prefix"));
export let reasonTagPrefix = String(getPref("reason-tag-prefix"));
export let prismaSections: PRISMASection[] = JSON.parse(
    String(getPref("prisma-sections")),
);
export let prismaEligibilityReasonTagPrefix = reasonTagPrefix;

// Load and reload prefs
export function reloadPrefs() {
    // ztoolkit.log("Fn: reloadPrefs");
    loadPrefs();
}
export function loadPrefs() {
    // ztoolkit.log("Fn: loadPrefs");
    allStatuses = JSON.parse(String(getPref("statuses")));
    allStatuses.map((status) => {
        status.keystroke = Keystroke.fromString(status.keyboardShortcut);
        return status;
    });
    statusTagPrefix = String(getPref("status-tag-prefix"));
    reasonTagPrefix = String(getPref("reason-tag-prefix"));
    prismaSections = JSON.parse(String(getPref("prisma-sections")));
    prismaEligibilityReasonTagPrefix = reasonTagPrefix;
}
