
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../context/AuthContext.jsx';
import API_URL from '../../helper/APIHelper'
import {useParams} from 'react-router-dom'

export default function useStudentList() {
    const {state } = useContext(AuthContext);
    const params = useParams();
    const key = (params.school_id && params.class_id) ? `students-${params.school_id}-${params.class_id}` : `students`
    return useQuery(key, async () => {
        if(state.access_token){
            if(!params.school_id && !params.class_id){
                const result = await axios.get(`${API_URL}v1/student/view-all`,{
                    headers: {
                        'Content-Type': 'Application/json',
                        'Authorization':'Bearer '+ state.access_token
                    }
                });
                return result.data.data;
            }else{
                const result = await axios.get(`${API_URL}v1/student/student-by-school-id-class-id/${params.school_id}/${params.class_id}`,{
                    headers: {
                        'Content-Type': 'Application/json',
                        'Authorization':'Bearer '+ state.access_token
                    }
                });
                return result.data.data;
            } 
        }
    });
    
}
