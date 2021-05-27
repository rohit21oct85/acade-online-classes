import React, { useContext, useState } from 'react'
import {useLocation, useParams, useHistory} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../helper/APIHelper';
import { useToasts } from 'react-toast-notifications';
import {AuthContext} from '../../context/AuthContext';

export default function useUpdateSchoolAdmin(formData) {
      const params = useParams();
      const location = useLocation();
      const path = location.pathname;
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
      const status =  useMutation((formData) => {
            let school_admin_id =  params?.school_admin_id;
            return axios.patch(`${API_URL}v1/school-admin/update/${school_admin_id}`, formData, options)
        },{
        onSuccess: () => {
            queryClient.invalidateQueries('school-admins')
            addToast('School Admin Updated successfully', { appearance: 'success',autoDismiss: true });
            history.push('/admin/auth-management');
        }
        });
      return status;
}
