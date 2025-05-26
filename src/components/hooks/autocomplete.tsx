import { KeyboardEventHandler, useEffect, useState } from "react";
import { log } from "../../utils/devtools";

export function useAutocomplete(suggestionList: string[], handleSelection: (suggestion: string) => void) {
    // States
    const [selectedIndex, setSelectedIndex] = useState<number>(-1)
    const [suggestions, setSuggestions] = useState<string[]>([...suggestionList])
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [previousValue, setPreviousValue] = useState<string>("")

    useEffect(() => {
        setSuggestions([...suggestionList]);
    }, [suggestionList]);

    // -- KeyDown
    const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (event: React.KeyboardEvent<HTMLInputElement>) => {

        switch (event.key) {
            case "ArrowUp":
                if (!isOpen) return;
                setSelectedIndex(Math.max(selectedIndex - 1, -1))
                event.preventDefault()
                break;

            case "ArrowDown":
                setSelectedIndex(Math.min(selectedIndex + 1, suggestions.length - 1))
                if (!isOpen) setIsOpen(true)
                event.preventDefault()
                break;

            case "Enter":
                if (!isOpen) return;
                handleSelection(suggestionList[selectedIndex])
                setIsOpen(false)
                event.preventDefault()
                break;

            default:
                break;
        }
    }

    // -- KeyUp (fetch suggestions)
    const onKeyUp: KeyboardEventHandler<HTMLInputElement> = (event: React.KeyboardEvent<HTMLInputElement>) => {
        log("onKeyUp")
        const value = (event.currentTarget as HTMLInputElement).value.toLowerCase();

        if (value !== previousValue) {
            if (value === "") {
                setSuggestions([...suggestionList]);
            } else {
                const newSuggestions = suggestionList.filter((comment) =>
                    comment.toLowerCase().startsWith(value)
                );
                setSuggestions(newSuggestions);
            }
            setSelectedIndex(-1);
            setPreviousValue(value);
        }
    }

    return { onKeyUp, onKeyDown, suggestions, selectedIndex, isOpen, setIsOpen }
}