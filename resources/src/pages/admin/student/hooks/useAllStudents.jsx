
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../../../context/AuthContext';
import API_URL from '../../../../helper/APIHelper'
import {useParams} from 'react-router-dom'

export default function useAllStudents() {
    const {state } = useContext(AuthContext);
    const params = useParams();
    const key = `students-${params.school_id}`
    return useQuery(key, async () => {
        if(state.access_token && params?.school_id){
            
            const result = await axios.get(`${API_URL}v1/student/all-students/${params.school_id}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+ state.access_token
                }
            });
            return result.data.data;
        
        }
    });
    
}
