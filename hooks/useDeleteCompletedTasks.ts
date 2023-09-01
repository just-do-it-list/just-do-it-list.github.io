import { useEffect, useState, useContext } from "react";
import { gql, useMutation } from "@apollo/client";
import { TaskListContext } from "@/components/TodoContainer";

const newTaskMutation = gql`
    mutation DeleteCompletedTasks($deleteCompleted: Boolean) {
        deleteCompletedTasks(deleteCompleted: $deleteCompleted)
    }
`;

const useDeleteCompletedTasks = () => {
    const manageTaskList = useContext(TaskListContext) || (() => {});
    const [deleteCompleted, setDeleteCompleted] = useState(false)
    const [deleteCompletedTasks] = useMutation(newTaskMutation);

    useEffect(() => {
        if(deleteCompleted) {
            deleteCompletedTasks();
            setDeleteCompleted(false);
            manageTaskList({
                type: "DELETE_COMPLETED",
                payload: {}
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deleteCompleted])

    return {setDeleteCompleted};
}

export {useDeleteCompletedTasks};