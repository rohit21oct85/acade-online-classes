import { useContext } from 'react'
import {useLocation, useHistory, useParams} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../../helper/APIHelper';
import { useToasts } from 'react-toast-notifications';
import {AuthContext} from '../../../../context/AuthContext';

export default function useDeleteSchoolMockTest(formData) {
      const location = useLocation();
      const path  = location.pathname;
      const params = useParams();
      const history = useHistory();
      const queryClient = useQueryClient()
      const {state} = useContext(AuthContext);
      const class_id = params?.class_id
      const school_id = params?.school_id
      let key;
      const options = {
            headers: {
                  'Content-Type': 'Application/json',
                  'Authorization':'Bearer '+state.access_token
            }
      }      
      const { addToast } = useToasts();
      if(state.access_token && school_id && params?.test_type !== 'mock-test' && class_id ){
            key = `assign-tests-${school_id}-${params?.test_type}-${class_id}`;
        }else if(state.access_token && school_id && params?.test_type === 'mock-test'){
            key = `assign-tests-${school_id}-${params?.test_type}`;
        }
    
      const status =  useMutation((formData) => {
            return axios.post(`${API_URL}v1/mock-test/delete-all-test`,formData, options)
        },{
        onSuccess: () => {
            queryClient.invalidateQueries(`${key}`)
            history.push(path);
            addToast('Schools deleted successfully', { appearance: 'success',autoDismiss: true });
        }
        });
      return status;
}
