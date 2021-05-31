import React from 'react'
import {useHistory, NavLink, Link} from 'react-router-dom'
import useSchoolLists from '../../../hooks/schools/useSchoolLists';
import Loading from '../../../components/Loading';

export default function AllSchools() {

      const {data, isLoading} = useSchoolLists();
      const history = useHistory();
      
      return (
            <>
            <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>Add New School</p>
            <hr className="mt-1"/>
            {isLoading && (<Loading isLoading={isLoading}/>)}
            <div className="col-md-12 row" style={{ height: 'auto !important',maxHeight: '400px', overflow: 'scroll'}}>
            {!isLoading && data?.map(school => {
                  return (
                  <div 
                        key={school?._id}
                        className="card mb-2 pl-3 pr-3 col-md-6 no-gutter" 
                        style={{ display: 'flex',justifyContent: 'space-between'}}
                  >
                        <div className="row">
                              <div className="col-md-3 pl-2 pt-2">
                                    <img 
                                          src={`https://drive.google.com/uc?export=view&id=${school?.logo}`} style={{ width: '90px', height:'90px'}}
                                          className="img-responsive"
                                    />  
                              </div>
                              <div className="col-md-9 pr-3 pl-3">   
                                    <div className="admin-name"> 
                                          <div className="name-label">
                                                School Name: 
                                          </div>
                                          <div className="name-main">
                                                {school?.name}
                                          </div>
                                    </div>
                                    <div className="admin-name"> 
                                          <div className="name-label">
                                                School Domain: 
                                          </div>
                                          <div className="name-main">
                                                <a href={`http://www.${school?.domain}.com`} target="__blank">
                                                {school?.domain}
                                                </a>   
                                          </div>
                                    </div>
                                    <div className="admin-name"> 
                                          <div className="name-label">
                                                Zipcode: 
                                          </div>
                                          <div className="name-main">
                                                {school?.zip_code}
                                          </div>
                                    </div>
                                    
                                    <div className="admin-name"> 
                                          <div className="name-label">
                                                Admin Email: 
                                          </div>
                                          <div className="name-main text-lower">
                                                {school?.admin_email}
                                          </div>
                                    </div>
                                    <div className="admin-name"> 
                                          <div className="name-label">
                                                Admin Mobile: 
                                          </div>
                                          <div className="name-main">
                                                {school?.admin_mobile}
                                          </div>
                                    </div>
                              </div>
                              <div className="col-md-12 pl-0 pr-0 pb-2">
                                    <hr className="mb-1"/>
                                    <div className="pl-2 pr-2">
                                          <span className="fa fa-pencil text-warning mr-2 pointer" 
                                          onClick={e => {
                                                history.push(`/admin/school-management/modify-school/${school?._id}`)
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
