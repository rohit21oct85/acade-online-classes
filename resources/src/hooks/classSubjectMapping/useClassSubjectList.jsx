import {useContext}  from 'react'
import{useParams} from 'react-router-dom'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../context/AuthContext.jsx';
import API_URL from '../../helper/APIHelper'

export default function useClassSubjectList() {
    const {state } = useContext(AuthContext);
    const params = useParams();
    const class_id = params?.class_id
    return useQuery(`class-subject-mapping-${class_id}`, async () => {
        if(state?.access_token && class_id!== undefined){
            const result = await axios.get(`${API_URL}v1/class-subject-mapping/view-all/${class_id}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+state.access_token
                }
            });
            return result.data.data; 
        }
    });
    
}
