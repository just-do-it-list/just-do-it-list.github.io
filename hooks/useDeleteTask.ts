import { useEffect, useState, useContext } from "react";
import { gql, useMutation } from "@apollo/client";
import { TaskListContext } from "@/components/TodoContainer";

const newTaskMutation = gql`
    mutation DeleteTask($timeCreated: Float!) {
        deleteTask(timeCreated: $timeCreated)
    }
`;

const useDeleteTask = () => {
    const manageTaskList = useContext(TaskListContext) || (() => {});
    const [timeCreated, setTimeCreated] = useState(-1);
    const [deleteTask] = useMutation(newTaskMutation);

    useEffect(() => {

        if(timeCreated > 0) {
            setTimeCreated(-1)
            deleteTask({
                variables: {
                    timeCreated
                }
            });
            manageTaskList({
                type: "DELETE",
                payload: {timeCreated}
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeCreated])

    return {setTimeCreated};
}

export {useDeleteTask};