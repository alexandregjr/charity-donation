import React, { Component } from 'react'
import CryptoJS from 'crypto-js'
import ResponseType from '../connection/ResponseType'
import Connection from '../connection/Connection'
import { Redirect } from 'react-router-dom'

/**
 * Componente do React criado utilizando classes para
 * que possa ter acesso a estados. Possui metodos para 
 * renderizar e buscar dados no servidor.
 * O componente Register representa uma pagina de registro.
 *
 * @class Register
 * @extends {Component}
 */
class Register extends Component {
    /**
     * Cria uma instancia de Register, que é um JSX Component
     * 
     * @param {*} props propriedades passadas para o objeto
     * @memberof Register
     */
    constructor(props) {
        super(props)

        this.state = {
            type: 'PERSON'
        }

        this.handleClick = this.handleClick.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.registerCharity = this.registerCharity.bind(this)
        this.registerPerson = this.registerPerson.bind(this)
        this.login = this.login.bind(this)
        this.setError = this.setError.bind(this)
        this.logged = this.logged.bind(this)
    }

    /**
     * Verifica se um cpf é valido, olhando para 
     * os digitos de verificacao.
     *
     * @param {*} cpf string contendo o cpf (somente numeros)
     * @returns true se valido
     * @memberof Register
     */
    cpfTest(cpf) {
        let sum = 0;

        if (!cpf || cpf === "00000000000" || cpf === '11111111111' || cpf === '22222222222'
        || cpf === "33333333333" || cpf === "44444444444" || cpf === "55555555555" 
        || cpf === "66666666666" || cpf === "77777777777" || cpf === "88888888888"
        || cpf === "99999999999") return false;
         
        for (let i=1; i<=9; i++) sum = sum + parseInt(cpf.substring(i-1, i)) * (11 - i);
        let rest = (sum * 10) % 11;
       
        if ((rest === 10) || (rest === 11))  rest = 0;
        if (rest !== parseInt(cpf.substring(9, 10)) ) return false;
       
      sum = 0;
        for (let i = 1; i <= 10; i++) sum = sum + parseInt(cpf.substring(i-1, i)) * (12 - i);
        rest = (sum * 10) % 11;
       
        if ((rest === 10) || (rest === 11))  rest = 0;
        if (rest !== parseInt(cpf.substring(10, 11) ) ) return false;
        return true;
    }

    /**
     * Verifica se um cnpj é valido, olhando para 
     * os digitos de verificacao.
     *
     * @param {*} cnpj string contendo o cnpj (somente numeros)
     * @returns true se valido
     * @memberof Register
     */
    cnpjTest(cnpj){
        if(cnpj.length !== 14) return false
        let weight = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        let sum = 0;
        for(let i =0; i < 12; i++){
            sum += weight[i] * parseInt(cnpj[i])
        }
        sum %= 11
        let vDigOne
        if(sum < 2) vDigOne = 0
        else vDigOne = 11 - sum
        if(parseInt(cnpj[12]) !== vDigOne) return false
        sum = 0
        weight = []
        weight = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        for(let i = 0; i < 13; i++){
            sum += weight[i] * parseInt(cnpj[i])
        }
        sum %= 11
        let vDigTwo
        if(sum < 2) vDigTwo = 0
        else vDigTwo = 11 - sum
        if(parseInt(cnpj[13]) !== vDigTwo) return false
        console.log("true")
        return true
    }

    /**
     * Envia um request de registro de instituicao para o servidor,
     * ou muda o estado para mostrar um erro, caso o CNPJ seja 
     * invalido
     *
     * @memberof Register
     */
    registerCharity() {
        if (this.socket.readyState !== this.socket.OPEN) 
            setTimeout(this.registerCharity, 10)

        if (!this.cnpjTest(this.state.cnpj)) {
            this.setError("CNPJ inválido")
            return
        }

        const hashPass = CryptoJS.MD5(this.state.password)
        const charity = {
            name: this.state.name,
            username: this.state.username,
            password: hashPass.toString(),
            email: this.state.email,
            address: this.state.address,
            cnpj: this.state.cnpj,
            webpage: this.state.webpage,
            field: this.state.field
        }

        const msg = {
            type: ResponseType.REGISTER_CHARITY,
            message: JSON.stringify(charity)
        }

        this.socket.send(JSON.stringify(msg))
    }

    /**
     * Envia um request de registro de pessoa para o servidor,
     * ou muda o estado para mostrar um erro, caso o CPF seja 
     * invalido
     *
     * @memberof Register
     */
    registerPerson() {
        if (this.socket.readyState !== this.socket.OPEN) 
            setTimeout(this.registerPerson, 10)

        if (!this.cpfTest(this.state.cpf)) {
            this.setError("CPF inválido")
            return
        }

        const hashPass = CryptoJS.MD5(this.state.password)
        const person = {
            name: this.state.name,
            username: this.state.username,
            password: hashPass.toString(),
            email: this.state.email,
            address: this.state.address,
            cpf: this.state.cpf
        }

        const msg = {
            type: ResponseType.REGISTER_PERSON,
            message: JSON.stringify(person)
        }

        this.socket.send(JSON.stringify(msg))
    }

    /**
     * Utilizado para gerenciar as submissoes dos 
     * formularios da pagina, realizando a chamada
     * para cadastro de pessoa ou instituicao.
     *
     * @param {*} event evento de submissao no form
     * @memberof Register
     */
    handleSubmit(event) {
        event.preventDefault()

        switch(this.state.type) {
            case 'CHARITY':
                this.registerCharity()
                break
            case 'PERSON':
                this.registerPerson()
                break
            default:
        }
    }

    /**
     * Muda o estado que indica o tipo de registro, 
     * alterando os campos que sao mostrados para a
     * realizacao do registro.
     *
     * @param {*} event evento de clique em um item
     * @memberof Register
     */
    handleClick(event) {
        this.setState({
            type: event.target.name.toUpperCase(),
            error: false
        })
    }

    /**
     * Utilizado para gerenciar as alteracoes nos 
     * formularios da pagina, guardando os valores no
     * estado
     *
     * @param {*} event evento de mudanca no form
     * @memberof Register
     */
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
            error: false
        })
    }

    /**
     * Envia um request de login para o servidor, ou muda o 
     * estado para mostrar um erro, caso user ou senha sejam 
     * invalidos
     *
     * @memberof Register
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
                errorMessage: 'Insira o nome e a senha'
            })
        }
    }

    /**
     * Armazena os dados do usuario no armazenamento
     * local.
     *
     * @param {*} id id do usuario logado
     * @param {*} type tipo do usuario logado (charity ou person)
     * @memberof Register
     */
    logged(id, type) {
        sessionStorage.setItem('id', id)
        sessionStorage.setItem('type', type.toUpperCase())   
        window.location.reload()     
    }

    /**
     * Muda o estado da pagina para mostrar um erro
     * que ocorra.
     *
     * @param {*} error mensagem de error
     * @memberof Register
     */
    setError(error) {
        this.setState({
            errorMessage: error, 
            error: true
        })
    }

    /**
     * Realiza a configuracao do WebSocket (conexao Client-Server)
     * para realizar a comunicacao e receber os dados 
     *
     * @memberof Register
     */
    setupSocket() {
        this.socket = Connection
        
        this.socket.onmessage = (r) => {
            const response = JSON.parse(r.data)
            console.log(response)
            switch (response.type) {
                case ResponseType.SUCCESS:
                    switch(response.id) {
                        case -9: //charity
                            this.login()
                            break
                        case -10: // person
                            this.login()
                            break
                        default:
                            this.logged(response.id, response.message)
                    }
                    break
                case ResponseType.FAIL:
                    switch(response.id) {
                        case -9: //charity
                            this.setError(response.message)
                            break
                        case -10: // person
                            this.setError(response.message)
                            break
                        case -1:
                            this.setError(response.message)
                            break
                        default:
                    }
                    
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
     * @memberof Register
     */
    componentDidMount() {
        this.setupSocket()
    }

    /**
     * Metodo built-in do component react que retorna o componente JSX
     * a ser renderizado na tela.
     * Uma tela com campos cadastro, e escolha de cadastro de instituicao
     * ou pessoa.
     *
     * @returns JSX Component
     * @memberof Register
     */
    render() {
        return (
            sessionStorage.getItem('id') ?
            <Redirect to='/'></Redirect> :
            <div className={'content login'}>
                <h2>Registrar</h2>
                <div>
                    <button name='charity' onClick={this.handleClick}>Cadastrar instituição</button>
                    <button name='person' onClick={this.handleClick}>Cadastrar pessoa</button>
                </div>
                {this.state.error &&
                <p className={'error'}>{this.state.errorMessage}</p>}
                <form name='register' onSubmit={this.handleSubmit}>
                    <input onChange={this.handleChange} name='name' type='text' placeholder='Nome'/>
                    <input onChange={this.handleChange} name='username' type='text' placeholder='Username'/>
                    <input onChange={this.handleChange} name='password' type='password' placeholder='Senha'/>
                    <input onChange={this.handleChange} name='address' type='text' placeholder='Endereço'/>
                    <input onChange={this.handleChange} name='email' type='email' placeholder='Email'/>

                    { this.state.type === 'CHARITY' &&
                    <div>
                        <input onChange={this.handleChange} name='cnpj' type='text' placeholder='CNPJ'/>
                        <input onChange={this.handleChange} name='webpage' type='url' placeholder='WebPage'/>
                        <input onChange={this.handleChange} name='field' type='text' placeholder='Campo de Atuação'/>
                    </div> }
                    
                    { this.state.type === 'PERSON' && 
                    <input onChange={this.handleChange} name='cpf' type='text' placeholder='CPF'/> }

                    <input type='submit' value='Registrar'/>
                </form>
            </div>
        )
    }
}

export default Register