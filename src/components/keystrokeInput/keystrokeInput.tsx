import { ChangeEvent, useState, forwardRef } from 'react';
import { isMainKeyValid, Keystroke } from './keystrokeInputUtils';

const KeystrokeInput = forwardRef<HTMLInputElement, any>(({setValue = () => {}, ...props}, ref) => {

    // States
    const [keystrokeValue, setKeystrokeValue] = useState<Keystroke>(Keystroke.fromString(""));

    // Events
    const onKeyDownHandler = (event: React.KeyboardEvent) => {
        console.log("onKeyDown")

        // Ignore repeat
        if (event.repeat) return;

        // Get the keystroke and construct the class
        const code = isMainKeyValid(event.code)
            ? event.code.replace(/Key|Digit/g, '')
            : '';
        const isAlt = event.altKey;
        const isCtrl = event.ctrlKey;
        const isMeta = event.metaKey;
        const isShift = event.shiftKey;

        const keystroke = new Keystroke();
        keystroke.modifiers = {
            alt: isAlt,
            ctrl: isCtrl,
            meta: isMeta,
            shift: isShift,
        };
        keystroke.code = code;

        // Set the element value
        setKeystrokeValue(keystroke)

        // Prevent the default behavior
        // event.preventDefault()
        // return false
    };

    const inputValue = (keystrokeValue ? keystrokeValue.toString() : "")

    const onChangeHandler = (event: ChangeEvent) => {

        // React Hook Form's setValue
        if (setValue && props.name) setValue(props.name, keystrokeValue)

        // Trigger onChange
        if (props.onChange) props.onChange(event)

    }
    return (
        <span>
            <div>{keystrokeValue.toJSON()}</div>
            <input
                {...props}
                onChange={onChangeHandler}
                onKeyDown={onKeyDownHandler}
                value={inputValue}
            />
        </span>
    );
});

export default KeystrokeInput;
