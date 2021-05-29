import React from 'react'
import {useHistory} from 'react-router-dom'

export default function ActionMenu({module}) {
    const history = useHistory();
    return (
        <div style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'row-reverse'}}>
            <span className="fa fa-pencil-square mr-2 text-success pointer" 
                onClick={ e => {
                    e.preventDefault();
                    history.push(`/admin/app-module/${module?._id}`)
                }}
            ></span>
            <span className="fa fa-eye mr-2 pointer text-danger"
            onClick={ e => history.push(`/admin/${module?.module_slug}`)}
            ></span>
        </div>
    )
}
