import React from 'react'
import {Link} from 'react-router-dom'

function Header(props) {
    return (
        <div>
            <h1>Doacoes</h1>
            <ul>
                <li><Link to='/'>Home</Link></li>
                <li><Link to='/donations'>Minhas Doações</Link></li>
                <li><Link to='/'>Minhas Necessidades</Link></li>
                <li><Link to='/login'>Entrar</Link></li>
                <li><Link to='/register'>Registrar</Link></li>
            </ul>
        </div>
    )
}

export default Header