import Task, {taskType} from './Task';
import { useFetchList } from '@/hooks/useFetchList';
import { FilterContext, AllCompleteContext } from './TodoContainer';
import { useContext, useEffect} from 'react';
import { useTransition, animated } from '@react-spring/web'

const TaskList = ({taskList, manageTaskList}: {taskList: taskType[], manageTaskList: any}) => {
    const {error, loading} = useFetchList(manageTaskList);
    const filterContext = useContext(FilterContext);
    const activeTab = filterContext?.activeTab.toLowerCase() || 'all';
    const allCompleteContext = useContext(AllCompleteContext);
    const setAllComplete = allCompleteContext?.setAllComplete || (() => '');

    let height = 0;
    const transitions = useTransition(
        taskList.map(data => ({ ...data, y: (height += 0) - 0 })),
        {
            key: (item: taskType) => item.timeCreated,
            from: { height: 0, opacity: 0 },
            leave: { height: 0, opacity: 0 },
            enter: ({ y }) => ({ y, height: 60, opacity: 1 }),
            update: ({ y }) => ({ y, height: 60 }),
        }
    );

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
    // return (
    //     <>
    //         {
    //             (activeTab === 'all'
    //             ? taskList
    //             : taskList.filter(task => task.status.toLowerCase() === activeTab)
    //             )
    //             .map(task =>
    //                 <Task task={task} key={task.timeCreated} manageTaskList={manageTaskList}/>
    //             )
    //         }
    //     </>
    // );

    return (
        <>
            {transitions((style, task, t, index) => (
                (activeTab === 'all' || task.status.toLowerCase() === activeTab)
                ?
                    <animated.div style={{ zIndex: taskList.length - index, overflow: 'hidden', padding: 0, margin: 0, ...style}}>
                        <Task task={task} key={task.timeCreated} manageTaskList={manageTaskList}/>
                    </animated.div>
                :
                    <></>
            ))}
        </>
    )
}

export default TaskList;