import React, { Component } from 'react'
import {Link} from 'react-router-dom'

class Header extends Component {
    constructor(props) {
        super(props)
        console.log(this.props)
    }

    render() {
        
        const type = sessionStorage.getItem('type')
        const id = sessionStorage.getItem('id')

        return (
            <div >
                <h1>Doacoes</h1>
                <ul>
                    <li><Link to='/'>Home</Link></li>

                    {!id &&
                    <li><Link to='/login'>Entrar</Link></li>}
                    {!id &&
                    <li><Link to='/register'>Registrar</Link></li>}

                    {id && type === 'CHARITY' &&
                    <li><Link to='/received'>Itens Recebidos</Link></li>}
                    {id && type === 'CHARITY' &&
                    <li><Link to='/edit'>Editar</Link></li>}

                    {id &&
                    <li><Link to='/donations'>Doações Feitas</Link></li>}
                    {id &&
                    <li><Link to='/logout'>Logout</Link></li>}
                </ul>
            </div>
        )
    }
}

export default Header