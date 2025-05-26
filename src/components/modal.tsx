// External Dependencies
import { ReactNode, Ref, useEffect, useImperativeHandle, useRef } from "react"

// Internal Dependencies
import { useKeyboardShortcut } from "../utils/hooks"
import { getKeyCombination } from "../utils/utils"

// Devtools
import { log } from "../utils/devtools"
import { X } from "lucide-react"

type ModalProps = {
    ref?: Ref,
    children: ReactNode,

    openState: boolean,
    setOpenState: (openState: boolean) => void,

    title?: string,
    onOpen?: () => void,
    onClose?: () => void
}

export interface ModalComponent {
    close: () => void
}
function Modal({ ref, children, openState, setOpenState, title, onOpen, onClose }: ModalProps): ReactElement & ModalComponent {

    // Open
    useEffect(() => {
        if (openState == true && onOpen) {
            onOpen()
        }
        // previousOpenState.current = openState
    }, [openState]);

    // Close
    const close = () => {
        setOpenState(false)
        if (onClose) onClose()
    }

    const onClickHandler = (event: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => {
        if (event.target == event.currentTarget) {
            close()
            // setOpenState(false)
            // if (onClose) onClose()
        }
    }

    // Keyboard Shortcut
    useKeyboardShortcut(getKeyCombination("Escape"), () => { close() })
    
    useImperativeHandle(ref, () => ({
        close: close
    }))

    return (
        <div
            className={`
                modal
                absolute inset-0 z-50
                flex justify-center items-center
                bg-black/75
                ${openState ? "" : "invisible"}
            `}
            onClick={onClickHandler}
        >
            <div className={`
                    inner-modal
                    px-8 py-6 rounded
                    text-slate-950
                    bg-slate-50
                `} tabIndex={-1}>
                <div role="dialog" aria-modal="true">
                    {title ? (
                        <header className="flex justify-between items-center">
                            <h2 className="modal-title text-2xl font-bold mb-4">
                                {title}
                            </h2>
                        </header>
                    ) : ""}
                    <div className="modal-content">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal















// const modalTemplate = Handlebars.compile(`
//         <div class="inner-modal" tabindex="-1">
//             <div role="dialog" aria-modal="true" aria-labelledby="{{id}}-title">
//                 <header>
//                     <h2 id="{{id}}-title" class="modal-title">
//                         {{title}}
//                     </h2>
//                     <button aria-label="Close modal"></button>
//                 </header>
//                 <div id="{{id}}-content" class="modal-content">
//                 </div>
//             </div>
//         </div>
// `);

// // Main modal function
// export function createModal(
//     id: string,
//     title: string,
//     content: HTMLElement,
//     options: ModalOptions = {},
// ) {
//     // Process the template and generate the modal HTML element
//     const modalElement = document.createElement("div");
//     modalElement.setAttribute("aria-hidden", "true");
//     modalElement.id = id;
//     modalElement.className = "modal";
//     modalElement.innerHTML = modalTemplate({ id, title });

//     modalElement.querySelector(".modal-content")?.appendChild(content);

//     // Create a modal class
//     const modal = new Modal(id, modalElement, options);
//     return modal;
// }

// export function initModal() {}

// type ModalOptions = {
//     onClose?: () => void;
// };

// // Modal class
// class Modal {
//     id: string;
//     root?: HTMLElement | Document;
//     element: HTMLElement;
//     options: ModalOptions;
//     constructor(id: string, element: HTMLElement, options?: ModalOptions) {
//         this.id = id;
//         this.element = element;
//         this.options = options as ModalOptions;
//     }
//     appendTo(root: HTMLElement | Document) {
//         root.appendChild(this.element);
//         this.bindEvents();
//         this.root = root;
//         return this;
//     }
//     open() {
//         this.element.classList.add("open");

//         // registerEventListener(this.root?.parentNode, 'keydown', this.closeKeyStroke.bind(this))
//         this.root?.parentNode?.addEventListener(
//             "keydown",
//             this.closeKeyStroke.bind(this),
//         );

//         // Autofocus
//         const autofocusElement =
//             this.element.querySelector('[autofocus="true"]');
//         if (autofocusElement) {
//             (autofocusElement as HTMLElement).focus();
//         }
//     }
//     closeKeyStroke(ev: any) {
//         if (ev.key === "Escape") {
//             this.close();
//             ev.preventDefault();
//         }
//     }
//     close() {
//         this.element.classList.remove("open");
//         // deregisterEventListener(this.root?.parentNode, 'keydown', this.closeKeyStroke.bind(this))
//         this.root?.parentNode?.removeEventListener(
//             "keydown",
//             this.closeKeyStroke,
//         );

//         // Focus on the main element when closing
//         // if (this.options?.onCloseFocus) {
//         //     this.options.onCloseFocus.focus();
//         // }
//         if (this.options?.onClose) {
//             this.options?.onClose();
//         }
//     }
//     bindEvents() {
//         // Close buttons
//         const closeActionElements =
//             this.element.querySelectorAll("[action=close]");
//         for (const el of closeActionElements) {
//             // registerEventListener(el, 'click', (ev: Event) => {
//             //     this.close();
//             // })
//             el.addEventListener("click", (ev: Event) => {
//                 this.close();
//             });
//         }

//         // Close background
//         // registerEventListener(this.element, 'click', (ev) => {
//         //     if (ev.target == this.element) this.close();
//         // })
//         this.element.onclick = (ev) => {
//             if (ev.target == this.element) this.close();
//         };
//     }
// }
