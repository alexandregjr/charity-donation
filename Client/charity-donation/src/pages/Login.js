import React, { Component } from 'react'
import ResponseType from '../connection/ResponseType'
import Connection from '../connection/Connection'
import CryptoJS from 'crypto-js'
import {Redirect} from 'react-router-dom'

class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            errorMessage: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    login() {
        if (this.socket.readyState !== this.socket.OPEN) 
            setTimeout(this.login, 10)

        const { username, password } = this.state
        if (username && password) {
            const hashPass = CryptoJS.MD5(password)
            const user = {
                username: username,
                password: hashPass.toString()
            }

            const msg = {
                type: ResponseType.LOGIN,
                message: JSON.stringify(user)
            }

            this.socket.send(JSON.stringify(msg))
        } else {
            this.setState({
                error: true,
                errorMessage: 'Insira o nome e a senha'
            })
        }
    }
    
    handleSubmit(event) {
        event.preventDefault()
        this.login()
    } 

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
            error: false
        })
    }

    logged(id, type) {
        sessionStorage.setItem('id', id)
        sessionStorage.setItem('type', type.toUpperCase())   
        window.location.reload()     
    }

    loginError(error) {
        this.setState({
            errorMessage: error, 
            error: true
        })
    }

    setupSocket() {
        this.socket = Connection
        
        this.socket.onmessage = (r) => {
            const response = JSON.parse(r.data)
            console.log(response)
            switch (response.type) {
                case ResponseType.SUCCESS:
                    this.logged(response.id, response.message)
                    break
                case ResponseType.FAIL:
                    this.loginError(response.message)
                    break
                default:
                    this.setState({
                        errorMessage: 'Erro: Indefinido.',
                        error: true
                    })
            }
        }        
    }

    componentDidMount() {
        this.setupSocket()
    }

    render() {
        return (
            sessionStorage.getItem('id') ?
            <Redirect to='/'></Redirect> :
            <div className={'content login'}>
                <h2>Logar</h2>
                {this.state.error &&
                <p className={'error'}>{this.state.errorMessage}</p>}
                <form name='login' onSubmit={this.handleSubmit}>
                    <input onChange={this.handleChange} name='username' type='text' placeholder='Username'></input>
                    <input onChange={this.handleChange} name='password' type='password' placeholder='Senha'></input>
                    <input type='submit' value='Entrar'></input>
                </form>
            </div>
        )
    }
}

export default Login