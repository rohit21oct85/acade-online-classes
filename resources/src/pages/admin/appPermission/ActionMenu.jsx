import React from 'react'
import {useHistory} from 'react-router-dom'

export default function ActionMenu({permission}) {
    const history = useHistory();
    return (
        <div style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'row-reverse'}}>
            <button className="btn btn-sm dark">
            <span className="fa fa-trash"></span>
            </button>
        </div>
    )
}
