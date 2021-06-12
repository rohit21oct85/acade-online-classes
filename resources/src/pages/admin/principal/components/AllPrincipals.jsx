import React from 'react'
import {useHistory} from 'react-router-dom'
import usePrincipalLists from '../hooks/usePrincipalLists';
import Loading from '../../../../components/Loading';
import useAccess from '../../../../hooks/useAccess';
import useSchoolLists from '../../school/hooks/useSchoolLists';

export default function AllPrincipals() {
      const {data, isLoading} = usePrincipalLists();
      const {data: schools} = useSchoolLists();
      console.log(schools);
      const history = useHistory();
      const update = useAccess('update');
      function getSchoolData(school_id, field){
            const schoolData = schools?.filter(school => school?._id == school_id);
            if(field == 'name'){
                  return schoolData && schoolData[0]?.school_name
            }else if(field == 'logo'){
                  return schoolData && schoolData[0]?.school_logo
            }
      }
      return (
            <>
            <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>Add New Principal</p>
            <hr className="mt-1"/>
            {isLoading && (<Loading isLoading={isLoading}/>)}
            <div className="col-md-12 row" style={{ height: 'auto !important',maxHeight: '400px', overflow: 'scroll'}}>
                  <table className="table table-hover">
                        <thead>
                              <tr>
                              <th scope="col">School Name</th>
                              <th scope="col">Name</th>
                              <th scope="col">Email</th>
                              <th scope="col">Address</th>
                              <th scope="col">City</th>
                              <th scope="col">State</th>
                              <th scope="col">Pincode</th>
                              {update === true && <th scope="col">Action</th>}
                              </tr>
                        </thead>
                        <tbody>
                              {data?.map((item,key) => { 
                              const school_name = getSchoolData(item?.school_id, 'name');      
                              return (
                                    <tr key={item?._id}>
                                    <td>{school_name}</td>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    <td>{item.address}</td>
                                    <td>{item.city}</td>
                                    <td>{item.state}</td>
                                    <td>{item.pincode}</td>
                                    
                                    {update === true && 
                                          <>
                                          <td>
                                          <button className="btn bg-primary text-white btn-sm mr-2" 
                                          onClick={
                                                e => {
                                                      history.push(`/admin/principal-management/update/${item.school_id}/${item?._id}`)
                                                }
                                          }>
                                          <span className="fa fa-edit"></span>
                                          </button>
                                          </td>
                                          </>
                                    }
                  
                                    </tr>
                              )
                              })}      
                        </tbody>
                  </table>
            </div>
      </>
      )
}
