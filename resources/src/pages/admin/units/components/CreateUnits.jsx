import React, {useState} from 'react'
import { useHistory, useParams } from 'react-router-dom';
import useClassList from '../../class/hooks/useClassList'
import useClassSubjectList from '../../../../hooks/classSubjectMapping/useClassSubjectList';

export default function CreateUnits() {
      const params = useParams();
      const history = useHistory();
      const {data} = useClassList();

      const [counter, setCounter] = useState(1);
      const [loading, setLoading] = useState(false);
      const [SingleUnit, setSingleUnit] = useState({});

      const addCounter = () => {
            setCounter(counter + 1);
      }

      const initialData = {
            unit_no: '',
            unit_name: '',
      }

      const [formData, setFormData] = useState(initialData);

      const {data:subjects, isLoading: subjectLoading} = useClassSubjectList();

      async function handleChange(e){
            if(params?.unit_id){
                  setSingleUnit({...SingleUnit, [e.target.name]: e.target.value})
            }else{
                  setFormData({...formData, [e.target.name]: e.target.value})
            }
      }

      const handleChangeV = (e) => {
            const class_name = e.target.options[e.target.selectedIndex].dataset.class_name
            const subject_name = e.target.options[e.target.selectedIndex].dataset.subject_name
            if(class_name != undefined){
                  setFormData({...formData, [e.target.name]: e.target.value, ['class_name']: class_name})
            }else{
                  setFormData({...formData, [e.target.name]: e.target.value, ['subject_name']: subject_name})
            }

      }

      const saveUnits = async (e) => {
            e.preventDefault();
            let arrayData = [];
            // document.querySelector('input[name=hey]').value
            setLoading(true);
            // Array.from(document.querySelectorAll('.addedItems')).map( (item,key) => {
            //       if(document.querySelector(`input[name=unit_no${key}]`) !== null){
            //             console.log(document.querySelector(`input[name=unit_no${key}]`).value)
            //             console.log(document.querySelector(`input[name=unit_name${key}]`).value)
            //       }
            //       arrayData.push({

            //       })
            // })
            for(let i = 0; i< counter; i ++){
                  arrayData.push({
                        class_id:params?.class_id,
                        class_name: formData.class_name,
                        subject_id:params?.subject_id,
                        subject_name: formData.subject_name,
                        unit_no: formData[`unit_no${i}`],
                        unit_name:formData[`unit_name${i}`],
                  })
            }
            console.log(arrayData)
      }

      return (
            <div>
                  <form onSubmit={saveUnits}>
                        <p className="form-heading">
                        <span className="fa fa-plus-circle mr-2"></span>Add New Units</p>
                        <hr className="mt-1"/>
                        <div className="form-group">
                        <select className="form-control"
                        value={params?.class_id}
                        onChange={e => {
                              handleChangeV(e)
                              if(e.target.value === '_'){
                                    history.push(`/admin/manage-units/create/`)  
                              }else{
                                    history.push(`/admin/manage-units/create/${e.target.value}`)  
                              }
                        }}>
                              <option value="_">Select Classes</option>
                              {data?.map(classess => {
                                    return(
                                         <option value={classess?._id} key={classess?._id} data-class_name={classess?.class_name}>{classess?.class_name} th, Section- {classess?.section} </option>       
                                    )
                              })}
                        </select>
                        </div>
                        
                        <div className="form-group">
                        <select className="form-control"
                        value={params?.subject_id}
                        onChange={e => {
                              handleChangeV(e)
                              if(e.target.value === '_'){
                                    history.push(`/admin/manage-units/create/${params?.class_id}`)                          
                              }else{
                                    history.push(`/admin/manage-units/create/${params?.class_id}/${e.target.value}`)                          
                              }
                        }} 
                        >
                              <option value="_">{subjectLoading ? 'loading ...':'Select Subjects'}</option>
                              {subjects?.map( subject => {
                                    return(
                                          <option value={subject?._id} key={subject?._id} data-subject_name={subject?.subject_name}>{subject?.subject_name}</option>
                                    )
                              })}
                        </select>
                        </div>
                        <div className="form-group">
                              <button className="btn btn-sm dark mr-2"
                                    onClick={e => {
                                          e.preventDefault()
                                          addCounter();
                                    }}>
                                    <span className="fa fa-plus mr-2"></span>
                                    Add New Unit
                              </button>
                        </div>

                        {[...Array(counter)].map((x, i) =>
                              <span key={i}>
                                    <div className="form-group">
                                          <input 
                                                type="text" 
                                                className="form-control addedItems" 
                                                name={`unit_no${i}`}
                                                // value={params?.unit_id ? SingleUnit?.unit_no : formData?.unit_no}
                                                value={params?.unit_id && SingleUnit.unit_name}
                                                onChange={handleChange}
                                                placeholder="Unit No"/>
                                    </div>
                                    <div className="form-group">
                                          <input 
                                                type="text" 
                                                className="form-control addedItems" 
                                                name={`unit_name${i}`}
                                                // value={params?.unit_id ? SingleUnit?.unit_name : formData?.unit_name}
                                                value={params?.unit_id && SingleUnit.unit_name}
                                                onChange={handleChange}
                                                placeholder="Unit Name"/>
                                    </div>
                                    <hr/>
                              </span>
                        )}

                        
                        
                        <div className="form-group flex">
                              <button className="btn btn-sm dark">
                                    {loading ? (
                                    <>
                                    <span className="fa fa-spinner mr-2"></span>
                                    processing ....
                                    </>
                                    ) : (
                                    <>
                                    {params?.unit_id ? (
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
                                    history.push(`/admin/manage-units`)
                                    }}>
                                    <span className="fa fa-times"></span>
                              </button>
                        </div>
                  </form>  
            </div>
      )
}
