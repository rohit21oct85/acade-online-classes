import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../../../context/AuthContext.jsx';
import API_URL from '../../../../helper/APIHelper'
import { useParams } from 'react-router-dom';

export default function useSchoolAssignedTests() {
    const {state } = useContext(AuthContext);
    const params = useParams();
    return useQuery(`reports-${params?.school_id}-${params?.class_id}`, async () => {
        if(state.access_token){
            const result = await axios.get(`${API_URL}v1/school/report/${params?.school_id}/${params?.class_id}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+state.access_token
                }
            });
            return result.data.data; 
        }
    });
    
}
