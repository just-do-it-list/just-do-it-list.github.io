import { useEffect, useState } from "react";
import {gql, useMutation} from "@apollo/client";

const newTaskMutation = gql`
    mutation DeleteCompletedTasks($deleteCompleted: Boolean) {
        deleteCompletedTasks(deleteCompleted: $deleteCompleted)
    }
`;

const useDeleteCompletedTasks = (manageTaskList: any) => {
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