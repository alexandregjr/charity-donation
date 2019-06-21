import React from 'react'

function Needs(props) {
    let { needs } = props.data
    if (!needs) needs = []

    const list = needs.map((need, index) => 
        <li key={index}><b>{need.name}</b> ({need.amount})</li>
    )
    
    return (
        <div className={'needs'}>
            <ul>
                {list}
            </ul>
        </div>
    )
}

export default Needs