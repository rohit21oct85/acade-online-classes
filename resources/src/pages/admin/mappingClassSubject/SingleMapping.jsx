import React from 'react'
import ActionMenu from './ActionMenu'

export default function SingleMapping({mapping}) {
    return (
        <tr key={mapping?._id}>
            <th scope="row">{mapping?.subject_name}</th>
            <th scope="row" width="20%"><ActionMenu  mapping={mapping}/></th>
        </tr>
    )
}
