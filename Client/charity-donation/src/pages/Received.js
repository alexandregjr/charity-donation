import React from 'react'
import Item from './components/Item'

function Received(props) {
    return (
        <div>
            <Item />
            <input type='button' value='Confirmar recebimento' itemId='id'/>
        </div>
    )
}

export default Received