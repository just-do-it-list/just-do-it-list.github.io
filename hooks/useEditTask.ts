import { useEffect, useState, useRef, useContext } from "react";
import { gql, useMutation } from "@apollo/client";
import { taskType } from "@/components/Task";
import { TaskListContext } from "@/components/TodoContainer";

const editTaskMutation = gql`
    mutation EditTask($editedTask: EditTaskInput!) {
        editTask(editedTask: $editedTask)
    }
`;

const useEditTask = (task: taskType) => {
    const manageTaskList = useContext(TaskListContext) || (() => {});
    const [taskValue, setTask] = useState(task.task);
    const [editTask] = useMutation(editTaskMutation);
    const firstRender = useRef(true);

    const setTaskValue = ({payload}: {payload: string}) => {
        if(payload !== undefined && payload !== null)
            setTask(payload)
    }

    useEffect(() => {
        if(firstRender.current) {
            firstRender.current = false;
            return ;
        }
        const editedTask = {
            timeCreated: task.timeCreated,
            task: taskValue,
        }
        editTask({
            variables: {
                editedTask
            }
        });
        manageTaskList({
            type: "EDIT",
            payload: {
                task: {
                    ...editedTask,
                    status: task.status
                }
            }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskValue])

    return {taskValue, setTaskValue};
}

export { useEditTask };