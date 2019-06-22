import React from 'react'
import { Redirect } from 'react-router-dom'

/**
 * Componente funcional do React, que retorna um 
 * o component charity info (JSX Component) com os valores
 * passados por propriedades.
 * O component Logout realiza o logout do usuario, limpando os 
 * dados armazenados e indo para a pagina inicial
 *
 * @param {*} props propriedades para criação do componente
 * @returns {JSX Component} Componente para ser renderizado
 */
function Logout(props) {
    let reload = false
    if (sessionStorage.getItem('id'))
        reload = true

    sessionStorage.clear()
    
    if (reload)
        window.location.reload()
    
    return (
        !reload &&
        <Redirect to='/'></Redirect>
    )
}

export default Logout