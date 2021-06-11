import React from 'react'
import { useParams } from 'react-router';
import Loading from '../../../components/Loading';
import useTeacherClassList from '../../../hooks/teacherClassMapping/useTeacherClassList';
import SingleMapping from './SingleMapping';

export default function AllTeacherClassMapping() {
    const {data, isLoading} = useTeacherClassList();
    const params = useParams();
    return (
        <>
            <p className="form-heading">
                <span className="fa fa-plus-circle mr-2"></span>Mappings
                <span className="dark bg-success br-15 pl-3 pr-3 ml-2"
                style={{
                    fontSize: '0.90rem'
                }}>
                    {params?.school_slug?.replaceAll('-'," ")}</span>
                <span className="dark bg-success br-15 pl-3 pr-3 ml-2"
                style={{
                    fontSize: '0.90rem'
                }}>
                    {params?.teacher_slug?.replaceAll('-'," ")}</span>
            </p>
            <hr className="mt-1"/>
                {isLoading && (<Loading isLoading={isLoading}/>)}
            <div className="col-md-12 row no-gutter data-container">
                <table className="table table-hover">
                    <thead>
                        <tr>
                        <th scope="col">Class Name</th>
                        <th scope="col">School</th>
                        <th scope="col">Teacher Name</th>
                        <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {data?.map( mapping => { 
                        return (
                            <SingleMapping mapping={mapping} key={mapping?._id}/>
                        )
                    })}   
                    </tbody>
                </table>       
            </div>
        </>
    )
}
