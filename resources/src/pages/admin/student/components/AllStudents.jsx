import useStudentList from '../hooks/useStudentList';
import useSchoolLists from '../../school/hooks/useSchoolLists';
import Loading from '../../../../components/Loading';
import {useHistory, useParams} from 'react-router-dom'
import React, { useEffect } from 'react'
import useDeleteStudent from '../hooks/useDeleteStudent';
import * as helper from '../../../../utils/helper'
import useClassList from '../../class/hooks/useClassList';
import { useState } from 'react';
import useUpdateStudent from '../hooks/useUpdateStudent';


export default function AllStudents({update, Delete}) {
    const history = useHistory();
    const params = useParams();
    const sections = ["A","B","C","D","E","F"]
    const {data, isLoading} = useStudentList();
    const {data:schools} = useSchoolLists();
    const {data : classes } = useClassList();

    const school = schools?.filter( school => school?._id == params?.school_id)
    

    const deleteMutation = useDeleteStudent();
    const updateMutation = useUpdateStudent()
    const deleteStudent = async (id) => {
        await deleteMutation.mutate(id)
    }
    async function handleActiveInactive(status, id){
        // alert(status); return;
        history.push(`/admin/students-management/view/${params?.school_id}/${params?.class_id}/${params?.section}/${id}`)
        setTimeout(async () => {
            await updateMutation.mutate({
                isActive: (status === undefined || status === false) ? true: false
            })
        }, 1000);
    
    }
    const filerDataByEmpID = () => {
        const trs = document.querySelectorAll('#myTable tr:not(.header)');
        const filter = document.querySelector('#empInput').value;
        const regex = new RegExp(filter, 'i');
        const isFoundInTds = (td) => regex.test(td.innerHTML);
        const isFound = (childrenArr) => childrenArr.some(isFoundInTds);
        const setTrStyleDisplay = ({ style, children }) => {
          style.display = isFound([...children]) ? '' : 'none';
        };
        setTimeout(() => {
            trs.forEach(setTrStyleDisplay);
        }, 1000);
      };
      
    const filerDataByEmpName = () => {
        const trs = document.querySelectorAll('#myTable tr:not(.header)');
        const filter = document.querySelector('#nameInput').value;
        const regex = new RegExp(filter, 'i');
        const isFoundInTds = (td) => regex.test(td.innerHTML);
        const isFound = (childrenArr) => childrenArr.some(isFoundInTds);
        const setTrStyleDisplay = ({ style, children }) => {
          style.display = isFound([...children]) ? '' : 'none';
        };
        setTimeout(() => {
            trs.forEach(setTrStyleDisplay);
        }, 1000);
      };

    return (
        <>
        <p>
            <span className="fa fa-plus-circle mr-2"></span> All Students
            <span className="dark bg-success br-15 pl-3 pr-3 ml-2">School Name: {school && school[0]?.school_name}</span>
            <span className="dark bg-success br-15 pl-3 pr-3 ml-2">Total Student: {data?.length}</span>
        </p>
        
        <div className="row col-md-12 mt-3">
        <div className="form-group col-md-3 pl-0">
            <select 
                className="form-control " aria-label="Default select example" 
                name="school_id" 
                onChange={(e) => {
                    history.push(`/admin/students-management/view/${e.target.value}`)
                }} 
                value={params.school_id ? params.school_id : 999}>
                <option value="999">Select School Name</option>
                {schools?.map(school => {
                return (
                    <option value={school._id} key={school._id}>{school.school_name}</option>
                )
                })}
            </select>
        </div>
        <div className="form-group col-md-2 pl-0">
            <select className="form-control " aria-label="Default select example" 
                    name="class_id" 
                    onChange={(e) => {
                        history.push(`/admin/students-management/view/${params?.school_id}/${e.target.value}`)
                    }} value={params.class_id}>
                <option>Select Class</option>
                {classes?.map(sclass => {
                return (
                    <option value={sclass._id} key={sclass._id}>{sclass.class_name} Th</option>
                )
                })}
            </select>
        </div>
        
        <div className="form-group col-md-2 pl-0">
            <select className="form-control " 
                    name="section" 
                    value={params?.section}
                    onChange={(e) => {
                        history.push(`/admin/students-management/view/${params?.school_id}/${params?.class_id}/${e.target.value}`)
                    }}>
                    <option value="">Select Section</option>
                    {sections?.map((sec,ind) => {
                    return (
                        <option value={sec}key={ind}>{sec}</option>
                    )
                    })}
            </select>
        </div>
        <div  className="form-group col-md-2 pl-0">
        <input 
            type="text" 
            className="form-control"
            id="empInput" 
            onKeyUp={filerDataByEmpID} 
            placeholder="Filter By Empid.." 
            title="Type in a name" />
        </div>
        
        <div  className="form-group col-md-2 pl-0">
        <input 
            type="text" 
            className="form-control"
            id="nameInput" 
            onKeyUp={filerDataByEmpName} 
            placeholder="Filter By name.." 
            autoComplete="nope"
            title="Type in a name" />
        </div>


        </div>
        <div className="col-md-12 mt-3 table-responsive row no-gutter data-container-category" style={{"overflowX":"scroll"}}>
        
        <table className="table table-hover" id="myTable" style={{ width: '1500px'}}>
                    <thead>
                    <tr class="header">
                            <th>
                             #EmpID
                            </th>
                            <th>Login Email</th>
                            <th>Name</th>
                            <th>Class</th>
                            <th>Sec.</th>
                            <th>Division</th>
                            <th>Roll</th>
                            <th className="hidden_col">Mobile</th>
                            <th>Email</th>
                            <th className="hidden_col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <Loading isLoading={isLoading} /> 
                        {!isLoading && data?.map( (item,key) => { 
                            return (
                                <tr key={item?._id} >
                                <th scope="row">{(item?.EmpId)}</th>
                                <td>{item?.username.toLowerCase()}</td>
                                <td>{item.name}</td>
                                <td>{item.class}</td>
                                <td>{item.section}</td>
                                <td>{item.school_section ?? item.section}</td>
                                <td>{item.roll_no}</td>
                                <td className="hidden_col">{item.mobile}</td>
                                <td>{item?.email.toLowerCase()}</td>
                                <td className="flex hidden_col">

                                    {update === true && (
                                       <> 
                                        <button className={`btn dark ${item?.isActive ? 'bg-success': 'bg-danger'} text-white btn-sm mr-2`} 
                                            onClick={() => handleActiveInactive(item?.isActive, item?._id)}>
                                            {item?.isActive ? <span className="fa fa-check" title="Make Inactive"></span> : <span className="fa fa-times" title="Make Inactive"></span>}
                                            

                                        </button>
                                        
                                        <button className="btn bg-primary text-white btn-sm mr-2" 
                                            onClick={
                                                e => {
                                                        history.push(`/admin/students-management/update/${item.school_id}/${item.class_id}/${item?.section}/${item?._id}`)
                                                }
                                            }>
                                            <span className="fa fa-edit"></span>
                                        </button>
                                       </>
                                    )}
                                    {Delete === true && (
                                        <button className="btn bg-danger text-white btn-sm" id="csvDownload"
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
