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
}

export default Header