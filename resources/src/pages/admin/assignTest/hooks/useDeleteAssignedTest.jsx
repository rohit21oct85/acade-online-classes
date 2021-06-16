import { useContext } from 'react'
import {useLocation, useHistory, useParams} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../../helper/APIHelper';
import { useToasts } from 'react-toast-notifications';
import {AuthContext} from '../../../../context/AuthContext';

export default function useDeleteAssignedTest(formData) {
      const params = useParams()
      
      const location = useLocation();
      const path  = location.pathname;

      
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
      const status =  useMutation((sample_id) => {
            return axios.delete(`${API_URL}v1/sample/delete/${sample_id}`, options)
        },{
            onSuccess: () => {
                const key = params?.qbank_id ? `sample-${params.sample_id}` : `sample`
                queryClient.invalidateQueries(key)
                addToast('Teacher Deleted successfully', { appearance: 'success',autoDismiss: true });
            }
        });
      return status;
}
