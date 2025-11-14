// External Dependencies
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

// Internal Dependencies
import defaultPreferences from "../utils/prefs.default"
import Table from "../components/table";
import Modal from "../components/modal";
// import KeystrokeInput from "../components/keystrokeInput/keystrokeInput";
import KeystrokeInput from "keystroke-input";
import { usePref } from "../utils/hooks"
import { getKeyCombination, getStringFromKeyCombination, JSONFromString } from "../utils/utils";

// Types
import { usePrefStateFunction } from "../types/types";
import { ArticleStatus } from "../types/addon";

// Devtools
import { log } from "../utils/devtools";

function PreferencePane() {

    Zotero.log("Rendering PreferencePane")

    // Prefs
    const [statusList, setStatusList] = usePref("statusList", defaultPreferences.statusList, { parseJSON: true }) as [ArticleStatus[], usePrefStateFunction]

    // Table consts
    let data = [...statusList as ArticleStatus[]]
    const columns = [
        { name: 'label', label: 'Label' },
        { name: 'tag', label: 'Tag' },
        { name: 'color', label: 'Color' },
        { name: 'invertTextColor', label: 'Invert Text Color', labelFn: (status: ArticleStatus) => status.invertTextColor ? "✓" : "" },
        // { name: 'keystroke', label: 'Keystroke', labelFn: (status: ArticleStatus) => (status.keystroke != null ? getStringFromKeyCombination(JSON.parse(String(status.keystroke))) : "") },
        { name: 'keystroke', label: 'Keystroke', labelFn: (status: ArticleStatus) => (status.keystroke != null ? getStringFromKeyCombination(status.keystroke) : "") },
    ];

    // States
    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [isEditing, setIsEditing] = useState<boolean>(false)

    // Refs
    const formColorRef = useRef<HTMLInputElement>(null)

    // Form
    interface FormData {
        index: number;
        label: string;
        tag: string;
        color: string;
        invertTextColor: boolean;
        keystroke: string;
    }

    const { register, control, handleSubmit, setValue } = useForm<FormData>()
    const onSubmit = ({ index, ...formData }: { index: number, label: string, tag: string, color: string, invertTextColor: boolean, keystroke: string }) => {

        const processedFormData = { ...formData, keystroke: JSONFromString(String(formData.keystroke)) }

        const newStatusList = [...statusList]
        const isNew = index === -1
        if (isNew) {
            newStatusList.push(processedFormData)
        } else {
            newStatusList[index] = processedFormData
        }

        // Save the new pref
        setStatusList(newStatusList)

        // Close the modal
        setModalOpen(false)
        setIsEditing(false)
    }

    // Events
    const doubleClickHandler = (item: ArticleStatus, index: number) => {

        if (item) {
            setValue("index", index)
            setValue("label", item.label)
            setValue("invertTextColor", item.invertTextColor)
            // setValue("keystroke", item.keystroke)
            const payload = {
                altKey: item.keystroke?.altKey,
                ctrlKey: item.keystroke?.ctrlKey,
                metaKey: item.keystroke?.metaKey,
                shiftKey: item.keystroke?.shiftKey,
                code: item.keystroke?.code,
            }
            setValue("keystroke", JSON.stringify(payload))
            // console.log("KEYSTROKE: ", item.keystroke)
            // setValue("keystroke", { "altKey": true, "ctrlKey": false, "metaKey": false, "shiftKey": false, "code": "KeyU" })
            // setValue("keystroke", { "altKey": true, "ctrlKey": false, "metaKey": false, "shiftKey": false, "code": "KeyU" })
            setValue("color", item.color)
            setValue("tag", item.tag)
        }
        // Update states
        setModalOpen(true)
        setIsEditing(true)
    }
    // setValue("keystroke", { "altKey": true, "ctrlKey": false, "metaKey": false, "shiftKey": false, "code": "KeyU" })
    return (
        <>
            <div className="preferences">
                <div className="flex flex-col gap-4">
                    <Table columns={columns} data={data} onDoubleClick={doubleClickHandler} />

                    <div className="flex flex-row gap-4">
                        <button className="btn btn-primary" onClick={() => {
                            setValue("index", -1)
                            setValue("label", "")
                            setValue("invertTextColor", false)
                            setValue("keystroke", "")
                            setValue("color", "#d9d9d9")
                            setValue("tag", "")
                            setModalOpen(true)
                        }}>Create New</button>
                        <button className="btn btn-clear" onClick={() => {
                            setStatusList(defaultPreferences.statusList)
                        }}>Reset Settings</button>

                    </div>

                    <div className="flex flex-col gap-4">
                        <div><strong>Additional Shortcuts:</strong></div>
                        <div>{getStringFromKeyCombination(getKeyCombination("Alt S"))} - Open Review Info Panel</div>
                        <div>{getStringFromKeyCombination(getKeyCombination("Alt D"))} - Open Generate PRISMA Diagram Panel</div>
                    </div>

                    <div className="">
                        Restart Zotero to apply changes
                    </div>
                </div>

                <Modal openState={modalOpen} setOpenState={setModalOpen} title={isEditing ? "Editing Status" : ""} onOpen={() => { log("open") }} onClose={() => {
                    setIsEditing(false)
                    log("close")
                }}>
                    <div className="flex flex-col gap-4">

                        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>

                            {/* Hidden Inputs */}
                            <input {...register("index")} type="hidden" />

                            <div className="flex flex-row gap-4">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="form-label">Label</label>
                                    <input {...register("label")} id="form-label" className="input" />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="form-tag">Tag</label>
                                    <input {...register("tag")} id="form-tag" className="input" />
                                </div>
                            </div>

                            <div className="flex flex-row items-center gap-4">
                                <div className="flex flex-row items-center gap-2">
                                    <label htmlFor="form-color">Color</label>
                                    <Controller
                                        name="color"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <input type="hidden" {...register("color")} />
                                                <input ref={formColorRef} id="form-color" type="color" className="input" onChange={field.onChange} value={field.value} />
                                                {/* <ChromePicker
                                                    color="#333"
                                                    onChangeComplete={(color) => formColorRef.current.value = color.hex}
                                                /> */}
                                            </>
                                        )}
                                    />
                                </div>

                                <div className="flex flex-row items-center gap-2">
                                    <label htmlFor="form-invertTextColor">Invert Text Color</label>
                                    <input type="checkbox" {...register("invertTextColor")} id="form-invertTextColor" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="form-keystroke">Keyboard Shortcut</label>

                                <Controller
                                    name="keystroke"
                                    control={control}
                                    render={({ field }) => {
                                        console.log(field)
                                        return (
                                            <KeystrokeInput
                                                className="input"
                                                {...field}
                                            />
                                        )
                                    }}
                                />
                            </div>

                            <footer className="flex flex-row items-center justify-end gap-4 h-auto">
                                <button type="button" className="btn btn-clear" onClick={() => { setModalOpen(false); setIsEditing(false) }}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </footer>
                        </form>
                    </div>
                </Modal>
            </div>
        </>
    )
}

export default PreferencePane