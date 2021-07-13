import React, { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import useClassList from '../../class/hooks/useClassList'
import useClassSubjectList from '../../../../hooks/classSubjectMapping/useClassSubjectList';
import { useState } from 'react';
import useUnitList from '../../units/hooks/useUnitList';
import { getFilteredData } from '../../../../utils/helper';
import useCreateQuestion from '../hooks/useCreateQuestion';
import useSingleQuestion from '../hooks/useSingleQuestion';
import {romanize} from '../../../../utils/helper';
import useSubjectChapterList from '../../mappingSubjectChapter/hooks/useSubjectChapterList';
import useUpdateQuestion from '../hooks/useUpdateQuestion';
import useUploadQuestion from '../hooks/useUploadQuestion';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-classic-with-mathtype';
import { useToasts } from 'react-toast-notifications';

export default function CreateQuestionBank() {
      
      const params = useParams();
      const history = useHistory();
      const { addToast } = useToasts();
      const {data:classDatas} = useClassList();
      const {data:subjects, isLoading: subjectLoading} = useClassSubjectList();
      const {data:units, isLoading: unitLoading} = useUnitList();
      const {data:chapters, isLoading: chapterLoading} = useSubjectChapterList();
      const {data:chapter, isLoading: questionLoading} = useSingleQuestion();
      const [formData, setFormData] = useState({});
      const [singleChapter, setSingleChapter] = useState({});
      const [btnDisabled, setBtnDisbaled] = useState(true)
      console.log(chapter);
      // useEffect(() => {
      //       setSingleChapter(chapter);
      // },[params?.qbank_id]);

      useEffect(() => {
            const script = document.createElement("script");
            script.id = 'editor';
            script.src = "https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image";
            script.async = true;
            document.body.appendChild(script);
            
      },[params?.qbank_id,params?.subject_id, params?.class_id, params?.chapter_id, params?.unit_id]);
      let options;
      let optionsDocx;
      
      if(params?.qbank_id && chapter?.extension == 'docx'){
            options = chapter && chapter?.options
            optionsDocx = [{key: 0,value: " A"},{key: 1,value: " B"},{key: 3,value: " C"},{key: 4,value: " D"}];
      }else{
            options = [
                  {key: 'option_a', value: 'Option A'},
                  {key: 'option_b', value: 'Option B'},
                  {key: 'option_c', value: 'Option C'},
                  {key: 'option_d', value: 'Option D'},
            ]
            optionsDocx = [
                  {key: 'option_a', value: 'Option A'},
                  {key: 'option_b', value: 'Option B'},
                  {key: 'option_c', value: 'Option C'},
                  {key: 'option_d', value: 'Option D'},
            ]
      }
      
      const formDataUpload = new FormData();
      const [extension, setExtension] = useState('');
      const [file, setFile] = useState('');
      
      const createMutation = useCreateQuestion(formData);
      const updateMutation = useUpdateQuestion(formData);
      const uploadMutation = useUploadQuestion(formDataUpload);

      async function handleSubmit(e){
            e.preventDefault();
            let qbank_id = params?.qbank_id
            
            let class_id = params?.class_id
            let subject_id = params?.subject_id
            let unit_id = params?.unit_id
            let chapter_id = params?.chapter_id
      
            let class_name = getFilteredData(classDatas,'_id' ,class_id, 'class_name');
            let subject_name = getFilteredData(subjects,'subject_id' , subject_id, 'subject_name');
            let unit_no = getFilteredData(units,'_id' , unit_id, 'unit_no');
            let unit_name = getFilteredData(units,'_id' , unit_id, 'unit_name');
            let chapter_no = getFilteredData(chapters,'_id' , chapter_id, 'chapter_no');
            let chapter_name = getFilteredData(chapters,'_id' , chapter_id, 'chapter_name');
            
            formData.class_id = class_id
            formData.class_name = class_name
            formData.subject_id = subject_id
            formData.subject_name = subject_name
            formData.unit_id = unit_id
            formData.unit_no = unit_no
            formData.unit_name = unit_name
            formData.chapter_id = chapter_id
            formData.chapter_no = chapter_no
            formData.chapter_name = chapter_name
            let QuestionStem;
            let desQuestionStem;
            if(params?.qbank_id){
                  QuestionStem = chapter['question'];   
            }else{
                  QuestionStem = formData['question'];  
            }
            if(QuestionStem.includes("*")){
                  desQuestionStem = QuestionStem.split('*').join("<br/>");
              }else{
                  desQuestionStem = formData['question'];
              }
            
            
            formData['question'] = desQuestionStem
            console.log(formData);
            // return;
            if(qbank_id){
                  await updateMutation.mutate(formData);
            }else{
                  await createMutation.mutate(formData);
            }
      }

      let docs = '';
      async function handelChangeUpload(e){
            const filename = e.target.files[0].name;
            console.log('file onchange ' ,  filename);
            const ext = filename.split('.')[1];
            
            setExtension(ext);
            if(ext === "docx"){
                setBtnDisbaled(false);
                setFile(e.target.files[0]);
                formDataUpload.append('file', e.target.files[0]);
            }else{
                setBtnDisbaled(true);
                addToast('Only .docx files are allowed', { appearance: 'error', autoDismiss: true });
            }
      }
      
      async function handleFileUpload(e){
            e.preventDefault();
            let class_id = params?.class_id
            let subject_id = params?.subject_id
            let unit_id = params?.unit_id
            let chapter_id = params?.chapter_id
            if(class_id && subject_id && unit_id && chapter_id){
                  let class_name = getFilteredData(classDatas,'_id' ,class_id, 'class_name');
                  let subject_name = getFilteredData(subjects,'subject_id' , subject_id, 'subject_name');
                  let unit_no = getFilteredData(units,'_id' , unit_id, 'unit_no');
                  let unit_name = getFilteredData(units,'_id' , unit_id, 'unit_name');
                  let chapter_no = getFilteredData(chapters,'_id' , chapter_id, 'chapter_no');
                  let chapter_name = getFilteredData(chapters,'_id' , chapter_id, 'chapter_name');

                  formDataUpload.append('file',file);
                  formDataUpload.append('class_id',class_id);
                  formDataUpload.append('class_name',class_name);
                  formDataUpload.append('subject_id',subject_id);
                  formDataUpload.append('subject_name',subject_name);
                  formDataUpload.append('unit_id',unit_id);
                  formDataUpload.append('unit_no',unit_no);
                  formDataUpload.append('unit_name',unit_name);
                  formDataUpload.append('chapter_id',chapter_id);
                  formDataUpload.append('chapter_no',chapter_no);
                  formDataUpload.append('chapter_name',chapter_name);
                  formDataUpload.append('extension',extension);
                  await uploadMutation.mutate(formDataUpload);
            }else{
                  addToast('Please select class, subject, unit and chapter fields to upload question', { appearance: 'error', autoDismiss: true }); 
            }
            
            
      }
      
      return (
            <div>
                 <p className="form-heading">
                  <span className="fa fa-plus-circle mr-2"></span>Add New Question
                  </p>
                  <hr className="mt-1"/>
                  <div className="row">
                  <div className="form-group col-md-3">
                  <select className="form-control"
                  value={params?.class_id}
                  onChange={e => {
                        if(e.target.value === '_'){
                              history.push(`/admin/question-bank/create`)  
                        }else{
                              if(params?.qbank_id){
                                    history.push(`/admin/question-bank/create/${e.target.value}`)  
                              }
                              else{

                                    history.push(`/admin/question-bank/${params?.page_type}/${e.target.value}`)  
                              }
                        }
                  }}>
                        <option value="_">Classes</option>
                        {classDatas?.map(classess => {
                              return(
                                    <option value={classess?._id} key={classess?._id}>{classess?.class_name} th </option>       
                              )
                        })}
                  </select>
                  </div>
                  <div className="form-group col-md-3 pl-0">
                  <select className="form-control"
                  value={params?.subject_id}
                  onChange={e => {
                        if(e.target.value === '_'){
                              history.push(`/admin/question-bank/create/${params?.class_id}`)                          
                        }else{
                              if(params?.qbank_id){
                                    history.push(`/admin/question-bank/create/${params?.class_id}/${e.target.value}`)                          
                              }else{

                                    history.push(`/admin/question-bank/${params?.page_type}/${params?.class_id}/${e.target.value}`)                          
                              }
                        }
                  }} 
                  >
                        <option value="_">{subjectLoading ? 'loading ...':'Subjects'}</option>
                        {subjects?.map( subject => {
                              return(
                                    <option value={subject?.subject_id} key={subject?.subject_id}>{subject?.subject_name}</option>
                              )
                        })}
                  </select>
                  </div>
                  <div className="form-group col-md-3 pl-0">
                  <select className="form-control"
                  value={params?.unit_id}
                  onChange={e => {
                        if(e.target.value === '_'){
                              history.push(`/admin/question-bank/create/${params?.class_id}/${params?.subject_id}`)                          
                        }else{
                              if(params?.qbank_id){
                                    history.push(`/admin/question-bank/create/${params?.class_id}/${params?.subject_id}/${e.target.value}`)                          
                              }else{

                                    history.push(`/admin/question-bank/${params?.page_type}/${params?.class_id}/${params?.subject_id}/${e.target.value}`)                          
                              }
                        }
                  }} 
                  >
                        <option value="_">{unitLoading ? 'loading ...':'Units'}</option>
                        {units?.map( unit => {
                              return(
                                    <option value={unit?._id} key={unit?._id}>{romanize(unit?.unit_no)}-{unit?.unit_name}</option>
                              )
                        })}
                  </select>
                  </div>
                  <div className="form-group col-md-3">
                  <select className="form-control"
                  value={params?.chapter_id}
                  onChange={e => {
                        if(e.target.value === '_'){
                              history.push(`/admin/question-bank/${params?.page_type}/${params?.class_id}/${params?.subject_id}/${params?.unit_id}`)                          
                        }else{
                              if(params?.qbank_id){
                                    history.push(`/admin/question-bank/create/${params?.class_id}/${params?.subject_id}/${params?.unit_id}/${e.target.value}`)                          
                              }else{
                                    history.push(`/admin/question-bank/${params?.page_type}/${params?.class_id}/${params?.subject_id}/${params?.unit_id}/${e.target.value}`)                          
                              }
                        }
                  }} 
                  >
                        <option value="_">{chapterLoading ? 'loading ...':'Chapters'}</option>
                        {chapters?.map( chapter => {
                              return(
                                    <option value={chapter?._id} key={chapter?._id}>{chapter?.chapter_no}-{chapter?.chapter_name}</option>
                              )
                        })}
                  </select>
                  </div>
                  </div>
            {(params?.page_type === 'create' || params?.page_type === 'update') && (
                          
            <form method="POST" encType="multipart/formData">
                  <div className="form-group">
                  <label>Add Questions and Options </label>
                  <hr className="mt-0 mb-1"/>
                  <div className="pr-2" style={{ height: '350px', overflowY: 'scroll', overflowX: 'hidden'}}>
                  <div className="form-group">
                        <label>Question: </label>
                        
                        <CKEditor
                              id="editor"
                              editor={ ClassicEditor }
                              config={{
                              toolbar: {
                                    items: [
                                    'MathType', 'ChemType','heading', 
                                    '|',
                                    'fontSize',
                                    'bold',
                                    'italic',
                                    'link',
                                    'bulletedList',
                                    'numberedList',
                                    'imageUpload',
                                    'mediaEmbed',
                                    'insertTable',
                                    'blockQuote',
                                    'undo',
                                    'redo'
                                    ]
                              },
                              }}
                              data={chapter && chapter?.question}
                              onChange={ ( event, editor ) => {
                              const data = editor.getData();
                              setFormData( { ...formData, question : data } );
                              } }
                        />
                  
                        
                  </div>      
                  <div className="row">
                  {!questionLoading && chapter && chapter?.extension == 'docx' && options?.map( (option,index) => {
                  let option_answer;  
                  let option_name;    
                  if(index === 0){
                        option_answer = chapter && chapter?.option_a
                        option_name = 'option A'
                  }
                  else if(index === 1){
                        option_answer = chapter && chapter?.option_b
                        option_name = 'option B'
                  }      
                  else if(index === 2){
                        option_answer = chapter && chapter?.option_c
                        option_name = 'option C'
                  }      
                  else if(index === 3){
                        option_answer = chapter && chapter?.option_d
                        option_name = 'option D'
                  }      
                  return(
                  <div className="form-group col-md-6" key={`option-${index}`}>
                        <label>{option_name ?? option?.value}: </label>
                              <CKEditor
                              editor={ ClassicEditor }
                              config={{
                              toolbar: {
                                    items: [
                                    'MathType', 'ChemType','heading', 
                                    '|',
                                    'fontSize',
                                    'bold',
                                    'italic',
                                    'link',
                                    'bulletedList',
                                    'numberedList',
                                    'imageUpload',
                                    'mediaEmbed',
                                    'insertTable',
                                    'blockQuote',
                                    'undo',
                                    'redo'
                                    ]
                              },
                              }}
                              data={`&nbsp; ${option}`}
                              onChange={ ( event, editor ) => {
                              const data = editor.getData();
                              setFormData( { ...formData, [option?.key] : data } );
                              } }
                        />
                  </div>
                  )})}
                  </div>
                  <div className="form-group">
                              <select className="form-control"
                              onChange={e => {
                              setFormData( { ...formData, answer : e.target.value } );
                              }}
                              >
                                    <option value="">Correct Answer</option>
                                    {optionsDocx?.map( (option, index) => {
                                    return(
                                    <option value={option?.key}
                                    selected={chapter?.answer == option?.value ? 'selected':''}
                                    >{`${option?.value}`}</option>
                                    )})}
                              </select>
                  </div>
                  <div className="form-group">
                        <label>Solution: </label>
                        <CKEditor
                              editor={ ClassicEditor }
                              config={{
                              toolbar: {
                              items: [
                                    'MathType', 'ChemType','heading', 
                                    '|',
                                    'bold',
                                    'italic',
                                    'link',
                                    'bulletedList',
                                    'numberedList',
                                    'imageUpload',
                                    'mediaEmbed',
                                    'insertTable',
                                    'blockQuote',
                                    'undo',
                                    'redo'
                              ]
                              },
                              }}
                              data={chapter && chapter?.solution}
                              onChange={ ( event, editor ) => {
                              const data = editor.getData();
                              setFormData( { ...formData, solution: data } );
                              } }
                        />
                  </div> 
                  </div>
                  </div>
                  
                                          
                  <div className="form-group mt-2">
                        <button className="btn btn-sm dark"
                        disabled={(createMutation?.isLoading || updateMutation?.isLoading)}
                        onClick={handleSubmit}>
                        {(createMutation?.isLoading || updateMutation?.isLoading) 
                        ?
                        <><span className="bi bi-spinner mr-2"></span>
                        Processing...</>
                        :
                        <>
                        <span className="bi bi-save mr-2"></span>
                        {params?.qbank_id ? 'Update Question': 'Save Question'}
                        </>      
                        }
                        </button>
                        <button>
                              <span></span> Cancel  
                        </button>
                  </div>

            </form>  
            )}    
            {params?.page_type === 'upload' && (
                 <> 
                <form encType="multipart/form-data">
                  <label>Upload Questions and Options </label>
                  <hr className="mt-1 mb-2"/>
                  <div className="form-group">
                        <label>Choose Question File</label>
                        <input type="file" name="file" onChange={handelChangeUpload} className="form-control"/>
                  </div>
                  
                  

                  <div className="form-group mt-2">
                        <button className="btn btn-sm dark"
                        disabled={btnDisabled}
                        onClick={handleFileUpload}>
                              {createMutation?.isLoading ? (
                                    <>
                                    <span className="bi bi-spinner mr-2"></span>
                                    processing...
                                    </>
                              ) : (
                                    <>
                                    <span className="bi bi-upload mr-2"></span>
                                    Upload Question
                                    </>
                              )}
                              
                        </button>
                  </div>
                </form>  

                <hr />
                </>
            )}

            </div>
      )
}
