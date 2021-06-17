import React,{useEffect} from 'react'
import {useHistory, useParams} from 'react-router-dom'

import CreateSubjectChapterMap from './components/CreateSubjectChapterMap';
// import UploadQuestions from './components/UploadUnits';
import AllSubjectChapterMapping from './components/AllSubjectChapterMapping';

import useModule from '../../../hooks/useModule';
import useAccess from '../../../hooks/useAccess';

export default function SubjectChapterList() {
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
        if(create === false || update === false || upload === false){
            history.push(`/admin/mapping-subject-chapters`)
        }
    }

    return (
        <div className="col-lg-10 col-md-10 main_dash_area">
            <div className="main-area-all">
                <div className="dashboard_main-container">
                        <div className="dash-main-head">
                            <h2>All Mapping</h2>
                        </div>
                    <div className="dash-con-heading">
                        <div className="col-md-12 row"> 
                        
                            <button className="btn btn-sm dark mr-2" onClick={e => { history.push(`/admin/dashboard`)}}>
                                <span className="fa fa-dashboard"></span>
                            </button>
                            {create && (
                                <button className="btn btn-sm dark mr-2" 
                                onClick={ e => {
                                    if(params?.class_id !== undefined && params?.subject_id !== undefined){
                                        history.push(`/admin/mapping-subject-chapters/create/${params?.class_id}/${params?.class_slug}/${params?.subject_id}/${params?.subject_slug}`)
                                    }else{
                                        history.push(`/admin/mapping-subject-chapters/create`)
                                    }
                                    
                                }}>
                                    <span className="fa fa-plus mr-2"></span>Create Mapping 
                                </button>
                            )}
                            
                            {upload && (
                                <button className="btn btn-sm dark mr-2" 
                                onClick={ e => {
                                    if(params?.class_id !== undefined && params?.subject_id !== undefined){
                                        history.push(`/admin/mapping-subject-chapters/upload/${params?.class_id}/${params?.class_slug}/${params?.subject_id}/${params?.subject_slug}`)
                                    }else{
                                        history.push(`/admin/mapping-subject-chapters/upload`)
                                    }
                                    
                                }}>
                                    <span className="fa fa-upload mr-2"></span>Upload Mapping 
                                </button>
                            )}

                            
                        </div>
                    </div>
                    <div className="clearfix"></div>
                    <div className="dash-cont-start">
                        <div className="row">
                            <div className="col-md-4">
                                { (create === true || update === true )  &&  (params.page_type === 'create' ||params.page_type === 'update' || params?.page_type === 'upload') && <CreateSubjectChapterMap />  }
                            </div>
                            
                            <div className={`${(params?.page_type === 'create' || params?.page_type === 'update' || params?.page_type === 'upload') ? 'col-md-8':'col-md-12'}`}>
                                <AllSubjectChapterMapping update={update} Delete={Delete}/>
                            </div>

                        </div>
                    </div>    
                </div>
            </div>
        </div>
    )
}
