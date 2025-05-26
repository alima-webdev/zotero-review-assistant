// Internal Dependencies
import { getKeyCombination } from "./utils"

// Types
import { PluginPreferences } from "../types/addon"

// Default preferences
const defaultPreferences: PluginPreferences = {
    // Status list
    statusList: [
        { label: "Included", tag: "#Status: Included", color: "#60a5fa", invertTextColor: false, keystroke: getKeyCombination("Alt I") },
        { label: "Excluded", tag: "#Status: Excluded", color: "#f87171", invertTextColor: true, keystroke: getKeyCombination("Alt X") },
        { label: "Pending", tag: "#Status: Pending", color: "#d4d4d4", invertTextColor: false, keystroke: getKeyCombination("Alt P") },
        { label: "Unsure", tag: "#Status: Unsure", color: "#facc15", invertTextColor: false, keystroke: getKeyCombination("Alt U") },
        { label: "Clear", tag: "", color: "transparent", invertTextColor: false, keystroke: getKeyCombination("Alt Minus") },
    ],
    // Comments tag prefix
    commentsTagPrefix: "#Status: Comments: ",

    // PRISMA tag prefix
    prismaTagPrefix: "#Status: PRISMA: ",
    // PRISMA categories
    prismaCategories: [
        { label: "Identification: Duplicated", name: "identification:duplicated", tag: "#Status: PRISMA: Identification: Duplicated" },
        { label: "Identification: Automation", name: "identification:automation", tag: "#Status: PRISMA: Identification: Automation" },
        { label: "Identification: Other", name: "identification:other", tag: "#Status: PRISMA: Identification: Other" },
        { label: "Screening: Excluded", name: "screening:screen:excluded", tag: "#Status: PRISMA: Screening: Excluded Before Screening" },
        { label: "Screening: Not Retrieved", name: "screening:retrieval:excluded", tag: "#Status: PRISMA: Retrieval: Not Retrieved" },
        { label: "Screening: Not Eligible", name: "screening:eligibility:excluded", tag: "#Status: PRISMA: Eligibility: Not Eligible", allowCustomReason: true },
        { label: "Included: Study", name: "included:studies", tag: "#Status: PRISMA: Included: Study" },
        { label: "Included: Report", name: "included:reports", tag: "#Status: PRISMA: Included: Report" },
    ],

    // Keyboard Shortcuts
    editStatusShortcut: getKeyCombination("Alt S"),
    generatePRISMAShortcut: getKeyCombination("Alt D"),
}
export default defaultPreferences
