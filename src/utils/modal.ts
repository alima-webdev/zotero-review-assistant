import Handlebars = require("handlebars")

const modalTemplate = Handlebars.compile(`
        <div class="inner-modal" tabindex="-1">
            <div role="dialog" aria-modal="true" aria-labelledby="{{id}}-title">
                <header>
                    <h2 id="{{id}}-title" class="modal-title">
                        {{title}}
                    </h2>
                    <button aria-label="Close modal"></button>
                </header>
                <div id="{{id}}-content" class="modal-content">
                </div>
            </div>
        </div>
`)

export function createModal(id: string, title: string, content: HTMLElement) {
    // Process the template and generate the modal HTML element
    const modalElement = document.createElement('div')
    modalElement.setAttribute("aria-hidden", "true")
    modalElement.id = id
    modalElement.className = "modal"
    modalElement.innerHTML = modalTemplate({ id, title })

    modalElement.querySelector('.modal-content')?.appendChild(content)

    // Create a modal class
    const modal = new ReviewModal(id, modalElement)
    return modal
}

export function initModal() {
    // MicroModal.init()
}

class ReviewModal {
    id: string;
    root?: HTMLElement | Document;
    element: HTMLElement;
    constructor(id: string, element: HTMLElement) {
        this.id = id
        this.element = element
    }
    appendTo(root: HTMLElement | Document) {
        root.appendChild(this.element)
        this.bindEvents()
        this.root = root
        return this
    }
    open() {
        this.element.classList.add('open')

        this.root?.parentNode?.addEventListener('keydown', this.closeKeyStroke.bind(this));
    }
    closeKeyStroke(ev: Event) {
        if (ev.key === "Escape") {
            this.close()
            ev.preventDefault();
        }
    }
    close() {
        this.element.classList.remove('open')
        this.root?.parentNode?.removeEventListener('keydown', this.closeKeyStroke);
        // MicroModal.close(this.id)
    }
    bindEvents() {
        ztoolkit.log(this.element)
        // Close buttons
        if (this.element.querySelector("[action=close]")) {
            this.element.querySelector("[action=close]").onclick = (ev) => {
                this.close()
            }
        }

        // Close background
        this.element.onclick = (ev) => {
            if (ev.target == this.element) this.close()
        }
    }
}