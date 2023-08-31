import { useEffect } from "react";
import {gql, useMutation} from "@apollo/client";
import { taskType } from "@/components/Task";
import { useState, useRef } from "react";

const editTaskMutation = gql`
    mutation EditTask($editedTask: EditTaskInput!) {
        editTask(editedTask: $editedTask)
    }
`;

const useEditTask = ({manageTaskList, task}: {manageTaskList: any, task: taskType}) => {
    const [taskValue, setTask] = useState(task.task);
    const [editTask] = useMutation(editTaskMutation);
    const firstRender = useRef(true);

    const setTaskValue = (e: any) => {
        if(typeof e.payload === 'string')
            setTask(e.payload)
    }

    useEffect(() => {
        if(firstRender.current) {
            firstRender.current = false;
            return ;
        }
        const editedTask = {
            timeCreated: task.timeCreated,
            task: taskValue
        }
        editTask({
            variables: {
                editedTask
            }
        });
        manageTaskList({
            type: "EDIT",
            payload: {task: editedTask}
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskValue])

    return {taskValue, setTaskValue};
}

export { useEditTask };