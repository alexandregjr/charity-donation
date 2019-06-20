import React from 'react'

function Item(props) {
    return (
        <div>
            <p>Donation#{props.data.id}</p>
            <p>
                <b>{props.data.donor.name}</b>
                doou: 
                <b>{props.data.donation.name}</b> 
                para você
            </p>
            <p>
                <b>{props.data.amount}</b> / {props.data.donation.amount}
            </p>
        </div>
    )
}

export default Item