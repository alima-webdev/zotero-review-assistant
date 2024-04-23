/* eslint-disable no-undef */
pref("__prefsPrefix__.enable", true);
pref("__prefsPrefix__.status-tag-prefix", "!review:");
pref("__prefsPrefix__.reason-tag-prefix", "reason:");
pref(
    "__prefsPrefix__.statuses",
    JSON.stringify([
        {
            name: "include",
            tag: "!review:include",
            label: "Include",
            color: "#60a5fa",
            askForReason: false,
            default: false,
            keyboardShortcut: "i",
        },
        {
            name: "exclude",
            tag: "!review:exclude",
            label: "Exclude",
            color: "#f87171",
            askForReason: true,
            default: false,
            keyboardShortcut: "x",
        },
        {
            name: "pending",
            tag: "!review:pending",
            label: "Pending",
            color: "#d4d4d4",
            askForReason: false,
            default: false,
            keyboardShortcut: "p",
        },
        {
            name: "unsure",
            tag: "!review:unsure",
            label: "Unsure",
            color: "#facc15",
            askForReason: false,
            default: false,
            keyboardShortcut: "u",
        },
        {
            name: "not-reviewed",
            tag: "",
            label: "",
            color: "transparent",
            askForReason: false,
            default: true,
            keyboardShortcut: "-",
        },
        // {name: 'not-reviewed', tag: '!review:not-reviewed', label: 'To Be Reviewed', color: 'transparent', askForReason: false, default: true},
    ]),
);
