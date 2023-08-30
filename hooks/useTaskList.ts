import { taskType } from "@/components/Task";
import { useReducer } from "react";

type manageListAction = {
    type: string;
    payload: {
        data?: taskType[];
        task?: taskType;
        timeCreated?: number;
        newTimeCreated?: number;
        newStatus?: "PINNED" | "PENDING" | "COMPLETED";
    }
}

const sortTaskList = (taskList: taskType[]) => {
    const pinned = taskList.filter(task => task.status === "PINNED");
    const pending = taskList.filter(task => task.status === "PENDING");
    const completed = taskList.filter(task => task.status === "COMPLETED");

    pinned.sort((a, b) => b.timeCreated - a.timeCreated);
    pending.sort((a, b) => a.timeCreated - b.timeCreated);
    completed.sort((a, b) => a.timeCreated - b.timeCreated);

    return [...pinned, ...pending, ...completed];
}

const reducer = (taskList: taskType[], action: manageListAction) => {
    if(action.type === "FETCH_ALL") {
        let list:taskType[] = action.payload.data || [];
        return sortTaskList(list);
    }

    else if(action.type === "DELETE") {
        let timeCreated = action.payload.timeCreated || 0;
        return taskList.filter(task => task.timeCreated !== timeCreated);
    }

    else if(action.type === "DELETE_COMPLETED")
        return taskList.filter(task => task.status !== "COMPLETED");

    else if(action.type === "TOGGLE_ALL_COMPLETE") {
        if(taskList.length === taskList.filter(task => task.status === "COMPLETED").length)
            return taskList.map(task => ({...task, status: "PENDING"}) as taskType);
        else
            return taskList.map(task => ({...task, status: "COMPLETED"}) as taskType);
    }

    else if(action.type === "EDIT") {
        let {task: editedTask} = action.payload;
        if(!editedTask)
            return taskList;
        return taskList.map(
            (task: taskType) => task.timeCreated === editedTask!.timeCreated ? {...task, ...editedTask} : task
        );
    }

    else {
        let {task: oldTask} = action.payload;
        if(!oldTask)
            return taskList;
        let newTask = oldTask;

        if(action.type === "CHANGE_STATUS") {
            const {newStatus, newTimeCreated} = action.payload;
            if(!newStatus || !newTimeCreated)
                return taskList;
            newTask = {task: oldTask.task, status: newStatus, timeCreated: newTimeCreated};
        }

        taskList = taskList.filter(task => task.timeCreated !== oldTask!.timeCreated);
        taskList.push(newTask);
        return sortTaskList(taskList);
    }
}

const useTaskList = () => {
    const [taskList, manageTaskList] = useReducer(reducer, []);
    return {taskList, manageTaskList};
}

export {useTaskList};