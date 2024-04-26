import { jsPDF } from "jspdf";
import Handlebars = require("handlebars");

import fs from "fs"

async function main() {
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

main()