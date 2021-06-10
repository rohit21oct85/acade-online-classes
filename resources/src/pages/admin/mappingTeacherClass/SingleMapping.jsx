import React from 'react'
import ActionMenu from './ActionMenu'

export default function SingleMapping({mapping}) {
    return (
        <tr key={mapping?._id}>
            <th scope="row">{mapping?.class_name} th </th>
            <th scope="row">{mapping?.school_name}</th>
            <th scope="row">{mapping?.teacher_name}</th>
            <th scope="row"><ActionMenu  mapping={mapping}/></th>
        </tr>
    )
}
