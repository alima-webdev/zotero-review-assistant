async function testDocx() {
    const PizZip = await require("pizzip");
    const PizZipUtils = await require("pizzip/utils")
    const Docxtemplater = await require("docxtemplater");
    
    const FileSaver = await require("filesaver.js")

    PizZipUtils.getBinaryContent("template.docx", (error, content) => {
        console.log(content)
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });
        console.log(doc)
        doc.render({
            databases: 2
        })
        console.log(doc)

        const blob = doc.getZip().generate({
            type: "blob",
            mimeType:
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            // compression: DEFLATE adds a compression step.
            // For a 50MB output document, expect 500ms additional CPU time
            compression: "DEFLATE",
        });
        console.log(blob)

        // Output the document using Data-URI
        FileSaver.saveAs(blob, "output.docx");
    })
}

testDocx()