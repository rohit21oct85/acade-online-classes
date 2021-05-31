import React, {useState, useContext, useEffect} from 'react'
import {useHistory, useParams, useLocation} from 'react-router-dom'
import {AuthContext} from '../../../context/AuthContext';
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../helper/APIHelper';
import * as utils from '../../../utils/utils'
import { useToasts } from 'react-toast-notifications';
import useSingleTeacher from '../../../hooks/teachers/useSingleTeacher';
import useSchoolLists from '../../../hooks/schools/useSchoolLists';

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

    const {data : schools, isLoading } = useSchoolLists();
    const pattern = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
    const initialData = {
        first_name: '',
        last_name: '',
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
            let school_id =  params?.school_id;
            queryClient.invalidateQueries(`teachers-${school_id}`)
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
            let school_id =  params?.school_id;
            queryClient.invalidateQueries(`teachers-${school_id}`)
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
            formData.school_id = params.school_id ? params.school_id : ''
            if(formData.school_id == ''){
                setLoading(false);
                addToast('Please Select a School', { appearance: 'error',autoDismiss: true });
            }else if(!pattern.test(formData.phone_no)){
                setLoading(false);
                addToast('Please Enter a valid 10 digit phone no', { appearance: 'error',autoDismiss: true });
            }else{
                await mutation.mutate(formData); 
            }
        } 
    }

    async function handleChange(e){
        if(params?.teacher_id){
                setSingleTeacher({...SingleTeacher, [e.target.name]: e.target.value})
        }else{
                setFormData({...formData, [e.target.name]: e.target.value})
        }
    }

    async function handleChangeSchool(e){
        if(e.target.value != 999){
            if(params?.teacher_id){
                setSingleTeacher({...SingleTeacher, [e.target.name]: e.target.value})
                history.push(`/admin/teachers-management/select-school/${e.target.value}/${params.teacher_id}`)
            }else{
                setFormData({...formData, ['school_id']: e.target.value})
                history.push(`/admin/teachers-management/select-school/${e.target.value}`)
            }
        }
    }

    return (
        <>
            <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>Add New Teacher</p>
            <hr className="mt-1"/>
            <form onSubmit={saveTeacher}>
                <div className="form-group">
                    <select className="form-control" aria-label="Default select example" name="school_id" onChange={handleChangeSchool} value={params.school_id ? params.school_id : 999}>
                        <option value="999">Select School</option>
                        {!isLoading && schools?.map(school => {
                        return (
                            <option value={school._id} key={school._id}>{school.name}</option>
                        )
                        })}
                    </select>
                </div>
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
                    {(params?.teacher_id || params.school_id) && (
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