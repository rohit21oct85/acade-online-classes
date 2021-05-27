import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import useSchoolAdminLists from '../../../hooks/schools_admin/useSchoolAdminLists';
import Loading from '../../../components/Loading';
import useSchoolLists from '../../../hooks/schools/useSchoolLists';

export default function AllSchoolAdminLists() {
      const {data, isLoading} = useSchoolAdminLists();
      const {data:schools } = useSchoolLists()
      const history = useHistory();
      const [schoolAdmins, setSchoolsAdmin] = useState([]);
      useEffect(manipulateSchools, [data]);
      async function manipulateSchools(){
            await data && data.map(async schoolAdmin => {
                  schoolAdmin['school_name'] = await getSchoolName(schoolAdmin?.school_id);
                  setSchoolsAdmin(schoolAdmins => [...schoolAdmins, schoolAdmin]);
            })
            return data;
      }
      async function getSchoolName(school_id){
            const schoolData = schools?.filter(school => school?._id === school_id);
            return schoolData && schoolData[0]?.name
      }
      
      return (
            <>
            <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>School Admins</p>
            <hr className="mt-1"/>
            {isLoading && (<Loading isLoading={isLoading}/>)}
            <div className="col-md-12 row" style={{ height: 'auto !important',maxHeight: '400px', overflow: 'scroll'}}>
            {!isLoading && schoolAdmins?.map(school => {
                  return (
                  <div 
                        key={school?._id}
                        className="card mb-2 pl-3 pr-3 col-md-6 no-gutter" 
                        style={{ display: 'flex',justifyContent: 'space-between'}}
                  >
                        <div className="row">
                              <div className="col-md-12 pr-3 pl-3">   
                                    <div className="admin-name"> 
                                          <div className="name-label">
                                                School Name: 
                                          </div>
                                          <div className="name-main">
                                                {school?.school_name}
                                          </div>
                                    </div>
                                    <div className="admin-name"> 
                                          <div className="name-label">
                                                First Name: 
                                          </div>
                                          <div className="name-main">
                                                {school?.first_name}
                                          </div>
                                    </div>
                                    <div className="admin-name"> 
                                          <div className="name-label">
                                                Last Name: 
                                          </div>
                                          <div className="name-main">
                                                {school?.last_name}
                                          </div>
                                    </div>
                                    
                                    <div className="admin-name"> 
                                          <div className="name-label">
                                                Admin Email: 
                                          </div>
                                          <div className="name-main text-lower">
                                                {school?.email}
                                          </div>
                                    </div>
                                   
                              </div>
                              <div className="col-md-12 pl-0 pr-0 pb-2">
                                    <hr className="mb-1"/>
                                    <div className="pl-2 pr-2">
                                          <span className="fa fa-pencil text-warning mr-2 pointer" 
                                          onClick={e => {
                                                history.push(`/admin/auth-management/modify-admin/${school?.school_id}/${school?.email}/${school?._id}`)
                                          }}></span>
                                          
                                    </div>
                              </div>
                        </div>
                       
                        
                  </div>
                  )
            })}
            </div>
            </>
      )
}
