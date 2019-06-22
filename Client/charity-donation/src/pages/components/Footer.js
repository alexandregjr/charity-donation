import React from 'react'

/**
 * Componente funcional do React, que retorna um 
 * o componente footer (JSX Component) com os valores
 * passados por propriedades.
 *
 * @param {*} props propriedades para criação do componente
 * @returns {JSX Component} Componente para ser renderizado
 */
function Footer(props) {
    return (   
        <footer>
            <p>DonationsWeb ~ feito por Alexandre Junior, Eduardo Pirro, Fernando Fayet e Tiago Marino</p>
        </footer>
    )
}

export default Footer