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
      const options = {
            headers: {
                  'Content-Type': 'Application/json',
                  'Authorization':'Bearer '+state.access_token
            }
      }      
      const { addToast } = useToasts();
      const status =  useMutation((formData) => {
            return axios.post(`${API_URL}v1/mock-test/delete-all-test`,formData, options)
        },{
        onSuccess: () => {
            queryClient.invalidateQueries(`assign-tests-${params?.school_id}-${params?.test_type}`)
            history.push(path);
            addToast('Schools deleted successfully', { appearance: 'success',autoDismiss: true });
        }
        });
      return status;
}
