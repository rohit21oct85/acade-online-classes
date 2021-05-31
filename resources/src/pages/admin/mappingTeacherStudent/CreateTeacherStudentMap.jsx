import React, {useState, useContext, useEffect} from 'react'
import {useHistory, useParams, useLocation} from 'react-router-dom'
import {AuthContext} from '../../../context/AuthContext';
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../helper/APIHelper';
import * as utils from '../../../utils/utils'
import { useToasts } from 'react-toast-notifications';
import useSingleTeacher from '../../../hooks/teachers/useSingleTeacher';
// import useSchoolLists from '../../../hooks/schools/useSchoolLists';
import useTeacherList from '../../../hooks/teachers/useTeacherList';
import useSubjectList from '../../../hooks/subjects/useSubjectList';

export default function CreateTeacherStudentMap() {
    const history = useHistory();
    const params  = useParams();
    const location = useLocation();
    const path = location.pathname;

    const { addToast } = useToasts();

    const {state} = useContext(AuthContext);

    const [loading, setLoading] = useState(false);

    const {data} = useSingleTeacher();

    const [SingleTeacher, setSingleTeacher] = useState({});

    // const {data : schools, isLoading } = useSchoolLists();
    const {data : teachers, teacherIsLoading } = useTeacherList();
    const {data : subjects, subjectIsLoading } = useSubjectList();
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

    async function handleChangeTeacher(e){
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

    async function handleCheckBox(e){
        e.preventDefault();
        let data = e.target.value;
        console.log(data)
        document.getElementById(`${module_id}`).style.checked = true;
        AppModules.push({
            role_id: params?.role_id,
            role_slug: params?.role_slug,
            school_id: params?.school_id,
            school_slug: params?.school_slug,
            module_id: module_id,
            module_slug: module_slug,
        })
    }

    return (
        <>
            <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>Add New Teacher</p>
            <hr className="mt-1"/>
            <form onSubmit={saveTeacher}>
                {/* <div className="form-group">
                    <select className="form-control" aria-label="Default select example" name="school_id" onChange={handleChangeSchool} value={params.school_id ? params.school_id : 999}>
                        <option value="999">Select School</option>
                        {!isLoading && schools?.map(school => {
                        return (
                            <option value={school._id} key={school._id}>{school.name}</option>
                        )
                        })}
                    </select>
                </div> */}
                <div className="form-group">
                    <select className="form-control" aria-label="Default select example" name="teacher_id" onChange={handleChangeTeacher} value={params?.teacher_id ? params?.teacher_id : 999}>
                        <option value="999">Select Teacher</option>
                        {!teacherIsLoading && teachers?.map(teacher => {
                        return (
                            <option value={teacher._id} key={teacher._id}>{teacher.first_name+" "+teacher.last_name}</option>
                        )
                        })}
                    </select>
                </div>
                
                <div className="form-group">
                    <div className="col-md-12 pl-0 pr-2"
                    style={{
                        minHeight: '280px',
                        maxHeight: '280px',
                        overflow: 'scroll'
                    }}>
                        {subjects?.map(module => {
                            return(
                                <div className="card pl-2 pt-0 pb-0 mb-2" key={module?._id}>
                                    <label className="pb-0 mb-0">
                                    <input 
                                        className="mr-2"
                                        type="checkbox" 
                                        name={module?.subject_name}
                                        value={`${module?._id}_${module?.module_slug}`}
                                        onChange={handleCheckBox}
                                    />    
                                    {module?.subject_name}
                                    </label>
                                </div>
                            );
                        })}
                    </div>                
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