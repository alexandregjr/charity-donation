import React from 'react'

function Donation(props) {
    return (
        <div>
            <p>Donation#{props.data.id}</p>
            <p>
                Você doou: 
                <b>{props.data.donation.name}</b> 
                para 
                <b>{props.data.receiver.name}</b>
            </p>
            <p>
                <b>{props.data.amount}</b> / {props.data.donation.amount}
            </p>
        </div>
    )
}

export default Donation


