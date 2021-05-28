
import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../context/AuthContext.jsx';
import API_URL from '../../helper/APIHelper'
import {useParams} from 'react-router-dom'

export default function useClassList() {
    const {state } = useContext(AuthContext);
    const params = useParams();
    const key = params.school_id ? `classes-${params.school_id}` : `classes`
    return useQuery(key, async () => {
        if(state.access_token ){
            if(!params.school_id){
                const result = await axios.get(`${API_URL}v1/class/view-all`,{
                    headers: {
                        'Content-Type': 'Application/json',
                        'Authorization':'Bearer '+ state.access_token
                    }
                });
                return result.data.data; 
            }else{
                const result = await axios.get(`${API_URL}v1/class/class-by-school-id/${params.school_id}`,{
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
