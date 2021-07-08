import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../../../context/AuthContext.jsx';
import API_URL from '../../../../helper/APIHelper'
import { useParams } from 'react-router-dom';

export default function usePrincipalLists() {
    const {state } = useContext(AuthContext);
    const params = useParams();
    return useQuery(`principals-${params?.school_id}`, async () => {
        if(state.access_token && params?.school_id){
            const result = await axios.get(`${API_URL}v1/principal/view-all/${params?.school_id}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+state.access_token
                }
            });
            return result.data.data; 
        }
    });
    
}
