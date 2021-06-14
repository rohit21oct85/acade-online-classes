import React, { useContext, useState } from 'react'
import {useLocation, useParams, useHistory} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../../helper/APIHelper';
import { useToasts } from 'react-toast-notifications';
import {AuthContext} from '../../../../context/AuthContext';

export default function useCreateQuestion(formData) {
      
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
      const key = `questions-${params?.class_id}-${params?.subject_id}-${params?.unit_id}-${params?.chapter_id}`;
    
      return useMutation(formData => {
            return axios.post(`${API_URL}v1/question-bank/create`, formData, options)
        },{
            onSuccess: () => {
                queryClient.invalidateQueries(`${key}`)
                history.push(`/admin/question-bank/create/${params?.class_id}/${params?.subject_id}/${params?.unit_id}/${params?.chapter_id}`);
                addToast('Questions added successfully', { appearance: 'success', autoDismiss: true });
                setTimeout(() => {
                  window.location.reload()
                },1000)
            }
        });
      
}
