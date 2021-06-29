import React, { useContext, useState } from 'react'
import {useLocation, useParams, useHistory} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../../helper/APIHelper';
import { useToasts } from 'react-toast-notifications';
import {AuthContext} from '../../../../context/AuthContext';

export default function useUploadStudent(formDataUpload) {
      
      const queryClient = useQueryClient()
      const {state} = useContext(AuthContext);
      const params = useParams();
      const location = useLocation();
      const path = location.pathname;
      const history = useHistory();
      
      const options = {
            headers: {
                  'Content-Type': 'Application/json',
                  'Authorization':'Bearer '+state.access_token
            }
      }      
      const { addToast } = useToasts();
      const key = (params.school_id) ? `students-${params.school_id}` : `students`
      return useMutation(formDataUpload => {
            return axios.post(`${API_URL}v1/student/upload`, formDataUpload, options)
        },{
            onSuccess: () => {
                let school_id =  params?.school_id;
                queryClient.invalidateQueries(`${key}`)
                addToast('Student added successfully', { appearance: 'success', autoDismiss: true });
            }
        });
    
}
