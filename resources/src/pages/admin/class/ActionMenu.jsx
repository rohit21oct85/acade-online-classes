import React from 'react'
import {useHistory} from 'react-router-dom'

export default function ActionMenu({item}) {
    const history = useHistory();
    return (
        <div style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'row-reverse'}}>
            
            <span className="fa fa-minus-square pointer text-danger"></span>
            <span className="fa fa-pencil-square mr-2 text-success pointer" 
                onClick={ e => {
                    e.preventDefault();
                    history.push(`/admin/class-management/${item?._id}`)
                }}
            ></span>

            <span className={`fa ${item?.segment_uploaded === false ? 'fa-link text-danger': 'fa-eye text-success'} mr-2 pointer `}
            title={`${item?.segment_uploaded === false ? 'Link Segments': 'View Segments'}`}
            onClick={ e => history.push(`/admin/class-management/${item?._id}/link-segments/${item?.item_slug}`)}
            ></span>
        </div>
    )
}
