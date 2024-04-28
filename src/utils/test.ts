import { getPrismaData } from "../lib/prisma";
import { canvasToBlob, nodeToDataURL } from "../vendors/html-to-image/src/util";
import { log } from "./devtools";
import { exportFileWithContent, showFilePicker } from "./helpers";

const { FilePicker } = ChromeUtils.importESModule('chrome://zotero/content/modules/filePicker.mjs');

export function htmlToPng(element) {
    return new Promise(async (resolve, reject) => {
        log("testPDF")
        log(element)


        const width = element.offsetWidth
        const height = element.offsetHeight
        let clone;
        if (element.name == 'iframe') {
            clone = cloneIFrame(element) as HTMLElement
        } else {
            clone = element.cloneNode(true) as HTMLElement
        }

        // Get the data URL
        // const dataURL = await nodeToDataURL(clone, width, height)
        const xmlns = 'http://www.w3.org/2000/svg'
        const svg = document.createElementNS(xmlns, 'svg')
        const foreignObject = document.createElementNS(xmlns, 'foreignObject')

        // const foreignObject = document.createElement('foreignObject')
        foreignObject.appendChild(cloneIFrame(element))
        svg.appendChild(foreignObject)

        svg.setAttribute('width', `${width}`)
        svg.setAttribute('height', `${height}`)
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`)

        foreignObject.setAttribute('width', '100%')
        foreignObject.setAttribute('height', '100%')
        foreignObject.setAttribute('x', '0')
        foreignObject.setAttribute('y', '0')
        foreignObject.setAttribute('externalResourcesRequired', 'true')


        // let dataString = await new XMLSerializer().serializeToString(svg)
        // dataString = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(dataString)}`
        const dataURL = await svgToDataURL(svg)
        log(dataURL)

        // Create canvas
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        // Create image
        const img = document.createElement('img') as HTMLImageElement
        img.crossOrigin = 'anonymous';
        img.src = dataURL

        // Copy image over to canvas and get the final data
        img.onload = async () => {
            // canvas.getContext("2d")?.drawImage(img, 0, 0, width, height, 0, 0, width * 2, height * 2)
            const context = canvas.getContext("2d") as CanvasRenderingContext2D
            context.drawImage(img, 0, 0, width, height, 0, 0, width, height)

            // Final data

            canvas.toBlob(blob => {
                blob?.text().then(res => {
                    resolve(res)
                })
            }, 'image/svg')
            // resolve()
            // const data = context.getImageData(0, 0, canvas.width, canvas.height)

            // const data = canvas.toDataURL()
            // canvas.toBlob(function(blob){
            //     const url = URL.createObjectURL(blob);
            //     console.log(blob);
            //     console.log(url); // this line should be here
            //   }, 'image/jpeg', 0.95);
            // const data = context.getImageData(0, 0, canvas.width, canvas.height)


            // const data = canvas.toDataURL('image/png')
            // resolve(data);
        }
        element.contentWindow?.document.body.appendChild(canvas)
    })

    // const data = context.getImageData(0, 0, width, height).data
    // const blob = await canvasToBlob(canvas)
    // log(blob)
    // log(data)
    // element.contentWindow?.document.body.appendChild(canvas)
    // element.contentWindow?.document.body.appendChild(img)
    // return;

    // import ("../vendors/excanvas/excanvas.js")
    /*
    const width = 500
    const height = 500

    const content = element.contentWindow?.document.body.innerHTML || ""

    // const svg = document.createElement('svg') as HTMLCanvasElement

    const xmlns = 'http://www.w3.org/2000/svg'
    const svg = document.createElementNS(xmlns, 'svg')
    const foreignObject = document.createElementNS(xmlns, 'foreignObject')

    // const foreignObject = document.createElement('foreignObject')
    foreignObject.appendChild(cloneIFrame(element))
    svg.appendChild(foreignObject)

    svg.setAttribute('width', `${width}`)
    svg.setAttribute('height', `${height}`)
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)

    foreignObject.setAttribute('width', '100%')
    foreignObject.setAttribute('height', '100%')
    foreignObject.setAttribute('x', '0')
    foreignObject.setAttribute('y', '0')
    foreignObject.setAttribute('externalResourcesRequired', 'true')


    // let dataString = await new XMLSerializer().serializeToString(svg)
    // dataString = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(dataString)}`
    const dataString = await svgToDataURL(svg)
    log("String:")
    log(dataString)
    // .then(encodeURIComponent)
    // .then((html) => `data:image/svg+xml;charset=utf-8,${html}`)


    const img = document.createElement('img') as HTMLImageElement
    img.src = dataString
    element.contentWindow?.document.body.appendChild(img)

    // log(element)

    // const { toSvg } = await import("../vendors/html-to-image/src");
    // const canvas = await toSvg(element)
    // log("Image Data:")
    // log(imgData)
    */
}

function cloneIFrame(element: HTMLIFrameElement) {

    // const content = element.contentWindow?.document.body.innerHTML || ""
    // const iframe = document.createElement('iframe') as HTMLIFrameElement
    // iframe.contentWindow.document.body = content
    const clone = element.contentDocument.body.cloneNode(true)
    return clone
}

export async function svgToDataURL(svg: SVGElement): Promise<string> {
    return Promise.resolve()
        .then(() => new XMLSerializer().serializeToString(svg))
        .then(encodeURIComponent)
        .then((html) => `data:image/svg+xml;charset=utf-8,${html}`)
}

export async function generatePrismaFromTemplate(prismaData: PRISMAData) {

    log("Fn: testDocx")
    const typeDocx = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    const PizZip = await require("pizzip");
    const PizZipUtils = await require("pizzip/utils")
    const Docxtemplater = await require("docxtemplater");

    // Template path
    const templatePath = rootURI + "chrome/content/prisma/template.docx"
    PizZipUtils.getBinaryContent(templatePath, async (error: any, content: any) => {
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });
        doc.render(prismaData)

        const blob = doc.getZip().generate({
            type: "blob",
            mimeType: typeDocx,
            // compression: DEFLATE adds a compression step.
            // For a 50MB output document, expect 500ms additional CPU time
            compression: "DEFLATE",
        });

        // Show filepicker dialog to ask the user where to save it
        const outputPath = await showFilePicker(typeDocx, FilePicker.filterAll, 'prisma')
        if(!outputPath) return false

        const outputFile = Zotero.File.pathToFile(outputPath)
        const file = new File([blob], "prisma.docx", {type: typeDocx});
        Zotero.File.putContentsAsync(outputFile, file)
    })
}



























/*
export async function testDocx() {
    log("Fn: testDocx")
    const PizZip = await require("pizzip");
    const PizZipUtils = await require("pizzip/utils")
    log("TEST")
    const Docxtemplater = await require("docxtemplater");
    // const FileSaver = await require("filesaver.js")
    const templatePath = rootURI + "chrome/content/prisma/template.docx"
    PizZipUtils.getBinaryContent(templatePath, async (error, content) => {
        log(content)
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });
        log(doc)
        doc.render({
            databases: 2
        })
        log(doc)

        const blob = doc.getZip().generate({
            type: "blob",
            mimeType:
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            // compression: DEFLATE adds a compression step.
            // For a 50MB output document, expect 500ms additional CPU time
            compression: "DEFLATE",
        });
        log(blob)

        const outputPath = "~/Downloads/test.docx"
        const outputFile = Zotero.File.pathToFile(outputPath)
        const f = new File([blob], "test.docx", {type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
        Zotero.File.putContentsAsync(outputFile, f)

        // Output the document using Data-URI
        // FileSaver.saveAs(blob, "output.docx");
    })
}
*/