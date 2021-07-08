
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../../../context/AuthContext.jsx';
import API_URL from '../../../../helper/APIHelper'
import {useParams} from 'react-router-dom'

export default function useTeacherList() {
    const {state } = useContext(AuthContext);
    const params = useParams();
    const key = `teachers-${params.school_id}-${params.subject_id}`
    return useQuery(key, async () => {
        if(state.access_token && params?.school_id && params?.subject_id){
            
                const result = await axios.get(`${API_URL}v1/teacher/view-all/${params.school_id}/${params?.subject_id}`,{
                    headers: {
                        'Content-Type': 'Application/json',
                        'Authorization':'Bearer '+ state.access_token
                    }
                });
                return result.data.data; 
            
            
        }
    });
    
}
