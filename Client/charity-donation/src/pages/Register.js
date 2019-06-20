import React, { Component } from 'react'
import CriptoJS from 'crypto-js'
import ResponseType from '../connection/ResponseType'
import Connection from '../connection/Connection'

class Register extends Component {
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
    }

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

    registerCharity() {
        if (this.socket.readyState !== this.socket.OPEN) 
            setTimeout(this.registerCharity, 10)

        // TODO verificar cnpj
        // if (!this.cnpjTest(this.state.cnpj)) {
        //     this.setState({
        //         error: "CNPJ inválido!"
        //     })
        //     return
        // }

        const hashPass = CriptoJS.MD5(this.state.password)
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

    registerPerson() {
        if (this.socket.readyState !== this.socket.OPEN) 
            setTimeout(this.registerPerson, 10)

        if (!this.cpfTest(this.state.cpf)) {
            this.setState({
                error: "CPF inválido!"
            })
            return
        }

        const hashPass = CriptoJS.MD5(this.state.password)
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

    handleClick(event) {
        this.setState({
            type: event.target.name.toUpperCase(),
            error: ''
        })
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
            error: ''
        })
    }

    //TODO arrumar responses possiveis
    setupSocket() {
        this.socket = Connection

        this.socket.onmessage = (r) => {
            const response = JSON.parse(r.data)
            switch (response.type) {
                case ResponseType.DEBUG:
                    console.log(response.message)
                    break
                default:
                    this.setState({
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
            <div>
                <h2>Registrar</h2>
                <button name='charity' onClick={this.handleClick}>Cadastrar instituição</button>
                <button name='person' onClick={this.handleClick}>Cadastrar pessoa</button>
                <p className='error'>{this.state.error}</p>
                <form name='register' onSubmit={this.handleSubmit}>
                    <input onChange={this.handleChange} name='name' type='text' placeholder='nome'/>
                    <input onChange={this.handleChange} name='username' type='text' placeholder='username'/>
                    <input onChange={this.handleChange} name='password' type='password' placeholder='senha'/>
                    <input onChange={this.handleChange} name='address' type='text' placeholder='address'/>
                    <input onChange={this.handleChange} name='email' type='email' placeholder='email'/>

                    { this.state.type === 'CHARITY' &&
                    <div>
                        <input onChange={this.handleChange} name='cnpj' type='text' placeholder='cnpj'/>
                        <input onChange={this.handleChange} name='webpage' type='url' placeholder='webpage'/>
                        <input onChange={this.handleChange} name='field' type='text' placeholder='campo de atuação'/>
                    </div> }
                    
                    { this.state.type === 'PERSON' && 
                    <input onChange={this.handleChange} name='cpf' type='text' placeholder='cpf'/> }

                    <input type='submit' value='Registrar'/>
                </form>
            </div>
        )
    }
}

export default Register