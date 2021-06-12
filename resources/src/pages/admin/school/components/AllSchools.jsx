import React from 'react'
import {useHistory, NavLink, Link} from 'react-router-dom'
import useSchoolLists from '../hooks/useSchoolLists';
import Loading from '../../../../components/Loading';

export default function AllSchools({update}) {

      const {data, isLoading} = useSchoolLists();
      const history = useHistory();
      
      return (
            <>
            <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>Add New School</p>
            <hr className="mt-1"/>
            {isLoading && (<Loading isLoading={isLoading}/>)}
            <div className="col-md-12 row" style={{ height: 'auto !important',maxHeight: '380px', overflowY: 'scroll'}}>
            {!isLoading && data?.map(school => {
                  return (
                  <div 
                        key={school?._id}
                        className="card mb-2 pl-3 pr-2 col-md-12 no-gutter" 
                        
                  >
                        <div className="row">
                              <div className="col-md-2 pl-2 pt-2">
                                    <img 
                                          src={`https://drive.google.com/uc?export=view&id=${school?.school_logo}`} style={{ height:'100px'}}
                                          className="img-responsive"
                                    />  
                              </div>
                              <div className="col-md-9 pr-4 pl-3">   
                                    <div className="flex">
                                          <div className="admin-name"> 
                                                <div className="name-label mr-3">
                                                      School Name: 
                                                </div>
                                                <div className="name-main">
                                                      {school?.school_name}
                                                </div>
                                          </div>
                                          <div className="name-main">
                                                {school?.school_name}
                                          </div>
                                    </div>
                                    <div className="admin-name"> 
                                          <div className="name-label">
                                                Pincode: 
                                          </div>
                                          <div className="name-main">
                                                {school?.pincode}
                                          </div>
                                    </div>
                                    
                                    <div className="admin-name"> 
                                          <div className="name-label">
                                                Contact Email: 
                                          </div>
                                          <div className="name-main text-lower">
                                                {school?.contact_email}
                                          </div>
                                    </div>
                                    <div className="admin-name"> 
                                          <div className="name-label">
                                                Contact Mobile: 
                                          </div>
                                          <div className="name-main">
                                                {school?.contact_mobile}
                                          </div>
                                    </div>

                              </div>
                              <div className="col-md-12 pl-0 pr-0 pb-2">
                                    <hr className="mb-1"/>
                                    {update === true && (<div className="pl-2 pr-2">
                                          <span className="fa fa-pencil text-warning mr-2 pointer" 
                                          onClick={e => {
                                                history.push(`/admin/school-management/update/${school?._id}`)
                                          }}></span>
                                          
                                    </div>)}
                              </div>
                        </div>
                       
                        
                  </div>
                  )
            })}
            </div>
            </>
      )
}
