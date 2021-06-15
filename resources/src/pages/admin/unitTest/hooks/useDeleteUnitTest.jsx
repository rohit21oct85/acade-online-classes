import { useContext } from 'react'
import {useLocation, useHistory, useParams} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../../helper/APIHelper';
import { useToasts } from 'react-toast-notifications';
import {AuthContext} from '../../../../context/AuthContext';

export default function UnitTest(formData) {
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
            return axios.delete(`${API_URL}v1/unit-test/delete/${sample_id}`, options)
        },{
            onSuccess: () => {
                const key = `unit-tests-${params?.class_id}-${params?.subject_id}`;
                queryClient.invalidateQueries(key)
                history.push(`${path}`);
                addToast('Teacher Deleted successfully', { appearance: 'success',autoDismiss: true });
            }
        });
      return status;
}
