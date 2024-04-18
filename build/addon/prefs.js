/* eslint-disable no-undef */
pref("extensions.zoteroreview.enable", true);
pref("extensions.zoteroreview.status-tag-prefix", "!review:");
pref("extensions.zoteroreview.reason-tag-prefix", "reason:");
pref(
  "extensions.zoteroreview.statuses",
  JSON.stringify([
    {
      name: "include",
      tag: "!review:include",
      label: "Include",
      color: "#60a5fa",
      askForReason: false,
      default: false,
    },
    {
      name: "exclude",
      tag: "!review:exclude",
      label: "Exclude",
      color: "#fe6969",
      askForReason: true,
      default: false,
    },
    {
      name: "pending",
      tag: "!review:pending",
      label: "Pending",
      color: "#9ca3af",
      askForReason: false,
      default: false,
    },
    {
      name: "unsure",
      tag: "!review:unsure",
      label: "Unsure",
      color: "#facc15",
      askForReason: false,
      default: false,
    },
    {
      name: "not-reviewed",
      tag: "",
      label: "To Be Reviewed",
      color: "transparent",
      askForReason: false,
      default: true,
    },
    // {name: 'not-reviewed', tag: '!review:not-reviewed', label: 'To Be Reviewed', color: 'transparent', askForReason: false, default: true},
  ]),
);
