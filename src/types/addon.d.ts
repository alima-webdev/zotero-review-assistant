import { KeyCombination } from "./types";

// Custom Types
type ArticleStatus = {
    tag: string,
    label: string,
    color: string,
    invertTextColor: boolean,
    keystroke?: KeyCombination,
}

// PRISMA Categories
type PRISMACategory = {
    name: string,
    label: string,
    tag: string,
    allowCustomReason?: boolean,
}

// Preferences
type PluginPreferences = {
    statusList: ArticleStatus[],
    commentsTagPrefix: string,
    prismaTagPrefix: string,
    prismaCategories: PRISMACategory[],
    editStatusShortcut: KeyCombination,
    generatePRISMAShortcut: KeyCombination,
}