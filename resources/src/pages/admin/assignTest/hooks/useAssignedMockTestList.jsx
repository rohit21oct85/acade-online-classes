
import {useContext, useState}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../../../context/AuthContext.jsx';
import API_URL from '../../../../helper/APIHelper'
import {useParams} from 'react-router-dom'

export default function useAssignedMockTestList() {
    const {state } = useContext(AuthContext);
    const params = useParams();
    const school_id = params?.school_id
    const [intervalMs, setIntervalMs] = useState(1000)
    let key = '';
    let url = '';
    let mock_test_for = localStorage.getItem('mock_test_for')
    if(state.access_token && school_id && params?.test_type){
        url = `${API_URL}v1/assign-test/view-assigned-mock-test/${school_id}/${params?.test_type}/${mock_test_for}`;
        key = `assign-tests-${school_id}-${params?.test_type}`;
    }

    return useQuery(`${key}`, async () => {
        const result = await axios.get(url,{
            headers: {
                'Content-Type': 'Application/json',
                'Authorization':'Bearer '+ state.access_token
            }
        },
        {
          // Refetch the data every second
          refetchInterval: intervalMs,
        });
        return result.data.data; 
    });
    
}
