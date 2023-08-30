import Input from "./Input";
import Checkbox from "./Checkbox";
import IconButton from './IconButton';
import { FaThumbtack } from 'react-icons/fa6';
import { FaXmark } from 'react-icons/fa6';
import { useDeleteTask } from "@/hooks/useDeleteTask";
import { useEditTask } from "@/hooks/useEditTask";
import { useChangeStatus } from "@/hooks/useChangeStatus";

export type taskType = {
    timeCreated: number;
    task: string;
    status: "PINNED" | "PENDING" | "COMPLETED";
}

const Task = ({task, manageTaskList}: {task: taskType, manageTaskList: any}) => {
    const {setTimeCreated} = useDeleteTask(manageTaskList);
    const {taskValue, setTaskValue} = useEditTask({task, manageTaskList});
    const isPinned = task.status === "PINNED";
    const isComplete = task.status === "COMPLETED";
    const {dispatchChangedStatus} = useChangeStatus({task, manageTaskList})

    return (
        <div>
            <Checkbox
                rounded
                checked={isComplete}
                onEventDispatch={() => dispatchChangedStatus(isComplete ? "PENDING" : "COMPLETED")}
            />
            <Input
                value={taskValue}
                onEventDispatch={setTaskValue}
                completed={isComplete}
                pinned={isPinned}
            />
            <IconButton
                Icon={FaXmark}
                buttonType="DELETE"
                onEventDispatch={() => setTimeCreated(task.timeCreated)}
            />
            <IconButton
                Icon={FaThumbtack}
                buttonType="PIN"
                active={isPinned}
                disabled={isComplete}
                onEventDispatch={() => dispatchChangedStatus(isPinned ? "PENDING" : "PINNED")}
            />
        </div>
    )
}

export default Task;