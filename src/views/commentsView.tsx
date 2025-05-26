import { useForm } from "react-hook-form"

// Define the form data structure
interface FormData {
    comments: string;
}
import Modal from "../components/modal"
import { setItemComments } from "../utils/columns.utils"
import { usePref } from "../utils/hooks"
import { ReactElement, Ref, useImperativeHandle, useRef, useState } from "react"
import { usePrefStateFunction } from "../types/types"
import { getTagsFromCurrentLibrary, mergeRefs } from "../utils/utils";
import { AutocompleteComponent, useAutocomplete } from "../components/hooks/autocomplete";
import defaultPreferences from "../utils/prefs.default";

export interface CommentsViewComponent {
    editComments: () => void
}
export default function CommentsView({ ref }: { ref: Ref<CommentsViewComponent> }): ReactElement & CommentsViewComponent {

    // Prefs
    const [commentsTagPrefix, _] = usePref("commentsTagPrefix", defaultPreferences.commentsTagPrefix, { observe: true }) as [string, usePrefStateFunction]

    // States
    const [isCommentsModalOpen, setIsCommentsModalOpen] = useState<boolean>(false)
    const [commentList, setCommentList] = useState<string[]>([])

    // Refs
    const inputRef = useRef<HTMLInputElement>(null)
    const autocompleteRef = useRef<AutocompleteComponent>(null)

    // Form
    const { register, control, handleSubmit, setValue, setFocus } = useForm<FormData>()

    // Submit
    const onSubmit = ({ comments }: { comments: string }) => {

        setItemComments(commentsTagPrefix, comments)

        // Close the modal
        setIsCommentsModalOpen(false)
    }

    // Expose the inputValueRef to the parent ref
    useImperativeHandle(ref, () => ({
        ...inputRef.current as HTMLInputElement,
        editComments: async () => {

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

            setIsCommentsModalOpen(true)
        }
    }))

    // Input props
    const inputProps = register("comments")

    // Autocomplete
    const handleSelection = (suggestion: string) => {
        setValue("comments", suggestion)
    }
    const autocomplete = useAutocomplete(commentList, handleSelection)
    const onFocus = () => {
        setFocus("comments")
    }
    const onBlur = () => {
        setTimeout(() => { autocomplete.setIsOpen(false) }, 100)
    }

    return <>
        <Modal title={"Status Comments"} openState={isCommentsModalOpen} setOpenState={setIsCommentsModalOpen} onOpen={() => {
            setFocus("comments")
        }}>
            <form className="flex flex-col gap-8"
                onSubmit={handleSubmit(onSubmit)}
            >

                <div className="flex flex-col gap-2 relative">
                    <input
                        {...inputProps}
                        onBlur={onBlur}
                        onFocus={onFocus}
                        onKeyDown={autocomplete.onKeyDown}
                        onKeyUp={autocomplete.onKeyUp}
                        ref={mergeRefs(inputRef, inputProps.ref)}
                        id="comments"
                        className="input w-96"
                    />
                    <div className={`absolute top-full w-full flex flex-col overflow-hidden rounded border border-slate-200 bg-slate-50 ${autocomplete.isOpen ? "" : "hidden"}`}>
                        {autocomplete.suggestions.map((suggestion, index) => (
                            <div key={index} className={`p-3 text-sm ${autocomplete.selectedIndex == index ? "bg-blue-200 hover:bg-blue-400" : "hover:bg-slate-200"}`} onClick={() => { console.log("SELECT", suggestion); handleSelection(suggestion) }}>
                                {suggestion}
                            </div>
                        ))}
                    </div>
                </div>

                <footer className="flex flex-row items-center justify-end gap-4 h-auto">
                    <button type="button" className="btn btn-clear" onClick={() => { setIsCommentsModalOpen(false) }}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </footer>
            </form>
        </Modal>
    </>
}