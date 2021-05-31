import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../context/AuthContext.jsx';
import API_URL from '../../helper/APIHelper'

export default function useOtherModule() {
    const {state } = useContext(AuthContext);
    const user_type = state?.user_type
    const school_slug = state?.school_slug

    return useQuery('other-modules', async () => {
        if(state.access_token && state?.user_type == 'school-admin'){
            const result = await axios.get(`${API_URL}v1/permission/module/${school_slug}/${user_type}`,{
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization':'Bearer '+state.access_token
                }
            });
            return result.data.data; 
        }
        console.log("inside useOther Module")
    });
    
}
