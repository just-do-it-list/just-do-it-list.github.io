import { useEffect, useState } from "react";
import {gql, useMutation} from "@apollo/client";

const newTaskMutation = gql`
    mutation ToggleAllComplete($toggleAll: Boolean) {
        toggleAllComplete(toggleAll: $toggleAll)
    }
`;

const useToggleAllComplete = (manageTaskList: any) => {
    const [toggleAll, setToggleAll] = useState(false)
    const [toggleAllTasks] = useMutation(newTaskMutation);

    useEffect(() => {
        if(toggleAll) {
            toggleAllTasks();
            setToggleAll(false);
            manageTaskList({
                type: "TOGGLE_ALL_COMPLETE",
                payload: {}
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [toggleAll])

    return {setToggleAll};
}

export {useToggleAllComplete};