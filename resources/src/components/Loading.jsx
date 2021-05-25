import React from 'react'

export default function Loading({isLoading}) {
    return (
        <div>
           {isLoading && (
                <div 
                    className="spinner-border" 
                    style={{width: '16px', height:'16px'}} 
                    role="status"> 
                    <span className="sr-only">Loading...</span> 
                </div>
            )} 
        </div>
    )
}

