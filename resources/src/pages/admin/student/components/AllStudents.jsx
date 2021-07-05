import useStudentList from '../hooks/useStudentList';
import useSchoolLists from '../../school/hooks/useSchoolLists';
import Loading from '../../../../components/Loading';
import {useHistory, useParams} from 'react-router-dom'
import React from 'react'
import useDeleteStudent from '../hooks/useDeleteStudent';
import * as helper from '../../../../utils/helper'


export default function AllStudents({update, Delete}) {
    const history = useHistory();
    const params = useParams();
    
    const {data, isLoading} = useStudentList();
    const {data:schools} = useSchoolLists();
    const school = schools?.filter( school => school?._id == params?.school_id)


    const deleteMutation = useDeleteStudent();

    const deleteStudent = async (id) => {
        await deleteMutation.mutate(id)
    }

    return (
        <>
        <p>
            <span className="fa fa-plus-circle mr-2"></span> All Students
            <span className="dark bg-success br-15 pl-3 pr-3 ml-2">{school && school[0]?.school_name}</span>
        </p>
        <hr className="mt-0"/>
        <Loading isLoading={isLoading} /> 
        <div className="col-md-12 row no-gutter data-container-category">
        <table className="table table-hover">
                    <thead>
                        <tr>
                        <th scope="col">#EmpId</th>
                        {/* <th scope="col">School Name</th> */}
                        <th scope="col">Name</th>
                        <th scope="col">Class</th>
                        <th scope="col">Section</th>
                        <th scope="col">Roll No</th>
                        <th scope="col">Mobile</th>
                        <th scope="col">Email</th>

                        <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map( (item,key) => { 
                            // let school_name = helper.getFilteredData(schools,'_id', item?.school_id, 'school_name')
                            return (
                                <tr key={item?._id}>
                                <th scope="row">{(item?.EmpId)}</th>
                                
                                <td>{item.name}</td>
                                <td>{item.class}</td>
                                <td>{item.section}</td>
                                <td>{item.roll_no}</td>
                                <td>{item.mobile}</td>
                                <td>{item.email}</td>
                                <td>
                                    {update === true && (
                                        <button className="btn bg-primary text-white btn-sm mr-2" 
                                            onClick={
                                                e => {
                                                        history.push(`/admin/students-management/update/${item.school_id}/${item.class_id}/${item?._id}`)
                                                }
                                            }>
                                            <span className="fa fa-edit"></span>
                                        </button>
                                    )}
                                    {Delete === true && (
                                        <button className="btn bg-danger text-white btn-sm"
                                            onClick={() => deleteStudent(item?._id)}>
                                            {deleteMutation?.isLoading ?
                                            <span className="fa fa-spinner"></span>
                                            :
                                            <span className="fa fa-trash"></span>
                                            }    
                                        </button>
                                    )}
                                </td>
                                </tr>
                            )
                        })}      
                </tbody>
            </table>   
        </div>
    </>
    )
}
