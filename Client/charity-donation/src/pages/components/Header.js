import React from 'react'
import {Link} from 'react-router-dom'

function Header(props) {
    return (
        <div className="header">
            <h1 className="logo">Doações do Polo<img></img></h1>
            <ul className="tabs">
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
