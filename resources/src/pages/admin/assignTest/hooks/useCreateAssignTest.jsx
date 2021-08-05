import React, { useContext, useState } from 'react'
import {useLocation, useParams, useHistory} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../../helper/APIHelper';
import { useToasts } from 'react-toast-notifications';
import {AuthContext} from '../../../../context/AuthContext';

export default function useCreateAssignTest(formData) {
      
      const queryClient = useQueryClient()
      const {state} = useContext(AuthContext);
      const params = useParams();
      const location = useLocation();
      const path = location.pathname;
      const history = useHistory();
      const class_id = params?.class_id
      const school_id = params?.school_id
      const test_type = params?.test_type
      const options = {
            headers: {
                  'Content-Type': 'Application/json',
                  'Authorization':'Bearer '+state.access_token
            }
      }      
      const { addToast } = useToasts();
      const key = `assign-tests-${params?.school_id}-${params?.class_id}`;
    
      return useMutation(formData => {
            return axios.post(`${API_URL}v1/assign-test/create`, formData, options)
        },{
            onSuccess: () => {
                queryClient.invalidateQueries(`${key}`)
                history.push(`/admin/assign-test/view/${school_id}/${test_type}/${class_id}`);
                addToast('test assigned successfully', { appearance: 'success', autoDismiss: true });
            }
        });
      
}
