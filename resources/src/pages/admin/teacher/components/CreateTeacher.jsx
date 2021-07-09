import React, {useState, useContext, useEffect} from 'react'
import {useHistory, useParams, useLocation} from 'react-router-dom'
import {AuthContext} from '../../../../context/AuthContext';
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../../helper/APIHelper';
import * as utils from '../../../../utils/utils'
import * as helper from '../../../../utils/helper'
import { useToasts } from 'react-toast-notifications';
import useSingleTeacher from '../hooks/useSingleTeacher';
import useSchoolLists from '../../school/hooks/useSchoolLists';
import useCreateTeacher from '../hooks/useCreateTeacher';
import useUpdateTeacher from '../hooks/useUpdateTeacher';
import useSubjectList from '../../subject/hooks/useSubjectList';
import useClassList from '../../class/hooks/useClassList';

export default function CreateTeacher() {
    const history = useHistory();
    const params  = useParams();
    const location = useLocation();
    const path = location.pathname;

    const { addToast } = useToasts();

    const {state} = useContext(AuthContext);

    const [loading, setLoading] = useState(false);

    const {data} = useSingleTeacher();
    const {data:subjects} = useSubjectList();
    const { data:SClassess} =useClassList();
    const [SingleTeacher, setSingleTeacher] = useState({});
    
    
    const {data : schools, isLoading } = useSchoolLists();
    const pattern = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
    const initialData = {
        name: '',
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
        console.log(params)
        setSingleTeacher(data)
    }

    const createMutation = useCreateTeacher(formData);
    const updateMutation = useUpdateTeacher(SingleTeacher);

    function getFirstletter(string){
        let fl;
        if(string && string.match(" ")){
            let data = string.split(" ").map( el => {
                return fl += el.charAt(0);
                
            })
            return data[1].split("undefined")[1];
        }else{
            return string?.charAt(0);
        }
    }

    const saveTeacher = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const domainName = helper.getFilteredData(schools, '_id',params.school_id,'short');
        const subject_name = params?.subject_name
        const teacherClas = await Array.from(document.querySelectorAll('.teacherClass')).map( tclass => {
            return {
                class_id: tclass?.value,
                class_name: tclass.dataset.class_name,
                checked: tclass?.checked === true ? true: false
            }
        })

        if(params?.teacher_id){
                SingleTeacher.school_id = params?.school_id
                SingleTeacher.subject_name = subject_name
                SingleTeacher.classess = teacherClas;

                console.log(SingleTeacher);
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
                let firstName = formData?.name
                let UID = `${domainName}${firstName.split(' ')[0]}${getFirstletter(subject_name)}T`;
                formData.EmpID = UID
                formData.subject_id = params?.subject_id
                formData.subject_name = subject_name
                formData.classess = teacherClas;
                await createMutation.mutate(formData); 
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
                history.push(`/admin/teachers-management/update/${e.target.value}/${params?.subject_id}/${params?.subject_name}/${params.teacher_id}`)
            }else{
                setFormData({...formData, ['school_id']: e.target.value})
                history.push(`/admin/teachers-management/create/${e.target.value}/${params?.subject_id}/${params?.subject_name}`)
            }
        }
    }

    async function handleChangeTeacher(e){
        const subject_name = e.target.options[e.target.selectedIndex].dataset.subject_name
        if(e.target.value != 999){
            if(params?.teacher_id){
                setSingleTeacher({...SingleTeacher, [e.target.name]: e.target.value,['subject_name']:subject_name})
                history.push(`/admin/teachers-management/update/${params?.school_id}/${e.target.value}/${subject_name}/${params.teacher_id}`)
            }else{
                setFormData({...formData, ['school_id']: e.target.value,['subject_name']:subject_name})
                history.push(`/admin/teachers-management/create/${params?.school_id}/${e.target.value}/${subject_name}`)
            }
        }
    }

    return (
        <>
            <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>Add New Teacher</p>
            <hr className="mt-1"/>
            <form className="row col-md-12" onSubmit={saveTeacher}>
                <div className="form-group col-md-2 pl-0">
                    <select className="form-control" aria-label="Default select example" name="school_id" onChange={handleChangeSchool} value={params.school_id ? params.school_id : 999}>
                        <option value="999">Select School</option>
                        {!isLoading && schools?.map(school => {
                        return (
                            <option value={school._id} key={school._id}>{school.school_name}</option>
                        )
                        })}
                    </select>
                </div>
                
                

                <div className="form-group col-md-2 pl-0">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="name"
                        value={params?.teacher_id ? SingleTeacher?.name : formData?.name}
                        onChange={handleChange}
                        placeholder="Name"/>
                </div>
                <div className="form-group col-md-2 pl-0">
                    <select className="form-control" aria-label="Default select example" 
                        name="teacher_subject" 
                        onChange={handleChangeTeacher} 
                        value={params?.subject_id}>
                        <option value="999">Select Subject</option>
                        {!isLoading && subjects?.map(subj => {
                        return (
                            <option 
                                value={subj._id} 
                                data-subject_name={utils.MakeSlug(subj?.subject_name)}
                                key={subj._id}
                            >{subj.subject_name}</option>
                        )
                        })}
                    </select>
                </div>
                <div className="form-group col-md-6 pl-0 pr-0">
                    <span>Choose Class: </span>
                    <div className="row col-md-12 pr-0">
                        {SClassess?.map(clas => {
                            let checkClass = SingleTeacher?.classess?.some(cls => (cls?.class_id === clas?._id && cls?.checked === true))
                            return(
                                <>
                                <label className="pl-0 pr-2 col-md-2">
                                    <input type="checkbox" className="teacherClass mr-1" 
                                    defaultValue={clas?._id} 
                                    data-class_name={clas?.class_name}
                                    checked={checkClass}
                                    onChange={e => {
                                        setSingleTeacher(SingleTeacher?.classess?.map( cls => {
                                            if(clas?.class_id === e.target.value){
                                                cls.checked = true
                                            }
                                        }));
                                        
                                    }}
                                    />
                                    {clas?.class_name} Th
                                </label>
                                </>
                            )
                        })}
                    </div>    
                </div>
                <div className="form-group col-md-2 pl-0">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="mobile"
                        value={params?.teacher_id ? SingleTeacher?.mobile : formData?.mobile}
                        onChange={handleChange}
                        placeholder="Mobile"/>
                </div>
                <div className="form-group col-md-2 pl-0">
                    <input 
                        type="email" 
                        className="form-control" 
                        name="email"
                        value={params?.teacher_id ? SingleTeacher?.email : formData?.email}
                        onChange={handleChange}
                        placeholder="Email"/>
                </div>
                <div className="form-group col-md-2 pl-0">
                    <input 
                        type="password" 
                        className="form-control" 
                        name="password"
                        value={params?.teacher_id ? SingleTeacher?.password : formData?.password}
                        onChange={handleChange}
                        placeholder="Password"/>
                </div>
                <div className="form-group col-md-3 pl-0">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="address"
                        value={params?.teacher_id ? SingleTeacher?.address : formData?.address}
                        onChange={handleChange}
                        autoComplete="no-password"
                        placeholder="Address"/>
                </div>
                
                <div className="form-group col-md-3 pl-0">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="city"
                        value={params?.teacher_id ? SingleTeacher?.city : formData?.city}
                        onChange={handleChange}
                        autoComplete="no-password"
                        placeholder="City"/>
                </div>
                <div className="form-group col-md-3 pl-0">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="state"
                        value={params?.teacher_id ? SingleTeacher?.state : formData?.state}
                        onChange={handleChange}
                        autoComplete="no-password"
                        placeholder="State"/>
                    
                </div>
            
                            
                <div className="form-group col-md-3 pl-0">
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
                <div className="col-md-12 pl-0">
                    <hr />
                </div>
            
                <div className="form-group col-md-3 mt-3 pl-0 flex">
                    <button className={`btn btn-sm dark`}
                    disabled={(createMutation?.isLoading || updateMutation?.isLoading)}>
                        {(createMutation?.isLoading || updateMutation?.isLoading) ? (
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
                
                    <button className="btn btn-sm dark bg-danger ml-2"
                    onClick={e => {
                        e.preventDefault();
                        history.push(`/admin/teachers-management/view/${params?.school_id}/${params?.subject_id}`)
                    }}>
                        <span className="fa fa-times"></span>
                    </button>
                
                </div>

            </form>  
        </>
    )
}