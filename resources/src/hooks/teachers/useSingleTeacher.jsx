import {useParams} from 'react-router-dom'
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../context/AuthContext.jsx';
import API_URL from '../../helper/APIHelper'

export default function useSingleTeacher() {
    const params = useParams();
    const teacher_id = params?.teacher_id
    const {state } = useContext(AuthContext);
    return useQuery(`single-module-${teacher_id}`, async () => {
        if(teacher_id !== undefined){
            const result = await axios.get(`${API_URL}v1/teacher/view/${teacher_id}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+state.access_token
                }
            });
            return result.data.data; 
        }
        
    });
    
}
