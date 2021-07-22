import {useContext, useState}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../../../context/AuthContext.jsx';
import API_URL from '../../../../helper/APIHelper'
import { useParams } from 'react-router-dom';

export default function useActivityDetails() {
    const {state } = useContext(AuthContext);
    const params = useParams();
    const [intervalMs, setIntervalMs] = useState(5000)
    return useQuery(`reports-${params?.school_id}-${params?.user_type}-${params?.user_id}`, async () => {
        if(state.access_token && params?.school_id && params?.user_type && params?.user_id){
            const result = await axios.get(`${API_URL}v1/school/activity-details/${params?.school_id}/${params?.user_type}/${params?.user_id}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+state.access_token
                }
            },{
                refetchInterval: intervalMs,
            });
            return result.data.data; 
        }
    },{
        refetchInterval: intervalMs,
    });
    
}
