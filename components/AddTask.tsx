import Input from "./Input";
import IconButton from "./IconButton";
import {FaPlus} from "react-icons/fa6";
import { useNewTask } from "@/hooks/useNewTask";

type addTaskProps = {
    manageTaskList: any;
}

const AddTask = ({manageTaskList}: addTaskProps) => {
    const {state, dispatch} = useNewTask(manageTaskList);

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