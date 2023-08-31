import Input from "./Input";
import Checkbox from "./Checkbox";
import IconButton from './IconButton';
import { FaThumbtack } from 'react-icons/fa6';
import { FaXmark } from 'react-icons/fa6';
import { useDeleteTask } from "@/hooks/useDeleteTask";
import { useEditTask } from "@/hooks/useEditTask";
import { useChangeStatus } from "@/hooks/useChangeStatus";
import { useEffect } from "react";

export type taskType = {
    timeCreated: number;
    task: string;
    status: "PINNED" | "PENDING" | "COMPLETED";
}

const Task = ({task, manageTaskList}: {task: taskType, manageTaskList: any}) => {
    const {setTimeCreated} = useDeleteTask(manageTaskList);
    const {taskValue, setTaskValue} = useEditTask({task, manageTaskList});
    const {dispatchChangedStatus} = useChangeStatus({task, manageTaskList});
    const isPinned = task.status === "PINNED";
    const isComplete = task.status === "COMPLETED";

    useEffect(() => {
        if(taskValue === '')
            setTimeCreated(task.timeCreated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskValue])

    return (
        <>
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
                hide={!isPinned}
                onEventDispatch={() => dispatchChangedStatus(isPinned ? "PENDING" : "PINNED")}
            />
        </>
    )
}

export default Task;