import { log } from "./devtools";

type CustomEventFunction = (ev: any) => any;

type CustomEventListener = {
    element: HTMLElement | Document;
    eventType: string;
    fn: CustomEventFunction;
    fnId: string;
    options: any;
};

const events: CustomEventListener[] = [];

export async function registerEventListener(
    element: HTMLElement | Document | undefined,
    eventType: string,
    fn: CustomEventFunction,
    options?: any,
) {
    // log('Fn: registerEventListener')

    // Check if the element exists
    if (!element) return false;

    // Generate the function ID
    const fnId = await getUniqueFunctionId(fn);

    // Append the event and add the listener
    events.push({ element, eventType, fn, fnId, options });
    // log(events[events.length - 1].fn.toString())
    element.addEventListener(eventType, fn, options);

    return true;
}

export async function deregisterEventListener(
    element: HTMLElement | Document | undefined,
    eventType: string,
    fn: CustomEventFunction,
    options?: any,
) {
    // log("Fn: deregisterEventListener")

    // Check if the element exists
    if (!element) return false;

    // Generate the function ID
    const fnId = await getUniqueFunctionId(fn);

    const eventId = events.findIndex((event) => {
        if (
            event.element == element &&
            event.eventType == eventType &&
            event.fnId == fnId &&
            event.options == options
        )
            return true;
    });

    // Check if an event was found
    if (!eventId) return false;

    // Remove the event from the list and the listener
    events.splice(eventId, 1);
    element.removeEventListener(eventType, fn, options);

    return true;
}

export function deregisterAllEventListeners() {
    for (const event of events) {
        deregisterEventListener(
            event.element,
            event.eventType,
            event.fn,
            event.options,
        );
    }
}

function getUniqueFunctionId(func: any) {
    const funcString = func.toString();
    // Using the built-in JavaScript Web Crypto API to generate a hash
    return crypto.subtle
        .digest("SHA-256", new TextEncoder().encode(funcString))
        .then((hashBuffer) => {
            // Convert the ArrayBuffer to a hexadecimal string
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray
                .map((byte) => byte.toString(16).padStart(2, "0"))
                .join("");
            return hashHex;
        });
}
