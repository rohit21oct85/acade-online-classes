
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../../../context/AuthContext';
import API_URL from '../../../../helper/APIHelper'
import {useParams} from 'react-router-dom'

export default function useClassRollNo() {
    const {state } = useContext(AuthContext);
    const params = useParams();
    return useQuery(`rollno-${params?.school_id}-${params?.class_id}-${params?.section}`, async () => {
        if(state.access_token && params?.school_id && params?.class_id && params?.section){
            const result = await axios.get(`${API_URL}v1/student/roll-no/${params?.school_id}/${params?.class_id}/${params?.section}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+ state.access_token
                }
            });
            return result.data.data; 
        }
    });
    
}
