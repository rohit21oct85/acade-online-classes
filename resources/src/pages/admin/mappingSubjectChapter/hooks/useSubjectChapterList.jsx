
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../../../context/AuthContext.jsx';
import API_URL from '../../../../helper/APIHelper'
import {useParams} from 'react-router-dom'

export default function useSubjectChapterList() {
    const {state } = useContext(AuthContext);
    const params = useParams();
    let key= '';
    let url= '';
    if(params?.class_id && params?.subject_id && params?.unit_id){
        key = `subject-chapter-mappings-${params?.class_id}-${params?.subject_id}-${params?.unit_id}`;
        url = `${API_URL}v1/chapter/view-all/${params.class_id}/${params.subject_id}/${params?.unit_id}`;
    }
    else if(params?.class_id && params?.subject_id){
        key = `subject-chapter-mappings-${params?.class_id}-${params?.subject_id}`;
        url = `${API_URL}v1/chapter/view-all/${params.class_id}/${params.subject_id}`;

    }else{
        key = `subject-chapter-mappings`;
        url = `${API_URL}v1/chapter/view-all`;
        
    }
    
    return useQuery(key, async () => {
        const result = await axios.get(`${url}`,{
            headers: {
                'Content-Type': 'Application/json',
                'Authorization':'Bearer '+ state.access_token
            }
        });
        return result.data.data; 
    });
    
}
