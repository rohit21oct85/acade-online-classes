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
        name: '',
        EmpID:"",
        class: '',
        section: '',
        subject: '',
        mobile: '',
        email: '',
        password: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
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
            }else if(!pattern.test(formData.mobile)){
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
                            <option value={school._id} key={school._id}>{school.school_name}</option>
                        )
                        })}
                    </select>
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="EmpID"
                        value={params?.teacher_id ? SingleTeacher?.EmpID : formData?.EmpID}
                        onChange={handleChange}
                        placeholder="EmployeeId"/>
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="name"
                        value={params?.teacher_id ? SingleTeacher?.name : formData?.name}
                        onChange={handleChange}
                        placeholder="Name"/>
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="subject"
                        value={params?.teacher_id ? SingleTeacher?.subject : formData?.subject}
                        onChange={handleChange}
                        placeholder="Subject"/>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <input 
                                type="text" 
                                className="form-control" 
                                name="class"
                                value={params?.teacher_id ? SingleTeacher?.class : formData?.class}
                                onChange={handleChange}
                                placeholder="Class"/>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                        <input 
                            type="text" 
                            className="form-control" 
                            name="section"
                            value={params?.teacher_id ? SingleTeacher?.section : formData?.section}
                            onChange={handleChange}
                            placeholder="Section"/>
                        </div>
                    </div>
                </div>
                
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="mobile"
                        value={params?.teacher_id ? SingleTeacher?.mobile : formData?.mobile}
                        onChange={handleChange}
                        placeholder="Mobile"/>
                </div>
                <div className="form-group">
                    <input 
                        type="email" 
                        className="form-control" 
                        name="email"
                        value={params?.teacher_id ? SingleTeacher?.email : formData?.email}
                        onChange={handleChange}
                        placeholder="Email"/>
                </div>
                <div className="form-group">
                    <input 
                        type="password" 
                        className="form-control" 
                        name="password"
                        value={params?.teacher_id ? SingleTeacher?.password : formData?.password}
                        onChange={handleChange}
                        placeholder="Password"/>
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="address"
                        value={params?.teacher_id ? SingleTeacher?.address : formData?.address}
                        onChange={handleChange}
                        autoComplete="no-password"
                        placeholder="Address"/>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                        <input 
                            type="text" 
                            className="form-control" 
                            name="city"
                            value={params?.teacher_id ? SingleTeacher?.city : formData?.city}
                            onChange={handleChange}
                            autoComplete="no-password"
                            placeholder="City"/>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                        <input 
                            type="text" 
                            className="form-control" 
                            name="state"
                            value={params?.teacher_id ? SingleTeacher?.state : formData?.state}
                            onChange={handleChange}
                            autoComplete="no-password"
                            placeholder="State"/>
                        </div>
                    </div>
                </div>
                                
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="pincode"
                        maxLength={6}
                        value={params?.teacher_id ? SingleTeacher?.pincode : formData?.pincode}
                        onChange={handleChange}
                        autoComplete="no-password"
                        placeholder="Pincode"/>
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