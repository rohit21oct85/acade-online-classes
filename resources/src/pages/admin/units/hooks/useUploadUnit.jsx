import React, { useContext, useState } from 'react'
import {useLocation, useParams, useHistory} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../../helper/APIHelper';
import { useToasts } from 'react-toast-notifications';
import {AuthContext} from '../../../../context/AuthContext';

export default function useUploadUnit(formData) {
      
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
      let key = '';
      key = `units-${params.class_id}-${params?.subject_id}`;

      return useMutation(formDataUpload => {
            return axios.post(`${API_URL}v1/unit/upload`, formDataUpload, options)
      },{
      onSuccess: () => {
            queryClient.invalidateQueries(`${key}`)
            setLoading(false);
            addToast('Units Uploaded successfully', { appearance: 'success', autoDismiss: true });
      }
      });
}
