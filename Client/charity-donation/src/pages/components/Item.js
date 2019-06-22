import React from 'react'

/**
 * Componente funcional do React, que retorna um 
 * o componente Item (JSX Component) com os valores
 * passados por propriedades.
 * O Item é um item de doacao que pode mostrar tanto o
 * doador, quanto o destinatário do objeto doado.
 * Para mostrar o doador o props.type deve ser 'received';
 * para mostrar o destinatário, deve ser 'made'
 *
 * @param {*} props propriedades para criação do componente
 * @returns {JSX Component} Componente para ser renderizado
 */
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