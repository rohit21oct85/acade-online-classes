import React,{useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import { romanize, getDateValue } from '../../../utils/helper';

import useModule from '../../../hooks/useModule';
import useAccess from '../../../hooks/useAccess';
import useClassList from '../class/hooks/useClassList';
import useClassSubjectList from '../../../hooks/classSubjectMapping/useClassSubjectList';
import useDeleteUnitTest from './hooks/useDeleteUnitTest';
import useUnitList from '../units/hooks/useUnitList';
import useUnitTestList from './hooks/useUnitTestList';
import useAssignedTestList from '../assignTest/hooks/useAssignedTestList';

export default function ViewAllTest() {

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
    const {data:unitTests} = useUnitTestList();
    
    const [formData, setFormData]    = useState({});

    const deleteMutation = useDeleteUnitTest(formData);
    const handleDelteQuestion = async (id) => {
        setFormData({...formData, qbank_id: id});
        await deleteMutation.mutate(formData)
    }
    const {data: testLists, isLoading} = useAssignedTestList();
      function checkAssigned(test_id){
            if(!isLoading && testLists != 'undefined'){
                  return testLists?.some(test => test?.test_id == test_id);
            }
      }
    useEffect(() => {
        const script = document.createElement("script");
        script.id = 'editor';
        script.src = "https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image";
        script.async = true;
        document.body.appendChild(script);
    },[])
    return (
        <div className="col-lg-10 col-md-10 main_dash_area">
            <div className="main-area-all">
                <div className="dashboard_main-container">
                        <div className="dash-main-head">
                            <h2>All Unit Tests</h2>
                        </div>
                    <div className="dash-con-heading">
                        <div className="col-md-12 row"> 
                              <button className="btn btn-sm dark mr-2" onClick={e => { history.push(`/admin/dashboard`)}}>
                                <span className="fa fa-dashboard"></span>
                              </button>
                              
                                <select className="form-control col-md-2"
                                value={params?.test_type}
                                onChange={e => {
                                    history.push(`/admin/view-all-test/${e.target.value}`)
                                    document.getElementById("class").selectedIndex = '0'
                                }}>
                                    <option value="">Test Type</option>
                                    <option value="combine-test">Combined Test</option>
                                    <option value="single-test">Single Test</option>
                                </select>
                  
                              <select className="form-control col-md-2 ml-2"
                              id="class"
                              value={params?.class_id}
                              onChange={e => {
                                    if(e.target.value === '_'){
                                          history.push(`/admin/view-all-test`)  
                                    }else{
                                          
                                        history.push(`/admin/view-all-test/${params?.test_type}/${e.target.value}`)  
                                          
                                    }
                              }}>
                                <option value="_">Class</option>    
                                {sClasses?.map(sClass => {
                                      return(
                                          <option value={sClass?._id}>{sClass?.class_name} Th</option>
                                      )
                                })}
                              </select>
                              
                        </div>
                    </div>
                    <div className="clearfix"></div>
                    <div className="dash-cont-start">
                        <div className="row">
                            <div className="col-md-12" style={{ 
                                height: '500px', overflow: 'hidden scroll'
                            }}>
                                <div className="col-md-12 row table-bordered ml-2 mr-2">
                                    <div className="col-md-2 mt-2 mb-2 pl-0"><b>Test Name</b></div>
                                    <div className="col-md-1 mt-2 mb-2 pl-0"><b>Question</b></div>
                                    <div className="col-md-1 mt-2 mb-2 pl-0"><b>Duration</b></div>
                                    <div className="col-md-2 mt-2 mb-2 pl-0"><b>Test Type</b></div>
                                    <div className="col-md-2 mt-2 mb-2 pl-0"><b>Test Subject</b></div>
                                    
                                    
                                </div>    
                                {unitTests?.map(unit => {
                                    
                                    let subjects = '';
                                    if(unit?.test_type === 'combine-test'){
                                        subjects = Array.prototype.map.call(unit?.test_subjects, function(item) { return item.subject_name; }).join(",");
                                    }else{
                                        subjects = unit?.subject_name
                                    }
                                    return (
                                        <div className="col-md-12 row table-bordered ml-2 mr-2 pt-0 pb-0">
                                          <div className="col-md-2 mt-1 mb-1 pl-0"><b>{unit?.test_name}</b></div>
                                          <div className="col-md-1 mt-1 mb-1 pl-0"><b>{unit?.total_question}</b></div>
                                          <div className="col-md-1 mt-1 mb-1 pl-0"><b>{unit?.test_duration} Min</b></div>
                                          <div className="col-md-2 mt-1 mb-1 pl-0"><b>{unit?.test_type === 'combine-test' ? 'combine-test': 'single-test'}</b></div>
                                          <div className="col-md-2 mt-1 mb-1 pl-0"><b>{subjects}</b></div>
                                        </div>
                                    )
                                })}
                                
                            </div>

                        </div>
                    </div>    
                </div>
            </div>
        </div>
    )
}
