import React, {useState, useContext, useEffect} from 'react'
import {useHistory, useParams, useLocation} from 'react-router-dom'
import {AuthContext} from '../../../../context/AuthContext';
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../../helper/APIHelper';
import * as utils from '../../../../utils/utils'
import { useToasts } from 'react-toast-notifications';
import useSingleClass from '../../class/hooks/useSingleClass';
// import useSchoolLists from '../../../hooks/schools/useSchoolLists';

export default function CreateClass() {
    const history = useHistory();
    const params  = useParams();
    const location = useLocation();
    const path = location.pathname;

    const { addToast } = useToasts();
    
    const {state} = useContext(AuthContext);

    const [loading, setLoading] = useState(false);
    
    const [schooloradmin, setSchoolOrAdmin] = useState("admin");

    const {data} = useSingleClass();
    
    // const {data : schools, isLoading } = useSchoolLists();

    const [SingleClass, setSingleClass] = useState({});
    const [secs, setSecs] = useState([]);

    const [teacher, setTeacher] = useState();

    const initialData = {
        class_name: '',
        section: '',
        capacity: '',
        class_teacher: '',
        school_id: '',
        teacher_id: ''
    } 
    const [formData, setFormData] = useState(initialData);

    useEffect(setModule, [data]);
    function setModule(){
        setSingleClass(data)
        setSecs(data?.section)
    }

    const queryClient = useQueryClient()
    const options = {
        headers: {
            'Content-Type': 'Application/json',
            'Authorization':'Bearer '+state.access_token
        }
    }

    const mutation = useMutation(formData => {
        console.log(formData)
        return axios.post(`${API_URL}v1/class/create`, formData, options)
    },{
        onSuccess: () => {
            let school_id =  params?.school_id;
            queryClient.invalidateQueries(`classes`)
            setLoading(false);
            setFormData(initialData);
            history.push(`${path}`);
            addToast('Class added successfully', { appearance: 'success',autoDismiss: true });
        }
    });
    
    const updateMutation = useMutation((formData) => {
        let class_id =  params?.class_id;
        return axios.patch(`${API_URL}v1/class/update/${class_id}`, formData, options)
    },{
        onSuccess: () => {
            let school_id =  params?.school_id;
            queryClient.invalidateQueries(`classes`)
            setLoading(false);
            setFormData(initialData);
            history.push(`${path}`);
            addToast('Class Updated successfully', { appearance: 'success',autoDismiss: true });
        }
    });

    const saveClass = async (e) => {
        e.preventDefault();
        setLoading(true);
        if(params?.class_id){
                await updateMutation.mutate(SingleClass);
        }else{
            const sec = await Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map( tclass => {
                    return tclass?.value
            })
            console.log(sec)
            formData.section = sec;
            // setFormData({...formData, ['section']: classSection})
            // formData.section  = classSection
            // setFormData({...formData, ['section']: classSection})
            // formData.school_id = params.school_id ? params.school_id : '' 
            // if(formData.school_id == ''){
            //     setLoading(false);
            //     addToast('Please Select a School', { appearance: 'error',autoDismiss: true });
            // }else{
                await mutation.mutate(formData);
            // }
        }        
    }

    async function handleChange(e){
        // let classSection = []
        if(params?.class_id){
            setSingleClass({...SingleClass, [e.target.name]: e.target.value})
        }else{
            // if(e.target.type == "checkbox"){
            //     classSection = await Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map( tclass => {
            //         return tclass?.value
            //     })
            // }
            setFormData({...formData, [e.target.name]: e.target.value})
        }
    }
    
    async function handleChangeSchool(e){
        if(e.target.value != 999){
            if(params?.class_id){
                setSingleClass({...SingleClass, [e.target.name]: e.target.value})
                history.push(`/admin/class-management/select-school/${e.target.value}/${params.class_id}`)
            }else{
                setFormData({...formData, ['school_id']: e.target.value})
                history.push(`/admin/class-management/select-school/${e.target.value}`)
            }
        }
    }

    const sections = [
        {'value': 'A'},{'value':'B'},{'value':'C'},{'value':'D'},{'value':'E'},
        {'value': 'F'},{'value':'G'},{'value':'H'},{'value':'I'},{'value':'J'},
        {'value': 'K'},{'value':'L'},{'value':'M'},{'value':'N'},{'value':'O'},
        {'value': 'P'},{'value':'Q'},{'value':'R'},{'value':'S'},{'value':'T'},
        {'value': 'U'},{'value':'V'},{'value':'W'},{'value':'X'},{'value':'Y'},
        {'value': 'Z'},
    ]

    return (
        <>
            <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>Add New Class</p>
            <hr className="mt-1"/>
            <form onSubmit={saveClass}>
                {/* <div className="form-group">
                    <select className="form-control" aria-label="Default select example" name="school_id" onChange={handleChangeSchool} value={params.school_id ? params.school_id : 999}>
                        <option value="999">Select School</option>
                        {!isLoading && schools?.map(school => {
                        return (
                            <option value={school._id} key={school._id}>{school.school_name}</option>
                        )
                        })}
                    </select>
                </div> */}
                <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="class_name"
                        value={params?.class_id ? SingleClass?.class_name : formData?.class_name}
                        onChange={handleChange}
                        placeholder="Class Name"/>
                </div>
                <div className="form-group">
                    {/* <input 
                        type="text" 
                        className="form-control" 
                        name="section"
                        value={params?.class_id ? SingleClass?.section : formData?.section}
                        onChange={handleChange}
                        placeholder="Section"/> */}
                        {/* <select className="form-control" aria-label="Default select example" name="section" onChange={handleChange}> */}
                            {/* <option value="999">Select Section</option> */}
                            {sections && sections.map((item,key) => {
                                // console.log(secs.includes(item?.value))
                                return( 
                                    // <option value={item.value} key={key}>{item.value}</option>
                                <label className="col-md-4 pl-0" key={key}>
                                    <input type="checkbox" className="mr-1 classSection"
                                    value={item?.value} 
                                    // onChange={handleChange}
                                    // checked={secs && secs.includes(item?.value) ? "true" : ""}
                                    />
                                    {item?.value}
                                </label>
                                )
                            })}
                        {/* </select> */}
                </div>

                <div className="form-group">
                    <input 
                        type="number" 
                        className="form-control" 
                        name="capacity"
                        value={params?.class_id ? SingleClass?.capacity : formData?.capacity}
                        onChange={handleChange}
                        placeholder="Class Capacity"/>
                </div>

                {/* <div className="form-group">
                    <input 
                        type="text" 
                        className="form-control" 
                        name="class_teacher"
                        value={params?.class_id ? SingleClass?.class_teacher : formData?.class_teacher}
                        onChange={handleChange}
                        placeholder="Class Teacher"/>
                </div> */}

                <div className="form-group flex">
                    <button className="btn btn-sm dark">
                        {loading ? (
                            <>
                            <span className="fa fa-spinner mr-2"></span>
                            processing ....
                            </>
                        ) : (
                            <>
                            {params?.class_id ? (
                                <><span className="fa fa-save mr-2"></span> Update Class</>
                                ):(
                                    
                                    <><span className="fa fa-save mr-2"></span> Save Class</>
                            )}
                            </>
                        )}
                        
                    </button>
                    
                        <button className="btn btn-sm dark bg-danger ml-2"
                        onClick={e => {
                            e.preventDefault();
                            history.push(`/admin/class-management`)
                        }}>
                            <span className="fa fa-times"></span>
                        </button>
                
                </div>

            </form>  
        </>
    )
}