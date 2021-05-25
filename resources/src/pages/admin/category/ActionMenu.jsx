import React from 'react'
import {useHistory} from 'react-router-dom'

export default function ActionMenu({category}) {
    const history = useHistory();
    return (
        <div style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'row-reverse'}}>
            
            <span className="fa fa-minus-square pointer text-danger"></span>
            <span className="fa fa-pencil-square mr-2 text-success pointer" 
                onClick={ e => {
                    e.preventDefault();
                    history.push(`/admin/category-management/${category?._id}`)
                }}
            ></span>

            <span className={`fa ${category?.segment_uploaded === false ? 'fa-link text-danger': 'fa-eye text-success'} mr-2 pointer `}
            title={`${category?.segment_uploaded === false ? 'Link Segments': 'View Segments'}`}
            onClick={ e => history.push(`/admin/category-management/${category?._id}/link-segments/${category?.category_slug}`)}
            ></span>
        </div>
    )
}
