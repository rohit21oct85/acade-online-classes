import React, { useContext, useState } from 'react'
import {useLocation, useParams, useHistory} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../../helper/APIHelper';
import { useToasts } from 'react-toast-notifications';
import {AuthContext} from '../../../../context/AuthContext';

export default function useUpdateSample(formData) {
      
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
      const key = params.sample_id ? `questions-${params.sample_id}` : `questions`
      return useMutation((formData) => {
            let sample_id =  params?.sample_id;
            return axios.patch(`${API_URL}v1/sample/update/${sample_id}`, formData, options)
        },{
            onSuccess: () => {
                queryClient.invalidateQueries(`${key}`)
                setLoading(false);
                setFormData(initialData);
                history.push(`${path}`);
                addToast('Question Updated successfully', { appearance: 'success',autoDismiss: true });
            }
        });
}
