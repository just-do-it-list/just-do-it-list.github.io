import Task, {taskType} from './Task';
import { useFetchList } from '@/hooks/useFetchList';
import { FilterContext, AllCompleteContext } from './TodoContainer';
import { useContext, useEffect} from 'react';

const TaskList = ({taskList, manageTaskList}: {taskList: taskType[], manageTaskList: any}) => {
    const {error, loading} = useFetchList(manageTaskList);
    const filterContext = useContext(FilterContext);
    const activeTab = filterContext?.activeTab.toLowerCase() || 'all';
    const allCompleteContext = useContext(AllCompleteContext);
    const setAllComplete = allCompleteContext?.setAllComplete || (() => '');

    useEffect(() => {
        if(taskList.length && taskList.length === taskList.filter(task => task.status === "COMPLETED").length)
            setAllComplete(true);
        else
            setAllComplete(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskList])

    if(loading)
        return (<div>Loading...</div>);
    if(error)
        return (<div>Error Occured while fetching from database<br/>{error.toString()}</div>)
    return (
        <>
            {
                (activeTab === 'all'
                ? taskList
                : taskList.filter(task => task.status.toLowerCase() === activeTab)
                )
                .map(task =>
                    <Task task={task} key={task.timeCreated} manageTaskList={manageTaskList}/>
                )
            }
        </>
    );
}

export default TaskList;