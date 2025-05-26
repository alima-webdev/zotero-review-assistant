import { ChangeEvent, forwardRef, ReactElement, Ref, useImperativeHandle, useRef, useState } from "react";
import Modal, { ModalComponent } from "../components/modal";
import { useKeyboardShortcut, usePref } from "../utils/hooks";
import defaultPreferences from "../utils/prefs.default";
import { KeyCombination, usePrefStateFunction } from "../types/types";
import { useForm } from "react-hook-form";
import { generatePrismaFromTemplate } from "../utils/prisma";
import { PRISMACategory } from "../types/addon";
import { countArticlesWithTag, getComments, mergeRefs } from "../utils/utils";

// Types
type PRISMAFormData = {
    databases: number,
    registers: number,
    studies: number,
    reports: number,
    useOtherReasons: boolean,
}
type PRISMAOtherReason = {
    label: string,
    records: number,
}
export interface PRISMAViewComponent {
    open: () => void
}

// React Component
const PRISMAView = forwardRef<PRISMAViewComponent>((_, ref) => {

    // Prefs
    const [prismaCategories,] = usePref("prismaCategories", defaultPreferences.prismaCategories, { parseJSON: true, observe: true }) as [PRISMACategory[], usePrefStateFunction]
    const [generatePRISMAShortcut,] = usePref("generatePRISMAShortcut", defaultPreferences.generatePRISMAShortcut, { parseJSON: true, observe: true }) as [KeyCombination, usePrefStateFunction]
    const [commentsTagPrefix,] = usePref("commentsTagPrefix", defaultPreferences.commentsTagPrefix, { observe: true }) as [string, usePrefStateFunction]

    // Refs
    const modalRef = useRef<ModalComponent>(null)
    const studiesRef = useRef<HTMLInputElement>(null)
    const reportsRef = useRef<HTMLInputElement>(null)

    // Status
    const [modalOpen, setModalOpen] = useState<boolean>(false)

    // Form
    const { register, setValue, handleSubmit } = useForm<PRISMAFormData>({
        defaultValues: {
            useOtherReasons: true
        }
    })

    const studiesProps = register("studies", { valueAsNumber: true })
    const reportsProps = register("reports", { valueAsNumber: true })

    // Get articles
    const selectedArticles = ZoteroPane.getSelectedItems()
    const totalArticles = selectedArticles.length
    // const studyIncludedCategory = prismaCategories.find(cat => cat.name == "included:studies")
    // const reportIncludedCategory = prismaCategories.find(cat => cat.name == "included:reports")
    // console.log(studyIncludedCategory, reportIncludedCategory)
    // const includedStudies = selectedArticles.filter(art => art.hasTag(studyIncludedCategory.tag) || art.hasTag(reportIncludedCategory.tag))
    // const includedReports = selectedArticles.filter(art => art.hasTag(studyIncludedCategory.tag) || art.hasTag(reportIncludedCategory.tag))
    // console.log(studyIncludedCategory, reportIncludedCategory)

    // Events
    const open = () => {
        setModalOpen(true)
    }

    const onSubmit = (formData: PRISMAFormData) => {

        // Get data from the deifned PRISMA categories
        let prismaData: { [key: string]: any } = {
            ...formData,
            totalArticles: totalArticles,
            ...Object.fromEntries(prismaCategories.map(cat => [cat.name, countArticlesWithTag(selectedArticles, cat.tag)]))
        }

        console.log(prismaData)

        // Get eligibility exclusion reasons
        const eligibilityExclusionTag = prismaCategories.filter(cat => cat.allowCustomReason)

        eligibilityExclusionTag.map(cat => {
            let otherReasons: PRISMAOtherReason[] = []
            selectedArticles.map(article => {

                // If it doesn't have the tag, continue
                if (!article.hasTag(cat.tag)) return;

                // Get and return comments
                const commentsTags = getComments(commentsTagPrefix, article)
                if (commentsTags.length == 0) return;

                // Extract the comments
                const comments = commentsTags[0].replace(commentsTagPrefix, "")

                // See if the reason already exists
                const index = otherReasons.findIndex(reason => reason.label == comments)
                // If reason exists
                if (index > -1) {
                    // Increment the other reasons count
                    otherReasons[index].records = otherReasons[index].records + 1
                } else {
                    const newReason: PRISMAOtherReason = { label: comments, records: 1 }
                    otherReasons.push(newReason)
                }
            })
            // @ts-ignore
            prismaData[cat.name] = otherReasons
        })

        // Calculate the included records in each subsection
        if (formData.useOtherReasons) {
            try {
                prismaData["screening:screen"] = totalArticles - prismaData["identification:duplicated"] - prismaData["identification:automation"] - prismaData["identification:other"]
                prismaData["screening:retrieval"] = prismaData["screening:screen"] - prismaData["screening:screen:excluded"]
                prismaData["screening:eligibility"] = prismaData["screening:retrieval"] - prismaData["screening:retrieval:excluded"]
            } catch (error) {
                console.error(error)
            }
        }

        generatePrismaFromTemplate(prismaData)
    }

    const onChangeCounts = (event: ChangeEvent, onChangeFunction: (event: ChangeEvent) => void) => {
        const field = event.currentTarget.getAttribute('name')
        if (field == "studies") {
            const reports = totalArticles - parseInt(studiesRef.current?.value || "0")
            setValue("reports", reports > 0 ? reports : 0)
        } else {
            const studies = totalArticles - parseInt(reportsRef.current?.value || "0")
            setValue("studies", studies > 0 ? studies : 0)
        }
        onChangeFunction(event)
    }

    // Keyboard Shortcuts
    useKeyboardShortcut(generatePRISMAShortcut, () => {
        open()
    })

    // Export functions
    useImperativeHandle(ref, () => ({
        open: open
    }))

    return (
        <Modal
            ref={modalRef}
            title="Generate PRISMA Diagram"
            openState={modalOpen} setOpenState={setModalOpen}
        >
            <div className="w-[32rem]">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <h2 className="font-bold text-lg">Identification</h2>
                    <div className="flex flex-row gap-4">
                        <div className="flex flex-1 flex-col gap-2">
                            <label htmlFor="databases">
                                Number of Databases Used:
                            </label>
                            <input
                                {...register("databases")}
                                id="databases"
                                className="input"
                                autoFocus={true}
                            />
                        </div>
                        <div className="flex flex-1 flex-col gap-2">
                            <label htmlFor="registers">
                                Number of Registers Used:
                            </label>
                            <input
                                {...register("registers")}
                                id="registers"
                                className="input"
                            />
                        </div>
                    </div>
                    <h2 className="font-bold text-lg">Inclusion</h2>
                    <div className="flex flex-row gap-2">
                        <span>Total of Studies and Reports:</span>
                        <strong>{totalArticles}</strong>

                        {/* <span>Included:</span>
                        <strong>{totalArticles}</strong> */}
                    </div>
                    {/* <div className="flex flex-row gap-4">
                        <div className="flex flex-1 flex-col gap-2">
                            <label htmlFor="included-studies">
                                Number of Studies Included:
                            </label>
                            <input
                                {...studiesProps}
                                id="included-studies"
                                ref={mergeRefs(studiesProps.ref, studiesRef)}
                                onChange={(event: ChangeEvent) => { onChangeCounts(event, studiesProps.onChange) }}
                                className="input"
                                type="text"
                            />
                        </div>
                        <div className="flex flex-1 flex-col gap-2">
                            <label htmlFor="included-reports">
                                Number of Reports Included:
                            </label>
                            <input
                                {...reportsProps}
                                id="included-reports"
                                ref={mergeRefs(reportsProps.ref, reportsRef)}
                                onChange={(event: ChangeEvent) => { onChangeCounts(event, reportsProps.onChange) }}
                                className="input"
                            />
                        </div>
                    </div> */}
                    <label className="flex flex-row gap-2 bg-slate-100 border border-slate-200 rounded p-4">
                        <div>
                            <input
                                {...register("useOtherReasons")}
                                type="checkbox"
                            />
                        </div>
                        <div>
                            Use comments as exclusion reasons
                            <div className="text-sm text-slate-500">
                                If checked, comments will be used as extra exclusion reasons in the eligibility section.
                            </div>
                        </div>
                    </label>
                    <div className="flex flex-row gap-4">
                        <input id="prisma-data" name="prisma-data" type="hidden" />
                        <button type="submit" className="btn btn-primary">Generate Diagram</button>
                        <button type="button" className="btn btn-clear" onClick={() => { modalRef.current?.close() }}>Cancel</button>
                    </div>
                    <div>
                        <br />
                        <strong>References</strong><br />
                        <small className="text-sm text-slate-500">
                            From: Page MJ, McKenzie JE, Bossuyt PM, Boutron I, Hoffmann TC,
                            Mulrow CD, et al. The PRISMA 2020 statement: an updated
                            guideline for reporting systematic reviews. BMJ 2021;372:n71.
                            doi: 10.1136/bmj.n71
                        </small>
                    </div>
                </form>
            </div >
        </Modal>
    )
})
export default PRISMAView