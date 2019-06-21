import React from 'react'

function Needs(props) {
    let { needs } = props.data
    if (!needs) needs = []

    const list = needs.map((need, index) => 
        <li key={index}>{need.name} - {need.amount}</li>
    )
    
    return (
        <div>
            <ul>
                {list}
            </ul>
        </div>
    )
}

export default Needs