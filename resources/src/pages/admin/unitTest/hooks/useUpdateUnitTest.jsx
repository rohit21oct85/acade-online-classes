import React, { useContext, useState } from 'react'
import {useLocation, useParams, useHistory} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../../helper/APIHelper';
import { useToasts } from 'react-toast-notifications';
import {AuthContext} from '../../../../context/AuthContext';

export default function useUpdateUnitTest(formData) {
      
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
      const key = `unit-tests-${params?.class_id}-${params?.subject_id}`;
      return useMutation((formData) => {
            let test_id =  params?.test_id;
            return axios.patch(`${API_URL}v1/unit-test/update/${test_id}`, formData, options)
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
