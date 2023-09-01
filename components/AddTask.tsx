import Input from "./input/Input";
import IconButton from "./input/IconButton";
import { FaPlus } from "react-icons/fa6";
import { useNewTask } from "@/hooks/useNewTask";

const AddTask = () => {
    const {state, dispatch} = useNewTask();

    return (
        <div>
            <IconButton
                Icon={FaPlus}
                disabled={state.value.length === 0}
                buttonType="ADD"
                hide={false}
                onEventDispatch={dispatch}
            />
            <Input
                placeholder="Add your next task..."
                value={state.value}
                onEventDispatch={dispatch}
            />
        </div>
    )
}

export default AddTask;