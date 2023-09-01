import { useEffect, useState, useContext } from "react";
import { gql, useMutation } from "@apollo/client";
import { TaskListContext } from "@/components/TodoContainer";

const newTaskMutation = gql`
    mutation ToggleAllComplete($toggleAll: Boolean) {
        toggleAllComplete(toggleAll: $toggleAll)
    }
`;

const useToggleAllComplete = () => {
    const manageTaskList = useContext(TaskListContext) || (() => {});
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