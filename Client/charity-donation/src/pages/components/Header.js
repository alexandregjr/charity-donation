import React from 'react'
import {Link} from 'react-router-dom'

/**
 * Componente funcional do React, que retorna um 
 * o componente Header (JSX Component) com os valores
 * passados por propriedades.
 * O Header possui o titulo da pagina e a NavBar.
 *
 * @param {*} props propriedades para criação do componente
 * @returns {JSX Component} Componente para ser renderizado
 */
function Header(props) {
    const type = sessionStorage.getItem('type')
    const id = sessionStorage.getItem('id')

    return (
        <header>
            <h1>DonationWeb</h1>
            <ul>
                <Link to='/'>Home</Link>

                {!id &&
                <Link to='/login'>Entrar</Link>}
                {!id &&
                <Link to='/register'>Registrar</Link>}

                {id && type === 'CHARITY' &&
                <Link to='/received'>Itens Recebidos</Link>}
                {id && type === 'CHARITY' &&
                <Link to='/edit'>Editar</Link>}

                {id &&
                <Link to='/donations'>Doações Feitas</Link>}
                {id &&
                <Link to='/logout'>Logout</Link>}
            </ul>
        </header>
    )
    
}

export default Header