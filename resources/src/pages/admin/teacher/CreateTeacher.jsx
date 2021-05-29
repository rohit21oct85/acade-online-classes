import React, {useState, useContext, useEffect} from 'react'
import {useHistory, useParams, useLocation} from 'react-router-dom'
import {AuthContext} from '../../../context/AuthContext';
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../helper/APIHelper';
import * as utils from '../../../utils/utils'
import { useToasts } from 'react-toast-notifications';
import useSingleTeacher from '../../../hooks/teachers/useSingleTeacher';

export default function CreateTeacher() {
    const history = useHistory();
    const params  = useParams();
    const location = useLocation();
    const path = location.pathname;

    const { addToast } = useToasts();

    const {state} = useContext(AuthContext);

    const [loading, setLoading] = useState(false);

    const {data} = useSingleTeacher();

    const [SingleTeacher, setSingleTeacher] = useState({});

    const initialData = {
        first_name: '',
        last_name: '',
        class_assigned: '',
        phone_no: '',
    } 
    const [formData, setFormData] = useState(initialData);

    useEffect(setModule, [data]);
    function setModule(){
        setSingleTeacher(data)
    }

    const queryClient = useQueryClient()
    const options = {
        headers: {
            'Content-Type': 'Application/json',
            'Authorization':'Bearer '+state.access_token
        }
    }

    const mutation = useMutation(formData => {
        return axios.post(`${API_URL}v1/teacher/create`, formData, options)
    },{
        onSuccess: () => {
            queryClient.invalidateQueries('teachers')
            setLoading(false);
            setFormData(initialData);
            history.push(`${path}`);
            addToast('Teacher added successfully', { appearance: 'success', autoDismiss: true });
        }
    });
    
    const updateMutation = useMutation((formData) => {
        let teacher_id =  params?.teacher_id;
        return axios.patch(`${API_URL}v1/teacher/update/${teacher_id}`, formData, options)
    },{
        onSuccess: () => {
            queryClient.invalidateQueries('teachers')
            setLoading(false);
            setFormData(initialData);
            history.push(`${path}`);
            addToast('Teacher Updated successfully', { appearance: 'success',autoDismiss: true });
        }
    });

    const saveTeacher = async (e) => {
        e.preventDefault();
        setLoading(true);
        if(params?.teacher_id){
                await updateMutation.mutate(SingleTeacher);
        }else{

                await mutation.mutate(formData);
        }
    }

    async function handleChange(e){
        if(params?.teacher_id){
                setSingleTeacher({...SingleTeacher, [e.target.name]: e.target.value})
        }else{
                setFormData({...formData, [e.target.name]: e.target.value})
        }
    }

    return (
        <>
            <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>Add New Teacher</p>
            <hr className="mt-1"/>
            <form onSubmit={saveTeacher}>
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="first_name"
                        value={params?.teacher_id ? SingleTeacher?.first_name : formData?.first_name}
                        onChange={handleChange}
                        placeholder="First Name"/>
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="last_name"
                        value={params?.teacher_id ? SingleTeacher?.last_name : formData?.last_name}
                        onChange={handleChange}
                        placeholder="Last Name"/>
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="class_assigned"
                        value={params?.teacher_id ? SingleTeacher?.class_assigned : formData?.class_assigned}
                        onChange={handleChange}
                        placeholder="Class Assigned"/>
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="phone_no"
                        value={params?.teacher_id ? SingleTeacher?.phone_no : formData?.phone_no}
                        onChange={handleChange}
                        placeholder="Phone no"/>
                </div>
            
                <div className="form-group flex">
                    <button className="btn btn-sm dark">
                        {loading ? (
                            <>
                            <span className="fa fa-spinner mr-2"></span>
                            processing ....
                            </>
                        ) : (
                            <>
                            {params?.teacher_id ? (
                                <><span className="fa fa-save mr-2"></span> Update Teacher</>
                                ):(
                                    
                                    <><span className="fa fa-save mr-2"></span> Save Teacher</>
                            )}
                            </>
                        )}
                        
                    </button>
                    {params?.teacher_id && (
                        <button className="btn btn-sm red ml-2"
                        onClick={e => {
                            e.preventDefault();
                            history.push(`/admin/teachers-management`)
                        }}>
                            <span className="fa fa-times mr-2"></span>
                            Cancel
                        </button>
                    )}
                </div>

            </form>  
        </>
    )
}