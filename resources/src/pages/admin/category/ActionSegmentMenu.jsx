import React from 'react'
import {useHistory, useParams} from 'react-router-dom'

export default function ActionSegmentMenu({segment}) {
    const history = useHistory();
    const params = useParams();

    return (
        <div style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'row-reverse'}}>
            
            <span className="fa fa-minus-square pointer text-danger"></span>
            <span className="fa fa-pencil-square mr-2 text-success pointer" 
                onClick={ e => {
                    e.preventDefault();
                    history.push(`/admin/category-management/${params?.category_id}/link-segments/${params?.category_slug}/${segment?._id}`)
                }}
            ></span>
        </div>
    )
}
