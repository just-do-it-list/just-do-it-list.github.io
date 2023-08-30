import { taskAction } from "@/hooks/useNewTask";

type inputProps = {
    value?: string;
    placeholder?: string;
    completed?: boolean;
    pinned?: boolean;
    onEventDispatch: (action: any) => void;
}

const Input = ({value, placeholder, completed, pinned, onEventDispatch}: inputProps) => {
    return (
        <div className="flex-auto text-md md:text-xl pl-1">
            <input
                className={`
                    w-full
                    ${completed && 'opacity-40 pointer-events-none line-through'}
                    ${pinned && 'font-extrabold'}
                `}
                value={value}
                placeholder={placeholder}
                onChange={e => onEventDispatch({type: 'CHANGE', payload: e.target.value})}
                onKeyDown={e => e.key === "Enter" && onEventDispatch({type: 'ENTER'})}
            />
        </div>
    );
}

export default Input;