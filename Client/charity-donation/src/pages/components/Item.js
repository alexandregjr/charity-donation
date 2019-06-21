import React from 'react'

function Item(props) {
    return (
        <div className="item">
            <p className="titulo"><b>Donation#{props.data.id}</b></p>
            <p>
                <b>{props.data.donor.name}</b> doou: <b>{props.data.donation.name}</b> para você.
            </p>
            <p>
                <b>{props.data.amount}</b> / {props.data.donation.amount}
            </p>
        </div>
    )
}

export default Item