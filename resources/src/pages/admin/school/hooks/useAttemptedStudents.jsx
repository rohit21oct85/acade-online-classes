import {useContext, useState}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../../../context/AuthContext.jsx';
import API_URL from '../../../../helper/APIHelper'
import { useParams } from 'react-router-dom';

export default function useAttemptedStudents() {
    const {state } = useContext(AuthContext);
    const params = useParams();
    const [intervalMs, setIntervalMs] = useState(1000)
    return useQuery(`attempted_studetns-${params?.test_id}`, async () => {
        if(state.access_token && params?.test_id && params?.test_type){
            const result = await axios.get(`${API_URL}v1/test-report/view-student/${params?.test_id}/${params?.school_id}/${params?.class_id}/${params?.test_type}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+state.access_token
                }
            },{
                refetchInterval: intervalMs,
            });
            return result.data.data; 
        }
    });
    
}
