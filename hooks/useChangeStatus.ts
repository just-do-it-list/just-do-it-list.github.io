import { useContext, useEffect, useRef, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { taskType } from "@/components/Task";
import { TaskListContext } from "@/components/TodoContainer";

const taskStatusMutation = gql`
    mutation ChangeTaskStatus($statusChange: ChangeStatusInput!) {
        changeStatus(statusChange: $statusChange)
    }
`

const useChangeStatus = (task: taskType) => {
    const manageTaskList = useContext(TaskListContext) || (() => {});
    const [taskStatus, dispatchChangedStatus] = useState('');
    const firstRender = useRef(false)
    const [changeTaskStatus] = useMutation(taskStatusMutation);

    useEffect(() => {
        if(!firstRender.current) {
            firstRender.current = true;
            return ;
        }
        const statusChange = {
            timeCreated: task.timeCreated,
            newTimeCreated: Date.now(),
            newStatus: taskStatus
        }
        changeTaskStatus({
            variables: {
                statusChange
            }
        })
        manageTaskList({
            type: 'CHANGE_STATUS',
            payload: {
                task,
                newStatus: taskStatus as "PINNED" | "PENDING" | "COMPLETED",
                newTimeCreated: statusChange.newTimeCreated
            }
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskStatus]);

    return {dispatchChangedStatus};
}

export {useChangeStatus};