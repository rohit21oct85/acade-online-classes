import React, { useContext, useState } from 'react'
import {useLocation, useParams, useHistory} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../../helper/APIHelper';
import { useToasts } from 'react-toast-notifications';
import {AuthContext} from '../../../../context/AuthContext';

export default function useCreateMockTest(formData) {
      
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
      const key = `mock-questions-${params?.question_for}`;
    
      return useMutation(formData => {
            return axios.post(`${API_URL}v1/mock-test/create`, formData, options)
        },{
            onSuccess: () => {
                queryClient.invalidateQueries(`${key}`)
                
                addToast('Mock Test added successfully', { appearance: 'success', autoDismiss: true });
                window.location.href = `/admin/mock-test/view/mock-test/${params?.question_for}`;
            }
        });
      
}
