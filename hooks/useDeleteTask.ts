import { useEffect, useState } from "react";
import {gql, useMutation} from "@apollo/client";

const newTaskMutation = gql`
    mutation DeleteTask($timeCreated: Float!) {
        deleteTask(timeCreated: $timeCreated)
    }
`;

const useDeleteTask = (manageTaskList: any) => {
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