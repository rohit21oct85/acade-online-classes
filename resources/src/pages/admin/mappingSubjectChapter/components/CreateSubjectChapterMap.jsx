import React, {useState, useEffect} from 'react'
import { useHistory, useParams } from 'react-router-dom';
import useClassList from '../../class/hooks/useClassList'
import useUnitList from '../../units/hooks/useUnitList'
import useClassSubjectList from '../../../../hooks/classSubjectMapping/useClassSubjectList';
import useCreateSubjectChapter from '../hooks/useCreateSubjectChapter';
import useUpdateSubjectChapter from '../hooks/useUpdateSubjectChapter';
import useSingleSubjectChapter from '../hooks/useSingleSubjectChapter';
import { useToasts } from 'react-toast-notifications';
import { MakeSlug } from '../../../../utils/utils';

export default function CreateSubjectChapterMap() {
      const params = useParams();
      const history = useHistory();
      const {data} = useClassList();
      const {data:units} = useUnitList();
      const {data:subjects, isLoading: subjectLoading} = useClassSubjectList();
      const { addToast } = useToasts();
      const {data:dataset} = useSingleSubjectChapter();
      const [counter, setCounter] = useState(1);
      const [loading, setLoading] = useState(false);
      const [SingleSubjectChapter, setSingleSubjectChapter] = useState({});

      const addCounter = () => {
            setCounter(counter + 1);
      }

      const initialData = {
            chapter_no: '',
            chapter_name: '',
      }

      const [formData, setFormData] = useState(initialData);

      useEffect(setModule, [dataset]);
      function setModule(){
            setSingleSubjectChapter(dataset)
      }

      const createMutation = useCreateSubjectChapter(formData);
      const updateMutation = useUpdateSubjectChapter(formData);

      async function handleChange(e){
            if(params?.subject_chapter_id){
                  setSingleSubjectChapter({...SingleSubjectChapter, [e.target.name]: e.target.value})
            }else{
                  setFormData({...formData, [e.target.name]: e.target.value})
            }
      }

      const handleChangeV = (e) => {
            const class_name = e.target.options[e.target.selectedIndex].dataset.class_name
            const subject_name = e.target.options[e.target.selectedIndex].dataset.subject_name
            const unit_name = e.target.options[e.target.selectedIndex].dataset.unit_name
            const unit_no = e.target.options[e.target.selectedIndex].dataset.unit_no
            if(class_name != undefined){
                  setFormData({...formData, [e.target.name]: e.target.value, ['class_name']: class_name})
            }else if(subject_name != undefined){
                  setFormData({...formData, [e.target.name]: e.target.value, ['subject_name']: subject_name})
            }else{
                  setFormData({...formData, [e.target.name]: e.target.value, ['unit_name']: unit_name, ['unit_no']: unit_no})   
            }

      }

      const saveChapters = async (e) => {
            e.preventDefault();
            let arrayData = [];
            setLoading(true);
            
            if(params?.subject_chapter_id){
                  for(let i = 0; i< counter; i ++){
                        arrayData.push({
                              class_id:params?.class_id,
                              // class_name: formData.class_name,
                              subject_id:params?.subject_id,
                              // subject_name: formData.subject_name,
                              unit_it:params?.unit_id,
                              chapter_no: SingleSubjectChapter.chapter_no,
                              chapter_name:SingleSubjectChapter.chapter_name,
                        })
                  }
                  await updateMutation.mutate(arrayData);
            }else{
                  for(let i = 0; i< counter; i ++){
                        arrayData.push({
                              class_id:params?.class_id,
                              class_name: params.class_slug,
                              subject_id:params?.subject_id,
                              subject_name: params.subject_slug,
                              unit_no:formData?.unit_no,
                              unit_id:params?.unit_id,
                              unit_name: params.unit_slug,
                              chapter_no: formData[`chapter_no${i}`],
                              chapter_name:formData[`chapter_name${i}`],
                        })
                  }
                  await createMutation.mutate(arrayData);
            }
            setLoading(false);
            clearFields()
      }
      function clearFields(){
            Array.from(document.querySelectorAll('.addedItems')).map(el => {
                  el.value = ''
            })
            setCounter(1)
      }
      return (
            <div>
                  <form onSubmit={saveChapters}>
                        <p className="form-heading">
                        <span className="fa fa-plus-circle mr-2"></span>Add Multiple Chapters</p>
                        <hr className="mt-1"/>
                        <div className="form-group">
                        <select className="form-control"
                        value={params?.class_id}
                        onChange={e => {
                              handleChangeV(e)
                              if(e.target.value === '_'){
                                    history.push(`/admin/mapping-subject-chapters/create`)  
                              }else{
                                    const class_name = e.target.options[e.target.selectedIndex].dataset.class_name
                                    history.push(`/admin/mapping-subject-chapters/create/${e.target.value}/${MakeSlug(class_name)}`)  
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
                                    history.push(`/admin/mapping-subject-chapters/create/${params?.class_id}`)                          
                              }else{
                                    const subject_name = e.target.options[e.target.selectedIndex].dataset.subject_name
                                    history.push(`/admin/mapping-subject-chapters/create/${params?.class_id}/${params?.class_slug}/${e.target.value}/${MakeSlug(subject_name)}`)                          
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
                        <select className="form-control"
                        value={params?.unit_id}
                        onChange={e => {
                              handleChangeV(e)
                              if(e.target.value === '_'){
                                    history.push(`/admin/mapping-subject-chapters/create/${params?.unit_id}`)                          
                              }else{
                                    const unit_name = e.target.options[e.target.selectedIndex].dataset.unit_name
                                    history.push(`/admin/mapping-subject-chapters/create/${params?.class_id}/${params?.class_slug}/${params?.subject_id}/${params?.subject_slug}/${e.target.value}/${MakeSlug(unit_name)}`)                          
                              }
                        }} 
                        >
                              <option value="_">{subjectLoading ? 'loading ...':'Select Unit'}</option>
                              {units?.map( unit => {
                                    return(
                                          <option value={unit?._id} key={unit?._id} data-unit_name={unit?.unit_name} data-unit_no={unit?.unit_no}>{unit?.unit_name}</option>
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
                                    Add New Chapter
                              </button>
                        </div>

                        {[...Array(counter)].map((x, i) =>
                              <div className="flex" key={i}>
                                    <div className="form-group col-md-2 pl-0 pr-0">
                                          <input 
                                                type="text" 
                                                className="form-control addedItems" 
                                                name={params?.subject_chapter_id ? 'chapter_no' : `chapter_no${i}`}
                                                value={params?.subject_chapter_id && SingleSubjectChapter && SingleSubjectChapter.chapter_no}
                                                onChange={handleChange}
                                                placeholder="No"/>
                                    </div>
                                    <div className="form-group col-md-10 pr-0 pl-1">
                                          <input 
                                                type="text" 
                                                className="form-control addedItems" 
                                                name={params?.subject_chapter_id ? 'chapter_name' : `chapter_name${i}`}
                                                value={params?.subject_chapter_id && SingleSubjectChapter && SingleSubjectChapter.chapter_name}
                                                onChange={handleChange}
                                                placeholder="Chapter Name"/>
                                    </div>
                                    <hr/>
                              </div>
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
                                    {params?.subject_chapter_id ? (
                                          <><span className="fa fa-save mr-2"></span> Update Mapping</>
                                          ):(
                                                
                                                <><span className="fa fa-save mr-2"></span> Save Mapping</>
                                    )}
                                    </>
                              )}
                              
                              </button>
                        
                              <button className="btn btn-sm dark bg-danger ml-2"
                                    onClick={e => {
                                    e.preventDefault();
                                    clearFields();
                                    history.push(`/admin/mapping-subject-chapters`)
                                    }}>
                                    <span className="fa fa-times"></span>
                              </button>
                        </div>
                  </form>  
            </div>
      )
}
