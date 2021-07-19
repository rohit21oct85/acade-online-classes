import React, { useContext, useState } from 'react'
import {useLocation, useParams, useHistory} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../../helper/APIHelper';
import { useToasts } from 'react-toast-notifications';
import {AuthContext} from '../../../../context/AuthContext';

export default function useUpdateTeacher(formData) {
      
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
      const key = `teachers-${params.school_id}-${params.subject_id}`
      return useMutation((formData) => {
            let teacher_id =  params?.teacher_id;
            return axios.patch(`${API_URL}v1/teacher/update/${teacher_id}`, formData, options)
        },{
            onSuccess: () => {
                let school_id =  params?.school_id;
                queryClient.invalidateQueries(`${key}`)
                history.push(`/admin/teachers-management/view/${params?.school_id}/${params?.subject_id}/${params?.subject_name}/${params?.teacher_id}`);
                addToast('Teacher Updated successfully', { appearance: 'success',autoDismiss: true });
            }
        });
}
