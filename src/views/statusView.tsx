import { useForm } from "react-hook-form"

// Define the form data structure
interface FormData {
    status: string;
    prisma: string;
    comments: string;
}
import Modal, { ModalComponent } from "../components/modal"
import { getPRISMALabel, setItemComments, setItemPRISMACategory, setItemStatus } from "../utils/columns.utils"
import { useKeyboardShortcut, usePref } from "../utils/hooks"
import { PropsWithChildren, ReactElement, Ref, useImperativeHandle, useRef, useState } from "react"
import { KeyCombination, usePrefStateFunction } from "../types/types"
import { getKeyCombination, getMatchingTag, getStatus, getTagsFromCurrentLibrary, mergeRefs } from "../utils/utils";
import { useAutocomplete } from "../components/hooks/autocomplete";
import defaultPreferences from "../utils/prefs.default";
import { ArticleStatus, PRISMACategory } from "../types/addon";
import { ArrowDown, ChevronDown, CircleChevronDownIcon } from "lucide-react";
import { log } from "../utils/devtools";

export interface StatusViewComponent {
    edit: () => void
}
export default function StatusView({ ref }: { ref: Ref<StatusViewComponent> }): ReactElement & StatusViewComponent {

    // console.log("STATUS")

    // Prefs
    const [statusList,] = usePref("statusList", defaultPreferences.statusList, { parseJSON: true, observe: true }) as [ArticleStatus[], usePrefStateFunction]
    const [commentsTagPrefix,] = usePref("commentsTagPrefix", defaultPreferences.commentsTagPrefix, { observe: true }) as [string, usePrefStateFunction]
    const [prismaCategories,] = usePref("prismaCategories", defaultPreferences.prismaCategories, { parseJSON: true, observe: true }) as [PRISMACategory[], usePrefStateFunction]
    const [editStatusShortcut,] = usePref("editStatusShortcut", defaultPreferences.editStatusShortcut, { parseJSON: true, observe: true }) as [KeyCombination, usePrefStateFunction]

    // States
    const [isCommentsModalOpen, setIsCommentsModalOpen] = useState<boolean>(false)
    const [commentList, setCommentList] = useState<string[]>([])
    const [articles, setArticles] = useState<Zotero.Item[]>([])

    // Refs
    const inputRef = useRef<HTMLInputElement>(null)

    // Form
    const { register, control, handleSubmit, setValue, setFocus } = useForm<FormData>()

    // Events
    // -- Submit
    const onSubmit = ({ status, prisma, comments }: FormData) => {

        setItemStatus(statusList, statusList.find(stat => stat.tag == status) as ArticleStatus)
        setItemPRISMACategory(prismaCategories, prismaCategories.find(cat => cat.tag == prisma) as PRISMACategory)
        setItemComments(commentsTagPrefix, comments)

        // Close the modal
        modalRef.current?.close()
        // setIsCommentsModalOpen(false)

        Zotero.ItemTreeManager.refreshColumns()
    }

    // Imperative Functions
    // -- Trigger Edit
    const triggerEdit = async () => {
        const selectedArticles = ZoteroPane.getSelectedItems()

        // Get all comments for autocompletion
        try {
            const allTags = await getTagsFromCurrentLibrary()
            const filteredTags = allTags.filter((tag: string) =>
                tag.startsWith(commentsTagPrefix)
            )
                .map(comment => comment.replace(commentsTagPrefix, ""))
            setCommentList(filteredTags)
        } catch (error) {
            console.error("Error getting tags from library:", error)
        }

        if (selectedArticles.length > 1) {
            setValue("comments", "")
        } else if (selectedArticles.length === 1) {
            const filteredCommentTags = selectedArticles[0]
                .getTags()
                .filter(tag => tag.tag.startsWith(commentsTagPrefix))

            let currentComment = ""
            if (filteredCommentTags.length > 0) {
                currentComment = filteredCommentTags[0].tag.replace(commentsTagPrefix, "")
            }

            setValue("comments", currentComment)
        }
        setArticles(selectedArticles)
        setIsCommentsModalOpen(true)
    }

    // Expose the triggerEdit function
    useImperativeHandle(ref, () => ({
        ...inputRef.current as HTMLInputElement,
        edit: triggerEdit
    }))

    // Keyboard Shortcuts
    useKeyboardShortcut(editStatusShortcut, () => {
        triggerEdit()
    })

    // Input props
    const commentProps = register("comments")

    const autocompleteRef = useRef<AutocompleteComponent>(null)
    // Autocomplete
    const handleSelection = (suggestion: string) => {
        setValue("comments", suggestion)
    }
    const onFocus = () => {
        setFocus("comments")
    }
    const onBlur = () => {
        setTimeout(() => { autocompleteRef.current?.close() }, 100)
    }

    const modalRef = useRef<ModalComponent>(null)

    // Load form
    // If single article
    if (articles.length == 1) {
        // setCurrentStatus(getStatus(articles[0], statusList))
        setValue("status", getMatchingTag(articles[0], statusList.map(stat => stat.tag)) || "")
        setValue("status", getStatus(articles[0], statusList)?.tag || "")
        setValue("prisma", getMatchingTag(articles[0], prismaCategories.map(cat => cat.tag)) || "")
    }
    setFocus("comments")

    return <>
        <Modal
            ref={modalRef}
            title={"Edit Review Info"}
            openState={isCommentsModalOpen}
            setOpenState={setIsCommentsModalOpen}
            // onOpen={() => {}}
            onClose={() => {
                if (Zotero.getMainWindow().document.querySelector("#item-tree-main-default"))
                    (Zotero.getMainWindow().document.querySelector("#item-tree-main-default") as HTMLElement).focus()
            }}
        >
            <form className="flex flex-col gap-8"
                onSubmit={handleSubmit(onSubmit)}
            >

                <div className="flex flex-col gap-4 relative">
                    <div className="flex flex-col gap-2">
                        {/* Status */}
                        <label htmlFor="status">Status</label>
                        <div className="relative">
                            <select
                                {...register("status")}
                                id="status"
                                className="select input w-96 relative z-10"
                                defaultValue={articles.length > 0 ? getMatchingTag(articles[0], statusList.map(stat => stat.tag)) : ""}
                            >
                                <option value=""></option>
                                {statusList.map((status: ArticleStatus, index) => (
                                    <option key={index} value={status.tag}>{status.label}</option>
                                ))}
                            </select>
                            <span className="absolute top-0 bottom-0 right-2 flex flex-row items-center">
                                <ChevronDown size={20} />
                            </span>
                        </div>
                    </div>

                    {/* PRISMA Category */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="prisma">PRISMA Category</label>
                        <div className="relative">
                            <select
                                {...register("prisma")}
                                id="prisma"
                                className="select input w-96 relative z-10"
                                defaultValue={articles.length > 0 ? getMatchingTag(articles[0], prismaCategories.map(cat => cat.tag)) : ""}
                            >
                                <option value=""></option>
                                {prismaCategories.map((cat: PRISMACategory, index) => (
                                    <option key={index} value={cat.tag}>{getPRISMALabel(cat.label)}</option>
                                ))}
                            </select>
                            <span className="absolute top-0 bottom-0 right-2 flex flex-row items-center">
                                <ChevronDown size={20} />
                            </span>
                        </div>
                    </div>

                    {/* Comments */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="comments">Comments / Reason for Exclusion</label>
                        <Autocomplete
                            {...commentProps}
                            ref={autocompleteRef}
                            onBlur={onBlur}
                            onFocus={onFocus}
                            inputRef={mergeRefs(inputRef, commentProps.ref)}
                            id="comments"
                            className="input w-96"
                            autocompleteList={commentList}
                            handleSelection={handleSelection}
                        />
                    </div>
                </div>

                <footer className="flex flex-row items-center justify-end gap-4 h-auto">
                    <button type="button" className="btn btn-clear" onClick={() => { modalRef.current?.close() }}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </footer>
            </form>
        </Modal>
    </>
}

interface AutocompleteProps extends React.InputHTMLAttributes<HTMLInputElement> {
    ref?: Ref<AutocompleteComponent>
    autocompleteList: string[]
    handleSelection: (suggestion: string) => void
    inputRef?: Ref<HTMLInputElement>
}
export interface AutocompleteComponent {
    close: () => void
}
function Autocomplete({ ref, autocompleteList, handleSelection, inputRef, ...props }: AutocompleteProps): ReactElement & AutocompleteComponent {

    log("List", autocompleteList)
    // Hooks
    const { suggestions, selectedIndex, isOpen, setIsOpen, onKeyDown, onKeyUp } = useAutocomplete(autocompleteList, handleSelection)

    // Events
    const open = () => { setIsOpen(true) }
    const close = () => { setIsOpen(false) }

    // Export
    useImperativeHandle(ref, () => ({
        close: close
    }))
    return <>
        <input
            ref={inputRef}
            {...props}
            onFocus={open}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
        />
        <div className={`absolute top-full w-80 max-h-64 flex flex-col overflow-hidden rounded border border-slate-200 bg-slate-50 shadow-lg ${isOpen && suggestions.length > 0 ? "" : "hidden"}`}>
            {suggestions.map((suggestion, index) => (
                <div key={index} className={`p-3 text-sm ${selectedIndex == index ? "bg-blue-200 hover:bg-blue-400" : "hover:bg-slate-200"}`} onClick={() => { console.log("SELECT", suggestion); handleSelection(suggestion) }}>
                    {suggestion}
                </div>
            ))}
        </div>
    </>
}