import React from 'react'
import {useHistory} from 'react-router-dom'
import useSchoolLists from '../../../hooks/useSchoolLists';
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

            {!isLoading && data?.map(school => {
                  return (
                  <div 
                  key={school?._id}
                  className="lg-card mb-2" 
                  style={{ display: 'flex',justifyContent: 'space-between'}}>
                        <div className="row">
                              <div className="col-md-3 pl-2 pr-3">
                                    <img src={school?.logo} style={{ width: '120px'}}/>  
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
                              <div className="col-md-12 pl-0 pr-0">
                                    <hr />
                                    <div className="flex pl-3 pr-3">
                                          <button className="btn pl-2 pr-2 bg-success text-white br-15"
                                          onClick={
                                                e => {
                                                      history.push(`/admin/school-management/modify-school/${school?._id}`)
                                                }
                                          }>
                                                <span className="fa fa-pencil mr-2"></span>
                                                Modify School
                                          </button>
                                          
                                          <button className="btn bg-danger text-white br-10">
                                                <span className="fa fa-trash mr-2"></span>
                                                Delete School
                                          </button>

                                    </div>
                              </div>
                        </div>
                       
                        
                  </div>
                  )
            })}
            
            </>
      )
}
