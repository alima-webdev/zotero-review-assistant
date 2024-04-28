const statusTagPrefix = "Status: ";
const reasonTagPrefix = statusTagPrefix + "Reason: ";
pref("__prefsPrefix__.enable", true);
pref("__prefsPrefix__.status-tag-prefix", statusTagPrefix);
pref("__prefsPrefix__.reason-tag-prefix", reasonTagPrefix);
pref(
    "__prefsPrefix__.statuses",
    JSON.stringify([
        {
            name: "included",
            tag: "Status: Included",
            label: "Included",
            color: "#60a5fa",
            askForReason: false,
            default: false,
            keyboardShortcut: "Alt I",
        },
        {
            name: "excluded",
            tag: "Status: Excluded",
            label: "Excluded",
            color: "#f87171",
            askForReason: true,
            default: false,
            keyboardShortcut: "Alt X",
        },
        {
            name: "pending",
            tag: "Status: Pending",
            label: "Pending",
            color: "#d4d4d4",
            askForReason: false,
            default: false,
            keyboardShortcut: "Alt P",
        },
        {
            name: "unsure",
            tag: "Status: Unsure",
            label: "Unsure",
            color: "#facc15",
            askForReason: false,
            default: false,
            keyboardShortcut: "Alt U",
        },
        {
            name: "no-status",
            tag: "",
            label: "",
            color: "transparent",
            askForReason: false,
            default: true,
            keyboardShortcut: "Alt -",
        },
    ]),
);

// PRISMA diagram variables
// pref("__prefsPrefix__.prisma-eligibility-reason-prefix", 'PRISMA: Screening: Other Reason: ')
pref(
    "__prefsPrefix__.prisma-sections",
    JSON.stringify([
        {
            label: "Identification: Duplicated",
            name: "identification:duplicated",
            tag: reasonTagPrefix + "Duplicated",
            // tag: ': Duplicated'
        },
        {
            label: "Identification: Automation",
            name: "identification:automation",
            tag: reasonTagPrefix + "Automation",
        },
        {
            label: "Identification: Other",
            name: "identification:other",
            tag: reasonTagPrefix + "Identification: Other",
        },
        {
            label: "Screening: Excluded",
            name: "screening:screen:excluded",
            tag: reasonTagPrefix + "Excluded Before Screening",
        },
        {
            label: "Screening: Not Retrieved",
            name: "screening:retrieval:excluded",
            tag: reasonTagPrefix + "Not Retrieved",
        },
        {
            label: "Screening: Not Eligible",
            name: "screening:eligibility:excluded",
            tag: reasonTagPrefix + "Not Eligible",
        },
        {
            label: "Screening: Other Reason",
            name: "screening:eligibility:other",
            tag: "",
        },
    ]),
);
