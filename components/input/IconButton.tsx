import { IconType } from "react-icons";

type buttonType = "ADD" | "DELETE" | "PIN" | "DELETE_COMPLETED" | "TOGGLE_ALL_COMPLETE";

type iconButtonProps = {
    Icon: IconType;
    disabled?: boolean;
    active?: boolean;
    hide?: boolean;
    buttonType: buttonType;
    onEventDispatch: any;
}

const IconButton = ({Icon, disabled = false, active = false, hide = true, buttonType, onEventDispatch}: iconButtonProps) => {
    return (
        <div className="w-9 md:w-12">
            <button disabled={disabled}>
                <Icon
                    className={`
                        scale-[120%] md:scale-[150%]
                        ${disabled && 'opacity-40 pointer-events-none'}
                        ${active && 'text-[#007AFF]'}
                        ${hide && 'icon-button'}
                    `}
                    onClick={() => buttonType === 'ADD' ? onEventDispatch({type: 'CLICK'}) : onEventDispatch()}
                />
            </button>
        </div>
    );
}

export default IconButton;