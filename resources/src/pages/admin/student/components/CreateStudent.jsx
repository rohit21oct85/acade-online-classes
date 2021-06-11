import React, {useState, useContext, useEffect} from 'react'
import {useHistory, useParams, useLocation} from 'react-router-dom'
import {AuthContext} from '../../../../context/AuthContext';
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../../helper/APIHelper';
import * as utils from '../../../../utils/utils'
import { useToasts } from 'react-toast-notifications';
import useSingleStudent from '../hooks/useSingleStudent';
import useSchoolLists from '../../school/hooks/useSchoolLists';
import useClassList from '../../class/hooks/useClassList';
import useCreateStudent from '../hooks/useCreateStudent';
import useUpdateStudent from '../hooks/useUpdateStudent';

export default function CreateStudent() {
    const history = useHistory();
    const params  = useParams();
    const location = useLocation();
    const path = location.pathname;

    const { addToast } = useToasts();

    const {state} = useContext(AuthContext);

    const [loading, setLoading] = useState(false);

    const {data} = useSingleStudent();
    const pattern = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
    const [SingleStudent, setSingleStudent] = useState({});
    const {data : schools, schoolIsLoading } = useSchoolLists();
    const {data : classes, classesIsLoading } = useClassList();

    const initialData = {
        name: '',
        class_id: '',
        class: '',
        section: '',
        roll_no: '',
        mobile: '',
        email: '',
    } 
    const [formData, setFormData] = useState(initialData);

    useEffect(setModule, [data]);
    function setModule(){
        setSingleStudent(data)
    }

    const queryClient = useQueryClient()
    const options = {
        headers: {
            'Content-Type': 'Application/json',
            'Authorization':'Bearer '+state.access_token
        }
    }

    const createMutation = useCreateStudent(SingleStudent);
    const updateMutation = useUpdateStudent(formData);

    const saveStudent = async (e) => {
        e.preventDefault();
        setLoading(true);
        if(params?.student_id){
                await updateMutation.mutate(SingleStudent);
        }else{
            formData.school_id = params.school_id ? params.school_id : ''
            if(formData.school_id == ''){
                setLoading(false);
                addToast('Please Select a School', { appearance: 'error',autoDismiss: true });
            }else {
                formData.password = "password"
                if(!pattern.test(formData.mobile)){
                    setLoading(false);
                    addToast('Please Enter a valid 10 digit phone no', { appearance: 'error',autoDismiss: true });
                }else{
                    const domainName = schools.filter(school =>  school._id == params.school_id)
                    formData.username = formData.name + formData.mobile.substr(-4) + `@${domainName[0].domain}`;
                    await createMutation.mutate(formData);
                }
            }
        }
    }

    async function handleChange(e){
        if(params?.student_id){
                setSingleStudent({...SingleStudent, [e.target.name]: e.target.value})
        }else{
                setFormData({...formData, [e.target.name]: e.target.value})
        }
    }

    async function handleChangeSchool(e){
        if(e.target.value != 999){
            if(params?.student_id){
                setSingleStudent({...SingleStudent, [e.target.name]: e.target.value})
                    history.push(`/admin/student-management/update/${e.target.value}/${params?.class_id}/${params?.student_id}`)
            }else{
                setFormData({...formData, ['school_id']: e.target.value})
                params.class_id ?
                    history.push(`/admin/students-management/create/${e.target.value}/${params?.class_id}`)
                    :
                    history.push(`/admin/students-management/create/${e.target.value}`)
                }
        }
    }

    return (
        <>
            <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>Add New Student</p>
            <hr className="mt-1"/>
            <form onSubmit={saveStudent}>
                <div className="form-group">
                    <select className="form-control" aria-label="Default select example" name="school_id" onChange={handleChangeSchool} value={params.school_id ? params.school_id : 999}>
                        <option value="999">Select School</option>
                        {!schoolIsLoading && schools?.map(school => {
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
                        name="name"
                        value={params?.student_id ? SingleStudent?.name : formData?.name}
                        onChange={handleChange}
                        placeholder="Name"/>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <input 
                                type="text" 
                                className="form-control" 
                                name="class"
                                value={params?.student_id ? SingleStudent?.class : formData?.class}
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
                                value={params?.student_id ? SingleStudent?.section : formData?.section}
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
                        value={params?.student_id ? SingleStudent?.mobile : formData?.mobile}
                        onChange={handleChange}
                        placeholder="Phone"/>
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="email"
                        value={params?.student_id ? SingleStudent?.email : formData?.email}
                        onChange={handleChange}
                        placeholder="Email"/>
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="password"
                        onChange={handleChange}
                        placeholder="Password"/>
                </div>
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="roll_no"
                        value={params?.student_id ? SingleStudent?.roll_no : formData?.roll_no}
                        onChange={handleChange}
                        placeholder="Roll No"/>
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
                            {params?.student_id ? (
                                <><span className="fa fa-save mr-2"></span> Update Student</>
                                ):(
                                    
                                    <><span className="fa fa-save mr-2"></span> Save Student</>
                            )}
                            </>
                        )}
                        
                    </button>
                    <button className="btn btn-sm dark bg-danger ml-2"
                    onClick={e => {
                        e.preventDefault();
                        history.push(`/admin/students-management`)
                    }}>
                        <span className="fa fa-times"></span>
                    </button>
                    
                </div>

            </form>  
        </>
    )
}