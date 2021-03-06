import React,{useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import { romanize } from '../../../utils/helper';

import useModule from '../../../hooks/useModule';
import useAccess from '../../../hooks/useAccess';
import useClassList from '../class/hooks/useClassList';
import useClassSubjectList from '../../../hooks/classSubjectMapping/useClassSubjectList';
import useViewAllQuestions from './hooks/useViewAllQuestions';
import useDeleteQuestion from './hooks/useDeleteQuestion';
import useUnitList from '../units/hooks/useUnitList';
import { export_table_to_csv } from '../../../utils/helper'

export default function ViewAllQuestions() {

    const params = useParams();
    const history = useHistory();
    const accessUrl = useModule();

    useEffect(checkPageAccessControl,[accessUrl]);
    function checkPageAccessControl(){
        if(accessUrl === false){
            history.push('/403');
        }
    }
    const create = useAccess('create');
    const update = useAccess('update');
    const upload = useAccess('upload');
    const Delete = useAccess('delete');
    
    useEffect(manageAccess,[create, update, upload]);
    function manageAccess(){
        if(create === false && update === false){
            history.push(`/admin/question-bank`)
        }
    }

    const {data:sClasses} = useClassList();
    const {data:subjects} = useClassSubjectList();
    const {data:units }   = useUnitList()
    
    const {data:questions} = useViewAllQuestions();
    const [formData, setFormData]    = useState({});

    const deleteMutation = useDeleteQuestion(formData);
    const handleDelteQuestion = async (id) => {
        setFormData({...formData, qbank_id: id});
        await deleteMutation.mutate(formData)
    }
    useEffect(() => {
        const script = document.createElement("script");
        script.id = 'editor';
        script.src = "https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image";
        script.async = true;
        document.body.appendChild(script);
    },[])
    let subData = subjects && subjects?.filter(sub => sub.subject_id === params?.subject_id);
    let classData = sClasses && sClasses?.filter(cla => cla._id === params?.class_id);
    const handleExport = () => {
        var html = document.querySelector("table").outerHTML;
        let file = `${classData && classData[0].class_name}_${subData && subData[0].subject_name}`;
        export_table_to_csv(html, `${file}.csv`);
    }
    let type = params?.type;
    return (
        <div className="col-lg-10 col-md-10 main_dash_area">
            <div className="main-area-all">
                <div className="dashboard_main-container">
                        <div className="dash-main-head">
                            <h2>All Questions</h2>
                        </div>
                    <div className="dash-con-heading">
                        <div className="col-md-12 row"> 
                              <button className="btn btn-sm dark mr-2" onClick={e => { history.push(`/admin/dashboard`)}}>
                                <span className="fa fa-dashboard"></span>
                              </button>
                              <select className="form-control col-md-2 ml-2"
                              value={params?.class_id}
                              onChange={e => {
                                    if(e.target.value === '_'){
                                          history.push(`/admin/view-all-questions`)  
                                    }else{
                                          
                                        history.push(`/admin/view-all-questions/${e.target.value}`)  
                                          
                                    }
                              }}>
                                <option value="_">Class</option>    
                                {sClasses?.map(sClass => {
                                      return(
                                          <option value={sClass?._id}>{sClass?.class_name}</option>
                                      )
                                })}
                              </select>
                              <select className="form-control col-md-2 ml-2"
                              value={params?.subject_id}
                              onChange={e => {
                                    if(e.target.value === '_'){
                                          history.push(`/admin/view-all-questions/${params?.class_id}`)                          
                                    }else{
                                        history.push(`/admin/view-all-questions/${params?.class_id}/${e.target.value}`)                          
                                    }
                              }} >
                                <option value="_">Subject</option>    
                                {subjects?.map(subject => {
                                      return(
                                          <option value={subject?.subject_id}>{subject?.subject_name}</option>
                                      )
                                })}
                              </select>
                              {params?.subject_id && (
                                <button className="btn btn-sm bg-success text-white ml-2"
                                onClick={ () => {
                                    
                                    history.push(`/admin/view-all-questions/${params?.class_id}/${params?.subject_id}/${type === 'Units' ? 'Chapters': 'Units'}`)
                                }}>{type === 'Units' ? 'Chapters': 'Units'} Wise Report</button>
                              )}
                              {params?.subject_id && (
                                  <button className="ml-2 btn btn-sm bg-warning pull-right"
                                  onClick={handleExport}>
                                      <span className="bi bi-download mr-2"></span>
                                      Download {type} Report
                                  </button>
                              )}
                        </div>
                    </div>
                    <div className="clearfix"></div>
                    <div className="dash-cont-start">
                        <div className="row">

                            <table className="table table-bordered col-md-12 flex" 
                            id="printDiv"
                            style={{ 
                                height: '500px', overflow: 'hidden scroll',
                                flexWrap: 'wrap'
                            }}>

                                <tr className="header flex col-md-12 ml-2 mr-2 pt-1 table-bordered">
                                    <td className="col-md-1">Sr.</td> 
                                    <td className="col-md-10">{type} Name</td>
                                    <td className="col-md-2">
                                        Total
                                    </td>
                                </tr>
                                {questions?.length > 0 && units?.map((unit, ind) => {
                                    let ULists = questions?.filter(que => que?.unit_id === unit?._id);
                                    let total = ULists.map(q => {
                                        return q.total_question
                                    })
                                    let total_questions = total.length > 0 && total.reduce((a,b) => a+b)
                                    return (
                                        <>
                                        {params?.type === 'Units' && (
                                        <tr className="flex col-md-12 ml-2 mr-2 pt-1 table-bordered">
                                            <td className="col-md-1 pl-0"><b>{unit?.unit_no}</b></td> 
                                            <td className="col-md-10"><b>{unit?.unit_name?.replaceAll(',',' ')}</b></td>
                                            <td className="col-md-2">
                                                <b>{total_questions}</b>
                                            </td>
                                        </tr>
                                        )}
                                        {params?.type === 'Chapters' && ULists?.map( q => {
                                            return(
                                                <tr className="flex col-md-12 ml-2 mr-2 pt-1 table-bordered" key={q?._id}>
                                                    <td className="col-md-1 pl-2">
                                                        {q?.chapter_no}
                                                    </td>
                                                    <td className="col-md-10">
                                                        {q?.chapter_name?.replaceAll(',',' ')}
                                                    </td>
                                                    <td className="col-md-2">
                                                        {q?.total_question}
                                                    </td>
                                                
                                                </tr>
        
                                            )
                                        })}
                                        </>
                                    )
                                })}
                                
                            </table>

                        </div>
                    </div>    
                </div>
            </div>
        </div>
    )
}
