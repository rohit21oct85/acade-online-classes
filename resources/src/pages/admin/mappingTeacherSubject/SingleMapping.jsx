import React from 'react'
import ActionMenu from './ActionMenu'

export default function SingleMapping({mapping, key}) {
    return (
        <tr key={mapping?._id}>
            <th scope="row">{mapping?.school_name}</th>
            <th scope="row">{mapping?.teacher_name}</th>
            <th scope="row">{mapping?.subject_name}</th>
            <th scope="row" width="20%"><ActionMenu  mapping={mapping}/></th>
        </tr>
    )
}
