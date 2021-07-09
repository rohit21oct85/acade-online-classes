import useTeacherList from '../hooks/useTeacherList';
import useSchoolLists from '../../school/hooks/useSchoolLists';
import Loading from '../../../../components/Loading';
import {useHistory, useParams} from 'react-router-dom'
import {useMutation, useQueryClient} from 'react-query'
import {AuthContext} from '../../../../context/AuthContext';
import { useToasts } from 'react-toast-notifications';
import React, {useState, useContext} from 'react'
import useDeleteTeacher from '../hooks/useDeleteTeacher';
import useSubjectList from '../../subject/hooks/useSubjectList';
import { MakeSlug } from '../../../../utils/utils'

export default function AllTeachers({update, Delete}) {

    const history = useHistory();

    const { addToast } = useToasts();

    const {state} = useContext(AuthContext);

    const params = useParams();
    
    const queryClient = useQueryClient()

    const {data, isLoading} = useTeacherList();
    const {data:schools, schoolIsLoading} = useSchoolLists();
    const {data: subjects} = useSubjectList();
    const school = schools?.filter( school => school?._id == params?.school_id)

    const options = {
        headers: {
            'Content-Type': 'Application/json',
            'Authorization':'Bearer '+state.access_token
        }
    }

    const deleteMutation = useDeleteTeacher();

    const deleteTeacher = async (id) => {
        await deleteMutation.mutate(id)
    }

    function getSchoolName(arr, id){
        if(data?.length > 0 && !isLoading){
            let dataSchool = arr?.filter(el => el?._id === id);
            return dataSchool && dataSchool[0]?.school_name;
        }else{
            return '';
        }
    }

    return (
        <>
        <p className="form-heading">
            <span className="fa fa-plus-circle mr-2"></span>{ (params?.school_id !== '999' && school && school[0]?.school_name) ?? 'All teachers'}</p>
        <hr className="mt-1"/>
        <div className="row col-md-12">
        <div className="form-group col-md-3 pl-0">
            <select className="form-control" aria-label="Default select example" 
                name="school_id" 
                onChange={(e) => {
                    history.push(`/admin/teachers-management/view/${e.target.value}`)
                }} 
                value={params.school_id ? params.school_id : 999}>
                <option value="999">Select School</option>
                {!isLoading && schools?.map(school => {
                return (
                    <option value={school._id} key={school._id}>{school.school_name}</option>
                )
                })}
            </select>
        </div>
        <div className="form-group col-md-3 pl-0">
            <select className="form-control" aria-label="Default select example" 
                name="school_id" 
                onChange={(e) => {
                    if(e.target.value != 999){
                        history.push(`/admin/teachers-management/view/${params?.school_id}/${e.target.value}`)
                    }
                }} 
                value={params.subject_id ? params.subject_id : 999}>
                <option value="999">Select Subject</option>
                <option value="all">All</option>
                {!isLoading && subjects?.map(subject => {
                return (
                    <option value={subject._id} key={subject._id}>{subject.subject_name}</option>
                )
                })}
            </select>
        </div>
        </div>
        
        <div className="col-md-12 row no-gutter data-container-category">
        <table className="table table-hover">
                    <thead>
                        <tr>
                        <th scope="col">#EmpID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Subject</th>
                        <th scope="col" className="hidden_col">Class</th>
                        <th scope="col" className="hidden_col">Mobile</th>
                        <th scope="col">Email</th>
                        <th scope="col" className="hidden_col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    <Loading isLoading={isLoading} /> 
                        {data?.map( (item,key) => {
                            let tclass = '';
                            
                            tclass = Array.prototype.map.call(item?.classess, function(items) { if(items.checked === true){return items.class_name+', '} });
                            
                            return (
                                <tr key={item?._id}>
                                <th scope="row">{item.EmpID}</th>
                                <td>{item.name}</td>
                                <td>{item.subject_name}</td>
                                <td className="hidden_col">{tclass}</td>
                                <td className="hidden_col">{item.mobile}</td>
                                <td>{item.username}</td>
                                <td className="hidden_col">
                                    {update && (
                                        <button className="btn bg-primary text-white btn-sm mr-2" 
                                            onClick={
                                                e => {
                                                    if(params.school_id){
                                                        history.push(`/admin/teachers-management/update/${params?.school_id}/${params?.subject_id}/${MakeSlug(item.subject_name)}/${item?._id}`)
                                                    }else{
                                                        history.push(`/admin/teachers-management/update/${item.school_id}/${item?.subject_id}/${MakeSlug(item.subject_name)}/${item?._id}`)
                                                    }
                                                }
                                            }>
                                            <span className="fa fa-edit"></span>
                                        </button>
                                    )}
                                    <button className="btn bg-danger text-white btn-sm"
                                        onClick={() => deleteTeacher(item?._id)}>
                                        <span className="fa fa-trash"></span>
                                    </button>
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
