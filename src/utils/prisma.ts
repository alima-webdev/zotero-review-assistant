import { showFilePicker } from "./helpers";
import { getPluginInfo } from "./pluginInfo";

// File picker
const { FilePicker } = ChromeUtils.importESModule(
    "chrome://zotero/content/modules/filePicker.mjs",
);

export async function generatePrismaFromTemplate(prismaData) {
    const PizZip = await require("pizzip");
    const PizZipUtils = await require("pizzip/utils");
    const Docxtemplater = await require("docxtemplater");

    return new Promise((resolve, reject) => {
        const typeDocx =
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

        // Template path
        const templatePath = getPluginInfo().rootURI + "/assets/template.docx";
        PizZipUtils.getBinaryContent(
            templatePath,
            async (error: any, content: any) => {
                const zip = new PizZip(content);
                const doc = new Docxtemplater(zip, {
                    paragraphLoop: true,
                    linebreaks: true,
                });
                doc.render(prismaData);

                const blob = doc.getZip().generate({
                    type: "blob",
                    mimeType: typeDocx,
                    // compression: DEFLATE adds a compression step.
                    // For a 50MB output document, expect 500ms additional CPU time
                    compression: "DEFLATE",
                });

                // Show filepicker dialog to ask the user where to save it
                const outputPath = await showFilePicker(
                    typeDocx,
                    FilePicker.filterAll,
                    "prisma",
                );
                if (!outputPath) reject(false);

                const outputFile = Zotero.File.pathToFile(outputPath || "");
                const file = new File([blob], "prisma.docx", {
                    type: typeDocx,
                });
                Zotero.File.putContentsAsync(outputFile, file);
                resolve(true);
            },
        );
    });
}

// export function getPrismaSectionFromName(name: string) {
//     const section = prismaSections.filter((obj) => obj.name == name);
//     return section[0];
// }

// export function countItemsWithStatusName(name: string, items: Zotero.Item[]) {
//     const section = getPrismaSectionFromName(name);
//     // log(section);
//     return countItemsWithTag(section.tag, items);
// }

// export function getItemsWithTag(items: Zotero.Item[], tag: string) {
//     const itemsWithTag = [];
//     for (const item of items) {
//         if (item.hasTag(tag)) {
//             itemsWithTag.push(item);
//         }
//     }
//     return itemsWithTag;
// }

// function isOtherReason(reason: string) {
//     return !prismaSections.find((obj) => {
//         return obj.tag == reasonTagPrefix + reason;
//     });
// }

// export function getPRISMASectionFromItem(item: Zotero.Item) {
//     const section = prismaSections.find((obj) => item.hasTag(obj.tag));
//     return prismaSections.find((obj) => item.hasTag(obj.tag)) || [];
// }

// export function getPrismaData(items: Zotero.Item[]) {
//     // log("Fn: getPrismaData")

//     // Get excluded items
//     const exclusionTag = allStatuses.filter((obj) => obj.name == "excluded")[0]
//         .tag;
//     const excludedItems = getItemsWithTag(items, exclusionTag);

//     const idTotal = items.length;
//     const idDuplicates = countItemsWithStatusName(
//         "identification:duplicated",
//         excludedItems,
//     );
//     const idAutomation = countItemsWithStatusName(
//         "identification:automation",
//         excludedItems,
//     );
//     const idOther = countItemsWithStatusName(
//         "identification:other",
//         excludedItems,
//     );

//     const scTotal = idTotal - idDuplicates - idAutomation - idOther;
//     const scScExcluded = countItemsWithStatusName(
//         "screening:screen:excluded",
//         excludedItems,
//     );

//     const scRetTotal = scTotal - scScExcluded;
//     const scRetExcluded = countItemsWithStatusName(
//         "screening:retrieval:excluded",
//         excludedItems,
//     );

//     const scElTotal = scRetTotal - scRetExcluded;

//     // Get the label and count for all the other reasons
//     let otherTotal = 0;
//     const otherReasons: { label: string; records: number }[] = [];
//     for (const item of excludedItems) {
//         let reason = getReasonFromItem(item);
//         if (isOtherReason(reason)) {
//             // If no reason provided, use the default label
//             if (!reason) reason = getString("report-reason-default-label");

//             // If reason is already created, increment
//             const currentReasonInArray = otherReasons.filter(
//                 (obj) => obj.label == reason,
//             )[0];
//             if (currentReasonInArray) {
//                 currentReasonInArray.records += 1;

//                 // If new reason, add it to the array
//             } else {
//                 const currentReason = {
//                     label: reason,
//                     records: 1,
//                 };
//                 otherReasons.push(currentReason);
//             }

//             // Increment the total
//             otherTotal++;
//         }
//     }

//     const incTotal = scElTotal - otherTotal;

//     const prismaData: PRISMAData = {
//         identification: {
//             collection: {
//                 databases: 0,
//                 registers: idTotal,
//                 other: idOther,
//             },
//             excluded: {
//                 duplicates: idDuplicates,
//                 automation: idAutomation,
//                 other: idOther,
//             },
//         },
//         screening: {
//             screen: {
//                 total: scTotal,
//                 excluded: scScExcluded,
//             },
//             retrieval: {
//                 total: scRetTotal,
//                 excluded: scRetExcluded,
//             },
//             eligibility: {
//                 total: scElTotal,
//                 reasons: otherReasons,
//             },
//         },
//         included: {
//             total: incTotal,
//             records: {
//                 studies: 0,
//                 reports: 0,
//             },
//         },
//     };

//     return prismaData;
// }

// export function getPRISMAEligibilityOtherReasons(items: Zotero.Item[]) {
//     const reasons = [];
//     for (const item of items) {
//         const reason = getPRISMAEligibilityOtherReason(item);
//         if (reason) {
//             reasons.push(reason);
//         }
//     }

//     return reasons;
// }
// export function getPRISMAEligibilityOtherReason(item: Zotero.Item) {
//     const tags = item.getTags();
//     const reasonTags = tags.filter((obj) => {
//         return prismaEligibilityReasonTagPrefix.includes(obj.tag);
//     });
//     // log(tags, reasonTags);
//     return reasonTags[0] || undefined;
// }

// type PRISMAData = {
//     identification: {
//         collection: {
//             databases: number;
//             registers: number;
//             other: number;
//         };
//         excluded: {
//             duplicates: number;
//             automation: number;
//             other: number;
//         };
//     };
//     screening: {
//         screen: {
//             total: number;
//             excluded: number;
//         };
//         retrieval: {
//             total: number;
//             excluded: number;
//         };
//         eligibility: {
//             total: number;
//             reasons: {
//                 label: string;
//                 records: number;
//             }[];
//         };
//     };
//     included: {
//         total: number;
//         records: {
//             studies: number;
//             reports: number;
//         };
//     };
// };