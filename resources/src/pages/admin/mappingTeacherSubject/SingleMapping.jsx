import React from 'react'
import ActionMenu from './ActionMenu'

export default function SingleMapping({mapping, key}) {
    return (
        <tr key={mapping?._id}>{console.log(mapping,key)}
            <th scope="row">{key}</th>
            <th scope="row">{mapping?.subject_name}</th>
            <th scope="row" width="20%"><ActionMenu  mapping={mapping}/></th>
        </tr>
    )
}
