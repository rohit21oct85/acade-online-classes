import React from 'react'
import { useParams } from 'react-router';
import Loading from '../../../components/Loading';
import useClassSubjectList from '../../../hooks/classSubjectMapping/useClassSubjectList';
import SingleMapping from './SingleMapping';

export default function AllTeacherClassMapping() {
    const {data, isLoading} = useClassSubjectList();
    const params = useParams();
    return (
        <>
            <p className="form-heading">
                <span className="fa fa-plus-circle mr-2"></span>Mappings
                <span className="badge-danger br-5 ml-2 p-1"
                style={{
                    fontSize: '0.90rem'
                }}>
                    {params?.class_slug?.replaceAll('-'," ")}</span>
            </p>
            <hr className="mt-1"/>
                {isLoading && (<Loading isLoading={isLoading}/>)}
            <div className="col-md-12 row no-gutter data-container">
                <table className="table table-hover">
                    <thead>
                        <tr>
                        <th scope="col">Class</th>
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
