
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../../../context/AuthContext.jsx';
import API_URL from '../../../../helper/APIHelper'
import {useParams} from 'react-router-dom'

export default function useAssignedTestList() {
    const {state } = useContext(AuthContext);
    const params = useParams();
    const class_id = params?.class_id
    const subject_id = params?.subject_id
    const school_id = params?.school_id
    let key = '';
    let url = '';
    if(state.access_token && school_id && params?.test_type && class_id ){
        url = `${API_URL}v1/assign-test/view-all/${school_id}/${params?.test_type}/${class_id}`;
        key = `assign-tests-${school_id}-${params?.test_type}-${class_id}`;
    }

    return useQuery(`${key}`, async () => {
        const result = await axios.get(url,{
            headers: {
                'Content-Type': 'Application/json',
                'Authorization':'Bearer '+ state.access_token
            }
        });
        return result.data.data; 
    });
    
}
