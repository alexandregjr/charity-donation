import React from 'react'
import {Link} from 'react-router-dom'

function Header(props) {
    return (
        <div>
            <h1>Doacoes</h1>
            <ul>
                <li><Link to='/'>Home</Link></li>
                <li><Link to='/donations'>Doações Feitas</Link></li>
                <li><Link to='/received'>Itens Recebidos</Link></li>
                <li><Link to='/login'>Entrar</Link></li>
                <li><Link to='/register'>Registrar</Link></li>
                <li><Link to='/edit'>Editar</Link></li>
            </ul>
        </div>
    )
}

export default Header