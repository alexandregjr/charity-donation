import React, { Component } from 'react'
import ResponseType from '../connection/ResponseType'
import Connection from '../connection/Connection'
import CryptoJS from 'crypto-js'
import {Redirect} from 'react-router-dom'

/**
 * Componente do React criado utilizando classes para
 * que possa ter acesso a estados. Possui metodos para 
 * renderizar e buscar dados no servidor.
 * O componente Login representa uma pagina de login.
 *
 * @class Login
 * @extends {Component}
 */
class Login extends Component {
    /**
     * Cria uma instancia de Login, que é um JSX Component
     * 
     * @param {*} props propriedades passadas para o objeto
     * @memberof Login
     */
    constructor(props) {
        super(props)

        this.state = {
            errorMessage: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    /**
     * Envia um request de login para o servidor, ou muda o 
     * estado para mostrar um erro, caso user ou senha sejam 
     * invalidos
     *
     * @memberof Login
     */
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

    /**
     * Utilizado para gerenciar as submissoes dos 
     * formularios da pagina, realizando a chamada 
     * de login
     *
     * @param {*} event evento de submissao no form
     * @memberof Login
     */
    handleSubmit(event) {
        event.preventDefault()
        this.login()
    } 

    /**
     * Utilizado para gerenciar as alteracoes nos 
     * formularios da pagina, guardando os valores no
     * estado
     *
     * @param {*} event evento de mudanca no form
     * @memberof Login
     */
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
            error: false
        })
    }

    /**
     * Armazena os dados do usuario no armazenamento
     * local.
     *
     * @param {*} id id do usuario logado
     * @param {*} type tipo do usuario logado (charity ou person)
     * @memberof Login
     */
    logged(id, type) {
        sessionStorage.setItem('id', id)
        sessionStorage.setItem('type', type.toUpperCase())   
        window.location.reload()     
    }

    /**
     * Muda o estado da pagina para mostrar um erro
     * que ocorra ao realizar login.
     *
     * @param {*} error mensagem de error
     * @memberof Login
     */
    loginError(error) {
        this.setState({
            errorMessage: error, 
            error: true
        })
    }

    /**
     * Realiza a configuracao do WebSocket (conexao Client-Server)
     * para realizar a comunicacao e receber os dados 
     *
     * @memberof Login
     */
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

    /**
     * Metodo built-in da classe Component que é
     * chamado sempre que o componente é montado
     *
     * @memberof Login
     */
    componentDidMount() {
        this.setupSocket()
    }

    /**
     * Metodo built-in do component react que retorna o componente JSX
     * a ser renderizado na tela.
     * Uma tela com campos de login e senha para realizar o login do 
     * usuario.
     *
     * @returns JSX Component
     * @memberof Login
     */
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