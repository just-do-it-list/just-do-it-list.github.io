import { useEffect, useReducer, useContext } from "react";
import { gql, useMutation } from "@apollo/client";
import { TaskListContext } from "@/components/TodoContainer";

export type taskState = {
    value: string;
    changeTask: boolean;
}

export type taskAction = {
    type: string;
    payload?: string;
}

let initialState: taskState = {
    value: '',
    changeTask: false
}

const reducer = (state: taskState, action: taskAction) => {
    switch(action.type) {
        case 'CHANGE':
            return {...state, value: action.payload || ''};
        case 'ENTER':
        case 'CLICK':
            return state.value.length ? {...state, changeTask: true} : state;
        case 'RESET':
            return initialState;
        default:
            return state;
    }
}

const newTaskMutation = gql`
    mutation AddTask($newTask: AddTaskInput!) {
        addTask(newTask: $newTask)
    }
`;

const useNewTask = () => {
    const manageTaskList = useContext(TaskListContext) || (() => {});
    const [state, dispatch] = useReducer(reducer, initialState);
    const [createTask] = useMutation(newTaskMutation)

    useEffect(() => {
        if(state.changeTask) {
            const newTask = {
                timeCreated: Date.now(),
                task: state.value,
                status: "PENDING" as 'PENDING'
            }
            dispatch({type: 'RESET'});
            createTask({
                variables: {
                    newTask
                }
            });
            manageTaskList({
                type: "ADD",
                payload: {task: newTask}
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state])

    return {state, dispatch};
}

export { useNewTask };