import {useContext}  from 'react'
import{useParams} from 'react-router-dom'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../context/AuthContext.jsx';
import API_URL from '../../helper/APIHelper'

export default function useTeacherSubjectList() {
    const {state } = useContext(AuthContext);
    const params = useParams();
    const school_id = params?.school_id
    const teacher_id = params?.teacher_id
    return useQuery(`teacher-subject-mapping-${school_id}-${teacher_id}`, async () => {
        if(state?.access_token && teacher_id!== undefined){
            const result = await axios.get(`${API_URL}v1/teacher-subject-mapping/view-all/${school_id}/${teacher_id}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+state.access_token
                }
            });
            return result.data.data; 
        }
    });
    
}
