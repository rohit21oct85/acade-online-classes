import React from 'react'
import {useHistory} from 'react-router-dom'
import usePrincipalLists from '../../../hooks/principals/usePrincipalLists';
import Loading from '../../../components/Loading';
import useAccess from '../../../hooks/useAccess';

export default function AllPrincipals() {

      const {data, isLoading} = usePrincipalLists();
      const history = useHistory();
      const update = useAccess('update');
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
                              <th scope="col">#</th>
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
                              {data?.map( (item,key) => { 
                              return (
                                    <tr key={item?._id}>
                                    <th scope="row">{key}</th>
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
