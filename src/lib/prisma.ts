// import html2canvas from '../vendors/html2canvas/src/index';
import Handlebars = require("handlebars");
import { countItemsWithTag, loadLocalFile, loadXHTMLFromFile, parseXHTML, parseXHTMLFromFile } from "../utils/helpers";
import { log } from "../utils/development";
import { allStatuses, prismaEligibilityReasonTagPrefix, prismaSections } from "./global";

const prismaTemplateURL = "chrome/content/prisma/template.html"
const prismaTemplateCSSURL = "chrome/content/prisma/template.css"

const prismaTestDataURL = "chrome/content/prisma/test.json"
const prismaTestExportURL = "chrome/content/prisma/test.pdf"


type PRISMAData = {
    title: string,
    identification: {
        title: string,
        collection: {
            databases: number,
            registers: number,
            other: number
        },
        excluded: {
            duplicates: number,
            automation: number,
            other: number
        }
    },
    screening: {
        title: string,
        screen: {
            total: number,
            excluded: number,
        },
        retrieval: {
            total: number,
            excluded: number,
        },
        eligibility: {
            total: number,
            reasons: {
                label: string,
                records: number,
            }[]
        }
    },
    included: {
        title: string,
        records: {
            new: number,
            reports: number,
        }
    }
}

export function getPrismaHTML(prismaData: PRISMAData) {
    const prismaTemplate = loadXHTMLFromFile(
        rootURI + prismaTemplateURL,
    );

    // Use the template to generate the HTML
    const template = Handlebars.compile(prismaTemplate);
    const processedHTML = template(prismaData)

    return processedHTML
}

export function getPrismaDOM(prismaData: PRISMAData) {
    const processedHTML = getPrismaHTML(prismaData)
    const prismaDOM = document.createElement('div')
    prismaDOM.innerHTML = processedHTML

    // Include the CSS stylesheet
    const stylesheet = loadLocalFile(
        rootURI + prismaTemplateCSSURL,
    )
    const styleTag = document.createElement('style')
    styleTag.type = "text/css"
    styleTag.innerHTML = stylesheet
    prismaDOM.appendChild(styleTag)

    return prismaDOM
}

export async function generatePrismaPDF() {

    const prismaDOM = getPrismaDOM()
    ztoolkit.log(prismaDOM)
    // const prismaNodes = ztoolkit.getGlobal("document").importNode(prismaDOM)
    ztoolkit.getGlobal("document").documentElement.appendChild(prismaDOM)

    const canvas = ztoolkit.getGlobal("document").createElement("canvas");
    // ztoolkit.getGlobal("document").append(canvas)


    // const html2canvas = await require('html2canvas');
    // const prismaCanvas = await html2canvas(prismaDOM)

    // const rasterizeHTML = await require('rasterizehtml');
    // rasterizeHTML.drawHTML('Some ' +
    //                        '<span style="color: green; font-size: 20px;">HTML</span>' +
    //                        ' with an image <img src="someimg.png">',
    //                        canvas);

    // const console = window.console
    ztoolkit.log(ztoolkit.getGlobal("window"))
    ztoolkit.log(document)

    const Node = ztoolkit.getGlobal("window").Node


    // ztoolkit.log(Node)

    // html2pdf.html(prismaDOM, { x: 0, y: 0 });
    // html2pdf.save(rootURI + prismaTestExportURL);

    ztoolkit.log("getPrismaHTML")
    // ztoolkit.log(prismaCanvas)
}
/*
async function generatePRISMAPDF() {
    // Default export is a4 paper, portrait, using millimeters for units
    const doc = new jsPDF();

    const rawHTML = await fetch("./prisma-template.html").then(response => response.text())

    // Use the template to generate the HTML
    const template = Handlebars.compile(rawHTML);
    const prismaData = await fetch("./prisma-template.json").then(response => response.json())
    const processedHTML = template(prismaData)
    const parser = new DOMParser()

    const dom = parser.parseFromString(processedHTML, 'text/html')
    // document.querySelector('.prisma-diagram').innerHTML = template(prismaData)
    // document.querySelector('template').remove()

    // Include the CSS stylesheet
    const stylesheet = await fetch("./prisma-template.css").then(response => response.text())
    const styleTag = document.createElement('style')
    styleTag.type = "text/css"
    styleTag.innerHTML = stylesheet
    dom.body.appendChild(styleTag)

    // const 
    doc.html(dom.body, { x: 0, y: 0 });
    doc.save("a4.pdf");
}
*/

export function getPrismaSectionFromName(name: string) {
    const section = prismaSections.filter(obj => obj.name == name)
    return section[0]
}

export function countItemsWithStatusName(name: string, items: Zotero.Item[]) {
    const section = getPrismaSectionFromName(name)
    log(section)
    return countItemsWithTag(section.tag, items)
}

export function getItemsWithTag(items: Zotero.Item[], tag: string) {
    const itemsWithTag = []
    for(const item of items) {
        if(item.hasTag(tag)) {
            itemsWithTag.push(item)
        }
    }
    return itemsWithTag
}

export function getPrismaData(title: string = 'Title', items: Zotero.Item[]) {

    // Get excluded items
    const exclusionTag = allStatuses.filter(obj => obj.name == 'excluded')[0].tag
    const excludedItems = getItemsWithTag(items, exclusionTag)

    const idTotal = items.length
    const idDuplicates = countItemsWithStatusName('identification:duplicated', excludedItems)
    const idAutomation = countItemsWithStatusName('identification:automation', excludedItems)
    const idOther = countItemsWithStatusName('identification:other', excludedItems)

    // log(idTotal, idDuplicates, idAutomation, idOther)

    const scTotal = idTotal - idDuplicates - idAutomation - idOther
    const scScExcluded = countItemsWithStatusName('screening:screen:excluded', excludedItems)

    const scRetTotal = scTotal - scScExcluded
    const scRetExcluded = countItemsWithStatusName('screening:retrieval:excluded', excludedItems)

    const scElTotal = scRetTotal - scRetExcluded

    // log(scTotal, scScExcluded, scRetTotal, scRetExcluded, scElTotal)
    // TODO: Reasons

    const incReports = scElTotal

    const prismaData: PRISMAData = {
        title: "Title",
        identification: {
            title: 'Identification',
            collection: {
                databases: 2, // TEST
                registers: idTotal,
                other: idOther,
            },
            excluded: {
                duplicates: idDuplicates,
                automation: idAutomation,
                other: idOther,
            }
        },
        screening: {
            title: 'Screening',
            screen: {
                total: scTotal,
                excluded: scScExcluded,
            },
            retrieval: {
                total: scRetTotal,
                excluded: scRetExcluded,
            },
            eligibility: {
                total: scElTotal,
                reasons: [
                    // {
                    //     "label": "Reason 1",
                    //     "records": 115
                    // },
                    // {
                    //     "label": "Reason 2",
                    //     "records": 125
                    // }
                ]
            }
        },
        included: {
            title: 'Included',
            records: {
                new: 0,
                reports: incReports,
            }
        }
    }

    return prismaData;
}

export function getPRISMAEligibilityOtherReasons(items: Zotero.Item[]) {
    const reasons = []
    for (const item of items) {
        const reason = getPRISMAEligibilityOtherReason(item)
        if (reason) {
            reasons.push(reason)
        }
    }

    return reasons
}
export function getPRISMAEligibilityOtherReason(item: Zotero.Item) {
    const tags = item.getTags()
    const reasonTags = tags.filter(obj => {
        return prismaEligibilityReasonTagPrefix.includes(obj.tag)
    })
    log(tags, reasonTags)
    return reasonTags[0] || undefined
}