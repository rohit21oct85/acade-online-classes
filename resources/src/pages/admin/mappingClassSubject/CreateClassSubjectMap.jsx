import React, {useState, useContext, useEffect} from 'react'
import {useHistory, useParams, useLocation} from 'react-router-dom'
import {AuthContext} from '../../../context/AuthContext';
import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import API_URL from '../../../helper/APIHelper';
import * as utils from '../../../utils/utils'
import { useToasts } from 'react-toast-notifications';
import useClassList from '../../../hooks/classes/useClassList';
import useSubjectList from '../../../hooks/subjects/useSubjectList';
import {MakeSlug} from '../../../utils/utils'

export default function CreateClassSubjectMap() {
    const history = useHistory();
    const params  = useParams();
    const location = useLocation();
    const path = location.pathname;

    const { addToast } = useToasts();

    const {state} = useContext(AuthContext);

    const [loading, setLoading] = useState(false);

    const {data : classes, classesIsLoading } = useClassList();
    const {data : subjects, subjectsIsLoading } = useSubjectList();
    const pattern = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
    const initialData = {
        first_name: '',
        last_name: '',
        phone_no: '',
    } 
    const [formData, setFormData] = useState(initialData);
    const [checkedState, setCheckedState] = useState(
        new Array(subjects && subjects.length).fill(false)
    );

    const queryClient = useQueryClient()
    const options = {
        headers: {
            'Content-Type': 'Application/json',
            'Authorization':'Bearer '+state.access_token
        }
    }

    const mutation = useMutation(formData => {
        return axios.post(`${API_URL}v1/class-subject-mapping/create`, formData, options)
    },{
        onSuccess: () => {
            let class_id =  params?.class_id;
            queryClient.invalidateQueries(`class-subject-mapping-${class_id}`)
            setLoading(false);
            setFormData(initialData);
            addToast('Mapping added successfully', { appearance: 'success', autoDismiss: true });
            history.push('/admin/mapping-class-subjects');
        }
    });
    
    const saveMapping = async (e) => {
        e.preventDefault();
        setLoading(true);
        if(params?.class_subject_id){
                await updateMutation.mutate(SingleTeacher);
        }else{
            formData.class_id = params.class_id ? params.class_id : ''
            if(formData.class_id == ''){
                setLoading(false);
                addToast('Please Select a Class', { appearance: 'error',autoDismiss: true });
            }else{
                let ArrayModule = [];
                Array.from(document.querySelectorAll('.subjects')).map( classs => {
                    if(classs.checked === true){
                        let data = classs.value
                        let splitData = data.split('_')
                        ArrayModule.push({
                            class_id: params?.class_id,
                            subject_id: splitData[0],
                            subject_name: splitData[1],
                            class_name: formData.class_name,
                        })
                    }
                })
                await mutation.mutate(ArrayModule); 
                clearFields();
            }
        } 
    }

    async function handleChangeClass(e){
        if(e.target.value != 999){
            const class_name = e.target.options[e.target.selectedIndex].dataset.class_name
            setFormData({...formData, ['class_id']: e.target.value, ['class_name']:class_name})
            history.push(`/admin/mapping-class-subjects/select-class/${e.target.value}/${MakeSlug(class_name)}`)
        }
    }

    function clearFields(){
        Array.from(document.querySelectorAll('.subjects')).map(checkbox => {
            checkbox.checked = false
        })
    }

    async function handleCheckBox(e, position){
        let data = e.target.value;
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );
        setCheckedState(updatedCheckedState);
    }

    return (
        <>
            <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>Add New Class-Subject Mapping</p>
            <hr className="mt-1"/>
            <form onSubmit={saveMapping}>
                <div className="form-group">
                    <select className="form-control" aria-label="Default select example" name="class_id" onChange={handleChangeClass} value={params?.class_id ? params?.class_id : 999}>
                        <option value="999">Select Class</option>
                        {!classesIsLoading && classes?.map(classs => {
                        return (
                            <option value={classs._id} key={classs._id} data-class_name={classs.class_name}>{classs.class_name} -&nbsp; Section {classs.section}, Capacity:&nbsp;{classs.capacity}</option>
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
                        {subjects?.map((subject, index) => {
                            return(
                                <div className="card pl-2 pt-0 pb-0 mb-2" key={subject?._id}>
                                    <label className="pb-0 mb-0">
                                    <input 
                                        className="mr-2 subjects"
                                        type="checkbox" 
                                        id={`custom-checkbox-${index}`}
                                        name={subject?.subject_name}
                                        value={`${subject?._id}_${subject?.subject_name}`}
                                        checked={checkedState[index]}
                                        onChange={(e)=>{handleCheckBox(e,index)}}
                                    />    
                                    {subject?.subject_name}
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
                    {(params.class_id) && (
                        <button className="btn btn-sm red ml-2"
                        onClick={e => {
                            e.preventDefault();
                            history.push(`/admin/mapping-class-subjects`)
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