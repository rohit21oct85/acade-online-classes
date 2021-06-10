import {useParams} from 'react-router-dom'
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../../../context/AuthContext.jsx';
import API_URL from '../../../../helper/APIHelper'

export default function useSingleSchool() {
    const params = useParams();
    const student_id = params?.student_id
    const {state } = useContext(AuthContext);
    return useQuery(`single-module-${student_id}`, async () => {
        if(student_id !== undefined){
            const result = await axios.get(`${API_URL}v1/student/view/${student_id}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+state.access_token
                }
            });
            return result.data.data; 
        }
        
    });
    
}
