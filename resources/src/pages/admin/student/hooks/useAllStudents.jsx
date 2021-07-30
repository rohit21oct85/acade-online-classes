
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../../../context/AuthContext';
import API_URL from '../../../../helper/APIHelper'
import {useParams} from 'react-router-dom'

export default function useAllStudents() {
    const {state } = useContext(AuthContext);
    const params = useParams();
    let school_id = params?.school_id
    let class_id = params?.class_id
    let key;
    let url;
    if(school_id && class_id){
      key = `students-${school_id}-${class_id}`
      url = `${API_URL}v1/student/all-students/${school_id}/${class_id}`
    }else if(school_id){
      key = `students-${school_id}`
      url = `${API_URL}v1/student/all-students/${school_id}`
    }
    
    return useQuery(key, async () => {
        if(state.access_token && school_id){
            
            const result = await axios.get(`${url}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+ state.access_token
                }
            });
            return result.data.data;
        
        }
    });
    
}
