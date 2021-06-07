import {useContext}  from 'react'
import {useQuery} from 'react-query';
import axios from 'axios';
import {AuthContext} from '../../context/AuthContext.jsx';
import API_URL from '../../helper/APIHelper'

export default function useOtherModule() {
    const {state } = useContext(AuthContext);
    const user_type = state?.user_type
    // @todo - add admin email
    return useQuery('other-modules', async () => {
        const result = await axios.get(`${API_URL}v1/permission/module/${user_type}`,{
            headers: {
                'Content-Type': 'Application/json',
                'Authorization':'Bearer '+state.access_token
            }
        });
        return result.data.data; 
        
        console.log("inside useOther Module")
    });
    
}
