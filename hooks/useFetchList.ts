import {gql, useQuery} from '@apollo/client';
import { useEffect } from 'react';

const allTasksQuery = gql`
    query {
        tasks {
            timeCreated
            task
            status
        }
    }
`;

const useFetchList = (manageTaskList: any) => {
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