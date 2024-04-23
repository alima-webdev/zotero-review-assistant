/* eslint-disable no-undef */
pref("__prefsPrefix__.enable", true);
pref("__prefsPrefix__.status-tag-prefix", "Status: ");
pref("__prefsPrefix__.reason-tag-prefix", "Reason: ");
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
            keyboardShortcut: "i",
        },
        {
            name: "excluded",
            tag: "Status: Excluded",
            label: "Excluded",
            color: "#f87171",
            askForReason: true,
            default: false,
            keyboardShortcut: "x",
        },
        {
            name: "pending",
            tag: "Status: Pending",
            label: "Pending",
            color: "#d4d4d4",
            askForReason: false,
            default: false,
            keyboardShortcut: "p",
        },
        {
            name: "unsure",
            tag: "Status: Unsure",
            label: "Unsure",
            color: "#facc15",
            askForReason: false,
            default: false,
            keyboardShortcut: "u",
        },
        {
            name: "no-status",
            tag: "",
            label: "",
            color: "transparent",
            askForReason: false,
            default: true,
            keyboardShortcut: "-",
        },
    ]),
);
