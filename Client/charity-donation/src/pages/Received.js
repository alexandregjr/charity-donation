import React, { Component } from 'react'
import Item from './components/Item'
import ResponseType from '../connection/ResponseType'
import Connection from '../connection/Connection'
import { Redirect } from 'react-router-dom'

/**
 * Componente do React criado utilizando classes para
 * que possa ter acesso a estados. Possui metodos para 
 * renderizar e buscar dados no servidor.
 * O componente Received representa uma pagina que possui
 * uma lista com as doacoes recebidas por um usuario
 *
 * @class Received
 * @extends {Component}
 */
class Received extends Component {

    /**
     * Cria uma instancia de Received, que é um JSX Component
     * 
     * @param {*} props propriedades passadas para o objeto
     * @memberof Received
     */
    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            content: [],
            errorMessage: '',
            error: false
        }

        this.setupSocket = this.setupSocket.bind(this)
        this.setContent = this.setContent.bind(this)
        this.query = this.query.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    /**
     * Faz uma request para o servidor enviar todas as 
     * doacoes feitas para o usuario que esta logado
     *
     * @memberof Received
     */
    query() {
        const msg = {
            id: sessionStorage.getItem('id'),
            type: ResponseType.DONATIONS_RECEIVED
        }

        if (this.socket.readyState === this.socket.OPEN)
            this.socket.send(JSON.stringify(msg))
        else setTimeout(this.query, 10)
    }

    /**
     * Muda o estado da pagina, guardando 
     * o conteudo pesquisado no servidor
     *
     * @param {Object} content
     * @memberof Received
     */
    setContent(content) {
        this.setState({
            error: false,
            loading: false,
            errorConfirm: false,
            content: JSON.parse(content)
        })
    }

    /**
     * Realiza a configuracao do WebSocket (conexao Client-Server)
     * para realizar a comunicacao e receber os dados 
     *
     * @memberof Received
     */
    setupSocket() {
        this.socket = Connection

        this.socket.onmessage = (r) => {
            const response = JSON.parse(r.data)
            switch (response.type) {
                case ResponseType.SUCCESS:
                    switch (response.id) {
                        case -6:
                            this.setContent(response.message)
                            break
                        case -11:
                            this.confirmSuccessful()
                            break
                        default:
                    }
                    break
                case ResponseType.FAIL:
                    switch (response.id) {
                        case -6:
                            this.setError(response.message)
                            break
                        case -11:
                            this.confirmFailed(response.message)
                            break
                        default:
                    }
                    break
                default:
                    this.setState({
                        error: true,
                        errorMessage: 'Erro: Indefinido.'
                    })
            }
        }        
    }

    /**
     * Muda o estado da pagina para mostrar um erro ocorrido
     * no carregamento da pagina
     *
     * @param {String} error mensagem de erro
     * @memberof Received
     */
    setError(error) {
        this.setState({
            error: true,
            errorMessage: error
        })
    }

    /**
     * Muda o estado para mostrar um erro quando falha
     * ao tentar confirmar o recebimento de algum produto
     *
     * @param {*} error mensagem de erro
     * @memberof Received
     */
    confirmFailed(error) {
        this.setState({
            errorConfirm: true,
            errorMessage: error
        })
    }

    /**
     * Muda o estado e atualiza a pagina para mostrar 
     * a confirmacao de uma doacao
     * 
     * @memberof Received
     */
    confirmSuccessful() {
        this.setState({
            loading: true
        })

        this.query()
    }

    /**
     * Metodo built-in da classe Component que é
     * chamado sempre que o componente é montado
     *
     * @memberof Received
     */
    componentDidMount() {
        this.setupSocket()
        this.query()
    }

    /**
     * Envia uma request para o servidor confirmar o recebimento 
     * da doacao selecionada
     *
     * @param {*} id id da doacao a ser confirmada
     * @memberof Received
     */
    validateDonation(id) {
        if (this.socket.readyState !== this.socket.OPEN) 
            setTimeout(this.validateDonation, 10)

        const msg = {
            id: id,
            type: ResponseType.VALIDATE_DONATION
        }

        this.socket.send(JSON.stringify(msg))
    }

    /**
     * Utilizado para gerenciar as submissoes dos 
     * formularios da pagina, realizando a confirmacao
     * da doacao
     *
     * @param {*} event evento de submissao no form
     * @memberof Received
     */
    handleSubmit(event) {
        event.preventDefault()
        this.validateDonation(event.target.name)
    }

    /**
     * Metodo built-in do component react que retorna o componente JSX
     * a ser renderizado na tela.
     * Lista todas as doacoes realizadas recebidas usuario, tendo a opçao
     * de confirmar recebimento.
     *
     * @returns JSX Component
     * @memberof Received
     */
    render() {
        const { content } = this.state

        const donations = content.map((donation, index) => 
            <form key={index} name={donation.id} onSubmit={this.handleSubmit}>
                <Item data={donation} type='received' />
                <hr></hr>
                {donation.status === 0 ?
                <input type='submit' value='Confirmar recebimento'></input> :
                <p>Recebimento confirmado</p>}
            </form>
        )

        return (
            !(sessionStorage.getItem('type') === 'CHARITY') ?
                <Redirect to='/' />:
            this.state.error ?
                <p className={'error'}>{this.state.errorMessage}</p> :
            this.state.loading ?
                <p className={'loading'}>Loading data...</p> :
            <div className={'content received'}>
                {this.state.errorConfirm &&
                <p className={'error'}>{this.state.errorMessage}</p>}
                <h2>Doações recebidas</h2>
                <div className={'donation'}>
                    {donations.length !== 0 ?
                    donations :
                    <p className={'loading'}>Não existem doações feitas para você.</p>}
                </div>
            </div>
        )
    }
}

export default Received