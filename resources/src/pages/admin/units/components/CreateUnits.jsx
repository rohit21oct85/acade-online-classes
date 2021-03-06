import React, {useState, useEffect} from 'react'
import { useHistory, useParams } from 'react-router-dom';
import useClassList from '../../class/hooks/useClassList'
import useClassSubjectList from '../../../../hooks/classSubjectMapping/useClassSubjectList';
import useCreateUnit from '../hooks/useCreateUnit';
import useUpdateUnit from '../hooks/useUpdateUnit';
import useSingleUnit from '../hooks/useSingleUnit';
import { useToasts } from 'react-toast-notifications';
import useUploadUnit from '../hooks/useUploadUnit';
import * as helper from '../../../../utils/helper'
import { MakeSlug } from '../../../../utils/utils';

export default function CreateUnits() {
      const params = useParams();
      const history = useHistory();
      const {data} = useClassList();
      const {data:subjects, isLoading: subjectLoading} = useClassSubjectList();
      const { addToast } = useToasts();
      const {data:dataset} = useSingleUnit();
      const [counter, setCounter] = useState(1);
      const [loading, setLoading] = useState(false);
      const [SingleUnit, setSingleUnit] = useState({});
      const [btnDisabled, setBtnDisbaled] = useState(true)
      const [file, setFile] = useState(null);
      const formDataUpload = new FormData();
      const addCounter = () => {
            setCounter(counter + 1);
      }

      const initialData = {
            unit_no: '',
            unit_name: '',
            marks: '',
      }

      const [formData, setFormData] = useState(initialData);

      useEffect(setModule, [dataset]);
      function setModule(){
            setSingleUnit(dataset)
      }
      

      const createMutation = useCreateUnit(formData);
      const updateMutation = useUpdateUnit(formData);
      const uploadMutation = useUploadUnit(formDataUpload);  

      async function handleChange(e){
            if(params?.unit_id){
                  console.log(e.target.name)
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
            setLoading(true);
            
            if(params?.unit_id){
                  for(let i = 0; i< counter; i ++){
                        arrayData.push({
                              unit_id: params?.unit_id,
                              class_id:params?.class_id,
                              class_name: SingleUnit.class_name,
                              subject_id:params?.subject_id,
                              subject_name:SingleUnit?.subject_name,
                              unit_no: (SingleUnit?.unit_no !== formData?.unit_no) ? SingleUnit?.unit_no: formData?.unit_no,
                              unit_name: (SingleUnit?.unit_name !== formData?.unit_name) ? SingleUnit?.unit_name: formData?.unit_name,
                              marks: SingleUnit?.marks,
                        })
                  }
                  await updateMutation.mutate(arrayData);
            }else{
                  for(let i = 0; i< counter; i ++){
                        arrayData.push({
                              class_id:params?.class_id,
                              class_name: formData.class_name,
                              subject_id:params?.subject_id,
                              subject_name: formData.subject_name,
                              unit_no: formData[`unit_no${i}`],
                              unit_name:formData[`unit_name${i}`],
                              marks:formData[`marks${i}`],
                        })
                  }
                  await createMutation.mutate(arrayData);
            }
            setLoading(false);
            clearFields();
      }
      

      async function handelChangeUpload(e){
            const filename = e.target.files[0].name;
            console.log('file onchange ' ,  filename);
            const ext = filename.split('.')[1];
            console.log(ext)
            if(ext === "csv"){
                setBtnDisbaled(false);
                setFile(e.target.files[0]);
                formDataUpload.append('file', e.target.files[0]);
                
            }else{
                setBtnDisbaled(true);
                addToast('Only .csv files are allowed', { appearance: 'error', autoDismiss: true });
            }
        }
      
      async function uploadUnitFile(e){
            e.preventDefault();
            let class_id = params?.class_id
            let class_name = helper.getFilteredData(data,'_id' ,class_id, 'class_name');
            formDataUpload.append('file',file);
            formDataUpload.append('class_id', class_id);
            formDataUpload.append('class_name', class_name);
            await uploadMutation.mutate(formDataUpload);
      }
      function clearFields(){
            Array.from(document.querySelectorAll('.addedItems')).map(el => {
                  el.value = ''
            })
      }
      return (
            <div>
                  <form>
                        <p className="form-heading">
                        <span className="fa fa-plus-circle mr-2"></span>Add Multiple Unit</p>
                        <hr className="mt-1"/>
                        <div className="form-group">
                        <select className="form-control"
                        value={params?.class_id}
                        onChange={e => {
                              handleChangeV(e)
                              if(e.target.value === '_'){
                                    history.push(`/admin/manage-units/${params?.page_type}/`)  
                              }else{
                                    history.push(`/admin/manage-units/${params?.page_type}/${e.target.value}`)  
                              }
                        }}>
                              <option value="_">Select Classes</option>
                              {data?.map(classess => {
                                    return(
                                         <option value={classess?._id} key={classess?._id} data-class_name={classess?.class_name}>{classess?.class_name} th </option>       
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
                                    history.push(`/admin/manage-units/${params?.page_type}/${params?.class_id}`)                          
                              }else{
                                    const subject_name = e.target.options[e.target.selectedIndex].dataset.subject_name
                                    history.push(`/admin/manage-units/${params?.page_type}/${params?.class_id}/${e.target.value}/${subject_name}`)                          
                              }
                        }} 
                        >
                              <option value="_">{subjectLoading ? 'loading ...':'Select Subjects'}</option>
                              {subjects?.map( subject => {
                                    return(
                                          <option value={subject?.subject_id} key={subject?.subject_id} data-subject_name={MakeSlug(subject?.subject_name)}>{subject?.subject_name}</option>
                                    )
                              })}
                        </select>
                        </div>
                        {(params?.page_type === 'create' || params?.page_type === 'update') 
                              && (
                              <>      
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
                                    <div className="row">
                                    <div className="form-group col-md-2 pr-0">
                                          <input 
                                                type="text" 
                                                className="form-control addedItems" 
                                                name={params?.unit_id ? 'unit_no' : `unit_no${i}`}
                                                value={params?.unit_id && SingleUnit && SingleUnit.unit_no}
                                                onChange={handleChange}
                                                placeholder="No"/>
                                    </div>
                                    
                                    <div className="form-group col-md-2 pl-1 pr-0">
                                          <input 
                                                type="text" 
                                                className="form-control addedItems" 
                                                name={params?.unit_id ? 'marks' : `marks${i}`}
                                                value={params?.unit_id && SingleUnit && SingleUnit.marks}
                                                onChange={handleChange}
                                                placeholder="Marks"/>
                                    </div>
                                    <div className="form-group col-md-8 pl-1">
                                          <input 
                                                type="text" 
                                                className="form-control addedItems" 
                                                name={params?.unit_id ? 'unit_name' : `unit_name${i}`}
                                                value={params?.unit_id && SingleUnit && SingleUnit.unit_name}
                                                onChange={handleChange}
                                                placeholder="Unit Name"/>
                                    </div>
                                    <hr/>
                                    </div>
                              </span>
                        )}
                        </>
                        
                              )
                        }      
                        {params?.page_type === 'upload' && (
                              <div className="col-md-12 pl-0 pr-0">
                                    <label>Upload Files</label>
                                    <a href="/sampledata/units.csv" className="pull-right" download>Download Sample</a>
                                    <input 
                                    type="file" 
                                    className="form-control" 
                                    name="file"
                                    onChange={handelChangeUpload}
                                    placeholder="Upload .csv"/>
                                    <small id="passwordHelpInline" class="text-muted">
                                    Upload Classes File in .csv format only.
                                    </small>
                              </div>
                        )}
                        
                        <hr className="mt-1 mb-1"/>
                        <div className="form-group flex mt-2">
                              
                              {params?.page_type !== 'upload' && (
                              <button
                              type="button"
                              className="btn btn-sm dark"
                              onClick={saveUnits}>
                                    {(createMutation?.isLoading || updateMutation?.isLoading) ? (
                                    <>
                                    <span className="fa fa-spinner mr-2"></span>
                                    processing ....
                                    </>
                                    ) : (
                                    <>
                                    {params?.unit_id ? (
                                          <><span className="fa fa-save mr-2"></span> Update Unit</>
                                          ):(
                                                
                                    <><span className="fa fa-save mr-2"></span> Save Unit</>
                                    )}
                                    </>
                              )}
                              
                              </button>
                              )}
                              

                              {params?.page_type === 'upload' && (
                                   <button className="btn btn-sm dark"
                                   type="button"
                                   disabled={btnDisabled}
                                   onClick={uploadUnitFile}>
                                         {uploadMutation?.isLoading ? (
                                         <>
                                         <span className="fa fa-spinner mr-2"></span>
                                         processing ....
                                         </>
                                         ) : (
                                         <>
                                         {params?.unit_id ? (
                                               <><span className="fa fa-save mr-2"></span> Update Unit</>
                                               ):(
                                                     
                                         <><span className="bi bi-upload mr-2"></span> Upload Unit</>
                                         )}
                                         </>
                                   )}
                                   
                                   </button> 
                              )}                  
                              <button className="btn btn-sm dark bg-danger ml-2"
                                    onClick={e => {
                                    e.preventDefault();
                                    history.push(`/admin/manage-units`)
                                    clearFields()
                                    }}>
                                    <span className="fa fa-times"></span>
                              </button>
                        </div>
                  </form>  
            </div>
      )
}
