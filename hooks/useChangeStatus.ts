import { taskType } from "@/components/Task";
import { useEffect, useRef, useState } from "react";
import {gql, useMutation} from "@apollo/client";

`
PENDING -> COMPLETED
PENDING -> PINNED
PINNED -> PENDING
PINNED -> COMPLETED
COMPLETED -> PENDING
`

type changeStatusProps = {
    task: taskType;
    manageTaskList: any;
}

const taskStatusMutation = gql`
    mutation ChangeTaskStatus($statusChange: ChangeStatusInput!) {
        changeStatus(statusChange: $statusChange)
    }
`

const useChangeStatus = ({task, manageTaskList}: changeStatusProps) => {
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
                newStatus: taskStatus,
                newTimeCreated: statusChange.newTimeCreated
            }
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskStatus]);

    return {dispatchChangedStatus};
}

export {useChangeStatus};