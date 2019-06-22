import React, { Component } from 'react'
import Item from './components/Item'
import ResponseType from '../connection/ResponseType'
import Connection from '../connection/Connection'

/**
 * Componente do React criado utilizando classes para
 * que possa ter acesso a estados. Possui metodos para 
 * renderizar e buscar dados no servidor.
 * O componente Donations representa uma pagina que 
 * possui as doacoes realizadas pelo user logado.
 *
 * @class Donations
 * @extends {Component}
 */
class Donations extends Component {

    /**
     * Cria uma instancia de Donations, que é um JSX Component
     * 
     * @param {*} props propriedades passadas para o objeto
     * @memberof Donations
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
        this.setError = this.setError.bind(this)
        this.query = this.query.bind(this)
    }
    
    /**
     * Faz uma request para o servidor enviar todas as 
     * doacoes feitas para o usuario que esta logado
     *
     * @memberof Donations
     */
    query() {
        const msg = {
            id: sessionStorage.getItem('id'),
            type: ResponseType.DONATIONS_MADE,
            message: sessionStorage.getItem('type').toLocaleLowerCase()
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
     * @memberof Donations
     */
    setContent(content) {
        this.setState({
            error: false,
            loading: false,
            content: JSON.parse(content)
        })
    }

    /**
     * Muda o estado da pagina para mostrar um erro ocorrido
     * no carregamento da pagina
     *
     * @param {String} error mensagem de erro
     * @memberof Donations
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
     * @memberof Donations
     */
    setupSocket() {
        this.socket = Connection

        this.socket.onmessage = (r) => {
            const response = JSON.parse(r.data)
            switch (response.type) {
                case ResponseType.SUCCESS:
                    this.setContent(response.message)
                    break
                case ResponseType.FAIL:
                    this.setError(response.message)
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
     * Metodo built-in da classe Component que é
     * chamado sempre que o componente é montado
     *
     * @memberof Donations
     */
    componentDidMount() {
        this.setupSocket()
        this.query()
    }

    /**
     * Metodo built-in do component react que retorna o componente JSX
     * a ser renderizado na tela.
     * Lista todas as doacoes realizadas pelo usuario.
     *
     * @returns JSX Component
     * @memberof Charity
     */
    render() {
        const { content } = this.state

        const donations = content.map((donation, index) => 
            <div key={index}>
                <Item data={donation} type='made' />
                {donation.status === 1 &&
                <hr></hr>}
                {donation.status === 1 &&
                <p>A instituição confirmou o recebimento da doação</p>}
            </div>
        )

        return (
            this.state.error ?
            <p className={'error'}>{this.state.errorMessage}</p> :
            this.state.loading ?
            <p className={'loading'}>Loading data...</p> :
            <div className={'content donations'}>
                <h2>Doações feitas</h2>
                <div className={'donation'}>
                    {donations.length !== 0 ?
                    donations :
                    <p className={'loading'}>Não existem doações feitas por você.</p>}
                </div>
            </div>
        )
    }
}

export default Donations