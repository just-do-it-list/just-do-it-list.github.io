'use client';
import { Dispatch, SetStateAction, createContext, useState } from "react";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "@/lib/apollo";
import Controls from "./Controls";
import TaskList from "./TaskList";
import AddTask from "./AddTask";
import { useTaskList, manageListAction } from "@/hooks/useTaskList";

type filterContextType = {
    activeTab: string;
    setActiveTab: Dispatch<SetStateAction<string>>;
}

type allCompleteContextType = {
    allComplete: boolean;
    setAllComplete: Dispatch<SetStateAction<boolean>>;
}

export const FilterContext = createContext<filterContextType | null>(null);
export const AllCompleteContext = createContext<allCompleteContextType | null>(null);
export const TaskListContext = createContext<Dispatch<manageListAction> | null>(null);

const TodoContainer = () => {
    const {taskList, manageTaskList} = useTaskList();
    const [activeTab, setActiveTab] = useState("All");
    const [allComplete, setAllComplete] = useState(false);

    return (
        <div className="mx-auto max-sm:w-11/12 sm:max-md:w-11/12 md:max-lg:w-10/12 lg:max-xl:w-[800px] xl:w-[900px] container text-[#646464] h-max">
            <ApolloProvider client={apolloClient}>
                <TaskListContext.Provider value={manageTaskList}>
                    <AddTask />
                    <FilterContext.Provider value={{activeTab, setActiveTab}}>
                        <AllCompleteContext.Provider value={{allComplete, setAllComplete}}>
                            <Controls />
                            <TaskList taskList={taskList} />
                        </AllCompleteContext.Provider>
                    </FilterContext.Provider>
                </TaskListContext.Provider>
            </ApolloProvider>
        </div>
    )
}

export default TodoContainer;