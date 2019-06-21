import React from 'react'

function Item(props) {
    return (
        <div className={'item'}>
            <h3>Donation#{props.data.id}</h3>
            <hr></hr>
            {props.type === 'received' &&
            <p>
                Doador: <b>{props.data.donor.name}</b> 
            </p>}
            {props.type === 'made' &&
            <p>
                Destinatário: <b>{props.data.receiver.name}</b> 
            </p>}
            <p>
                Doação: <b> {props.data.donation.name}</b>
            </p>
            <p>
                Quantidade: <b>{props.data.amount}</b>
            </p>
        </div>
    )
}

export default Item