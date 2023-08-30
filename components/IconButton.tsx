import { IconType } from "react-icons";

type buttonType = "ADD" | "DELETE" | "PIN" | "DELETE_COMPLETED" | "TOGGLE_ALL_COMPLETE";

type iconButtonProps = {
    Icon: IconType;
    disabled?: boolean;
    active?: boolean;
    buttonType: buttonType;
    onEventDispatch: any;
}

const buttonTypeDispatch = (type: buttonType, dispatch: any) => {
    switch(type) {
        case "ADD":
            return dispatch({type: 'CLICK'});
        default:
            return dispatch();
    }
}

const IconButton = ({Icon, disabled = false, active = false, buttonType, onEventDispatch}: iconButtonProps) => {
    return (
        <div className="w-9 md:w-12">
            <button disabled={disabled}>
                <Icon
                    className={`
                        scale-[120%] md:scale-[150%]
                        ${disabled && 'opacity-40 pointer-events-none'}
                        ${active && 'text-[#007AFF]'}
                    `}
                    onClick={() => buttonTypeDispatch(buttonType, onEventDispatch)}
                />
            </button>
        </div>
    );
}

export default IconButton;