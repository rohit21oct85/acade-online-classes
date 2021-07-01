import React, {useState, useContext, useEffect} from 'react'
import {useHistory, useParams, useLocation} from 'react-router-dom'
import {AuthContext} from '../../../context/AuthContext';
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../helper/APIHelper';
import * as utils from '../../../utils/utils'
import { useToasts } from 'react-toast-notifications';
import useSchoolLists from '../school/hooks/useSchoolLists';
import useTeacherList from '../../../pages/admin/teacher/hooks/useTeacherList';
import useClassList from '../class/hooks/useClassList';
import {MakeSlug} from '../../../utils/utils'
import useSingleTeacherClass from '../../../hooks/teacherClassMapping/useSingleTeacherClass';

export default function CreateTeacherStudentMap() {
    const history = useHistory();
    const params  = useParams();
    const location = useLocation();
    const path = location.pathname;

    const { addToast } = useToasts();

    const {state} = useContext(AuthContext);

    const [loading, setLoading] = useState(false);

    const {data : schools, isLoading } = useSchoolLists();
    const {data : teachers, teacherIsLoading } = useTeacherList();
    const {data : classes, classesIsLoading } = useClassList();
    const {data: teacherClassess, teacherClassessLoading} = useSingleTeacherClass();
    
    const pattern = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
    const initialData = {
        first_name: '',
        last_name: '',
        phone_no: '',
    } 
    const [formData, setFormData] = useState(initialData);
    const [checkedState, setCheckedState] = useState(
        new Array(classes && classes.length).fill(false)
    );

    const queryClient = useQueryClient()
    const options = {
        headers: {
            'Content-Type': 'Application/json',
            'Authorization':'Bearer '+state.access_token
        }
    }

    const mutation = useMutation(formData => {
        return axios.post(`${API_URL}v1/teacher-class-mapping/create`, formData, options)
    },{
        onSuccess: () => {
            let school_id =  params?.school_id;
            let teacher_id =  params?.teacher_id;
            queryClient.invalidateQueries(`teacher-class-mapping-${school_id}-${teacher_id}`)
            setLoading(false);
            setFormData(initialData);
            addToast('Mapping added successfully', { appearance: 'success', autoDismiss: true });
            history.push(`/admin/mapping-teacher-class/select-school/${params?.school_id}/${params?.school_slug}`);
        }
    });
    
    const saveMapping = async (e) => {
        e.preventDefault();
        setLoading(true);
        if(params?.teacher_sub_id){
                await updateMutation.mutate(SingleTeacher);
        }else{
            formData.school_id = params.school_id ? params.school_id : ''
            formData.teacher_id = params.teacher_id ? params.teacher_id : ''
            if(formData.school_id == ''){
                setLoading(false);
                addToast('Please Select a School', { appearance: 'error',autoDismiss: true });
            }else if(formData.teacher_id == ''){
                setLoading(false);
                addToast('Please Select a Teacher', { appearance: 'error',autoDismiss: true });
            }else{
                let ArrayModule = [];
                Array.from(document.querySelectorAll('.classes')).map( classs => {
                    if(classs.checked === true){
                        let data = classs.value
                        let splitData = data.split('_')
                        ArrayModule.push({
                            school_id: params?.school_id,
                            teacher_id: params?.teacher_id,
                            class_id: splitData[0],
                            class_name: splitData[1],
                            school_name: params.school_slug,
                            teacher_name: params.teacher_slug,
                        })
                    }
                })
                // console.log(ArrayModule);

                await mutation.mutate(ArrayModule); 
                clearFields();
            }
        } 
    }

    async function handleChangeTeacher(e){
        if(e.target.value != 999){
            if(params?.teacher_sub_id){
                // setSingleTeacher({...SingleTeacher, [e.target.name]: e.target.value})
                history.push(`/admin/mapping-teacher-class/select-school/${e.target.value}/${params.teacher_id}`)
            }else{
                const teacher_name = e.target.options[e.target.selectedIndex].dataset.teacher_name
                setFormData({...formData, ['teacher_id']: e.target.value, ['teacher_name']:teacher_name})
                history.push(`/admin/mapping-teacher-class/select-school/${params.school_id}/${MakeSlug(params.school_slug)}/${e.target.value}/${MakeSlug(teacher_name)}`)
            }
        }
    }

    function clearFields(){
        Array.from(document.querySelectorAll('.classes')).map(checkbox => {
            checkbox.checked = false
        })
    }

    async function handleCheckBox(e, position){
        // e.preventDefault();
        let data = e.target.value;
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );
        setCheckedState(updatedCheckedState);
    }

    async function handleChangeSchool(e){
        if(e.target.value != 999){
            const school_name = e.target.options[e.target.selectedIndex].dataset.school_name
            setFormData({...formData, ['school_id']: e.target.value,['school_name']:school_name})
            history.push(`/admin/mapping-teacher-class/select-school/${e.target.value}/${MakeSlug(school_name)}`)
        }
    }
    function checkTeacherClass(arr, class_id){
        if(teacherClassess?.length > 0 && !teacherClassessLoading){
            return arr.some(el => (el.class_id === class_id && el.checked === true))
        }
    }
    return (
        <>
            <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>Teacher-Class Mapping</p>
            <hr className="mt-1"/>
            <form onSubmit={saveMapping}>
                <div className="form-group">
                    <select className="form-control" aria-label="Default select example" name="school_id" onChange={handleChangeSchool} value={params.school_id ? params.school_id : 999}>
                        <option value="999">Select School</option>
                        {!isLoading && schools?.map(school => {
                        return (
                            <option value={school._id} key={school._id} data-school_name={school.school_name}>{school.school_name}</option>
                        )
                        })}
                    </select>
                </div>
                <div className="form-group">
                    <select className="form-control" aria-label="Default select example" name="teacher_id" onChange={handleChangeTeacher} value={params?.teacher_id ? params?.teacher_id : 999}>
                        <option value="999">Select Teacher</option>
                        {!teacherIsLoading && teachers?.map(teacher => {
                        return (
                            <option value={teacher._id} key={teacher._id} data-teacher_name={teacher.name}>{teacher.name} - {teacher.subject_name}</option>
                        )
                        })}
                    </select>
                </div>
                
                <div className="form-group">
                    <p className="mb-1">Choose Class</p>
                    <hr className="mb-1"/>    
                    <div className="col-md-12 pl-2 pr-2 row"
                    style={{
                        minHeight: '20px'
                    }}>
                        {classes?.map((classs, index) => {
                            let teacherClassChecked = checkTeacherClass(teacherClassess, classs?._id)
                            return(
                                <div className="col-md-4 pl-2 pt-0 pb-0 mb-2" key={classs?._id}>
                                    <label className="pb-0 mb-0">
                                    <input 
                                        className="mr-2 classes"
                                        type="checkbox" 
                                        id={`custom-checkbox-${index}`}
                                        name={classs?.class_name}
                                        value={`${classs?._id}_${classs?.class_name}`}
                                        data-checked={teacherClassChecked}
                                        checked={teacherClassChecked}
                                        onChange={(e)=>{handleCheckBox(e,index)}}
                                    />    
                                    {classs?.class_name}Th
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
                            {params?.teacher_class_id ? (
                                <><span className="fa fa-save mr-2"></span> Update Mapping</>
                                ):(
                                    
                                    <><span className="fa fa-save mr-2"></span> Save Mapping</>
                            )}
                            </>
                        )}
                        
                    </button>
                    {(params.school_id) && (
                        <button className="btn btn-sm dark bg-danger ml-2"
                        onClick={e => {
                            e.preventDefault();
                            history.push(`/admin/mapping-teacher-class`)
                        }}>
                            <span className="fa fa-times"></span>
                            Cancel
                        </button>
                    )}
                </div>
            </form>  
        </>
    )
}