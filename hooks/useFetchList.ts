import { useEffect, useContext } from 'react';
import { gql, useQuery } from '@apollo/client';
import { TaskListContext } from '@/components/TodoContainer';

const allTasksQuery = gql`
    query {
        tasks {
            timeCreated
            task
            status
        }
    }
`;

const useFetchList = () => {
    const manageTaskList = useContext(TaskListContext) || (() => {});
    const {data, error, loading} = useQuery(allTasksQuery);

    useEffect(() => {
        if(data) {
            manageTaskList({
                type: "FETCH_ALL",
                payload: {
                    data: data.tasks
                }
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    return {error, loading};
}

export { useFetchList };