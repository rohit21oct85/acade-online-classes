import React from 'react'
import {useHistory, useParams} from 'react-router-dom'
import usePrincipalLists from '../hooks/usePrincipalLists';
import Loading from '../../../../components/Loading';
import useAccess from '../../../../hooks/useAccess';
import useSchoolLists from '../../school/hooks/useSchoolLists';

export default function AllPrincipals() {
      const {data, isLoading} = usePrincipalLists();
      const {data: schools} = useSchoolLists();
      const params = useParams();
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
            <div className="row col-md-12">
            <div className="form-group col-md-3 pl-0">
                    <select 
                        className="form-control" aria-label="Default select example" 
                        name="school_id" 
                        onChange={(e) => {
                              history.push(`/admin/principal-management/view/${e.target.value}`)
                        }} 
                        value={params.school_id ? params.school_id : 999}>
                        <option value="999">Select School</option>
                        {schools?.map(school => {
                        return (
                            <option value={school._id} key={school._id}>{school.school_name}</option>
                        )
                        })}
                    </select>
                </div> 
            </div>
            <div className="col-md-12 row" style={{ height: 'auto !important',maxHeight: '400px', overflow: 'scroll'}}>
                  <table className="table table-hover">
                        <thead>
                              <tr>
                              <th scope="col" className="hidden_col">School Name</th>
                              <th scope="col">Name</th>
                              <th scope="col">Email</th>
                              {update === true && <th scope="col" className="hidden_col">Action</th>}
                              </tr>
                        </thead>
                        <tbody>
                              {isLoading && (<Loading isLoading={isLoading}/>)}
                              {data?.map((item,key) => { 
                              const school_name = getSchoolData(item?.school_id, 'name');      
                              return (
                                    <tr key={item?._id}>
                                    <td className="hidden_col">{school_name}</td>
                                    <td>{item.name}</td>
                                    <td>{item.email}</td>
                                    
                                    {update === true && 
                                          <>
                                          <td className="hidden_col">
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
