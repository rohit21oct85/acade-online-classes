import { useContext } from 'react'
import {useLocation, useHistory, useParams} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../../helper/APIHelper';
import { useToasts } from 'react-toast-notifications';
import {AuthContext} from '../../../../context/AuthContext';

export default function useDeleteSubjectChapter(formData) {
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
      let key= '';
      let url= '';
      if(params?.class_id && params?.subject_id && params?.unit_id){
            key = `subject-chapter-mappings-${params?.class_id}-${params?.subject_id}-${params?.unit_id}`;
            
        }
        else if(params?.class_id && params?.subject_id){
            key = `subject-chapter-mappings-${params?.class_id}-${params?.subject_id}`;
            
    
        }else{
            key = `subject-chapter-mappings`;
            
        }
      const status =  useMutation((chapter_subject_id) => {
            return axios.delete(`${API_URL}v1/chapter/delete/${chapter_subject_id}`, options)
        },{
            onSuccesss: () => {
                  queryClient.invalidateQueries(`${key}`)
                  addToast('Chapter Deleted successfully', { appearance: 'success',autoDismiss: true });
            }
        });
      return status;
}
