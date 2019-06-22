import React from 'react'

/**
 * Componente funcional do React, que retorna um 
 * o componente Needs (JSX Component) com os valores
 * passados por propriedades.
 * O Needs é um objeto que é usado para criar uma lista dos 
 * valores passados por props.
 *
 * @param {*} props propriedades para criação do componente
 * @returns {JSX Component} Componente para ser renderizado
 */
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