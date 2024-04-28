
// import pdfMake from "pdfmake"
import Handlebars = require("handlebars");
import { countItemsWithTag, loadLocalFile } from "../utils/helpers";
import { log } from "../utils/devtools";
import { allStatuses, prismaEligibilityReasonTagPrefix, prismaSections, reasonTagPrefix } from "./global";
import { getReasonFromItem, getReasonsFromItems } from "../utils/reason";

const prismaTemplateURL = "chrome/content/prisma/template.html"
const prismaTemplateCSSURL = "chrome/content/prisma/template.css"

const prismaTestDataURL = "chrome/content/prisma/test.json"
const prismaTestExportURL = "chrome/content/prisma/test.pdf"

export function getPrismaHTML(prismaData: PRISMAData) {
    const prismaTemplate = loadLocalFile(
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

function isOtherReason(reason: string) {
    return !prismaSections.find(obj => {return obj.tag == reasonTagPrefix + reason})
}

export function getPrismaData(title: string = 'Title', items: Zotero.Item[]) {

    log("Fn: getPrismaData")

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

    // Get the label and count for all the other reasons
    let otherTotal = 0
    const otherReasons: {label: string, records: number}[] = []
    for(const item of items) {
        const reason = getReasonFromItem(item)
        if(isOtherReason(reason)) {
            // If reason is already created, increment
            const currentReasonInArray = otherReasons.filter(obj => obj.label == reason)[0]
            if(currentReasonInArray) {
                currentReasonInArray.records += 1
            } else {
                const currentReason = {
                    label: reason,
                    records: 1
                }
                otherReasons.push(currentReason)
            }

            otherTotal++
        }
    }

    log(scTotal)
    log(scScExcluded, scRetTotal, scRetExcluded, scElTotal)
    log(otherTotal)

    const incReports = scElTotal - otherTotal

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
                reasons: otherReasons
            }
        },
        included: {
            title: 'Included',
            records: {
                new: 0, // TEST
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