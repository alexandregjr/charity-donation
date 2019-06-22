import React, {Component} from 'react'
import CharityInfo from './components/CharityInfo'
import Connection from '../connection/Connection'
import ResponseType from '../connection/ResponseType'

/**
 * Componente do React criado utilizando classes para
 * que possa ter acesso a estados. Possui metodos para 
 * renderizar e buscar dados no servidor.
 * O component Main possui as Instituicoes listadas, 
 * permitindo realizar buscas por Nome ou Area de atuacao.
 *
 * @class Main
 * @extends {Component}
 */
class Main extends Component {
    /**
     * Cria uma instancia de Main, que é um JSX Component
     * 
     * @param {*} props propriedades passadas para o objeto
     * @memberof Main
     */
    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            content: []
        }

        this.query = this.query.bind(this)
        this.setContent = this.setContent.bind(this)
        this.setError = this.setError.bind(this)
        this.setupSocket = this.setupSocket.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    /**
     * Faz uma request para o servidor enviar os dados das
     * Instituicoes registradas (todas)
     *
     * @memberof Main
     */
    query() {
        const filter = {
            key: "",
            value: ""
        }

        const msg = {
            type: ResponseType.CHARITIES,
            message: JSON.stringify(filter)
        }

        if (this.socket.readyState === this.socket.OPEN)
            this.socket.send(JSON.stringify(msg))
        else setTimeout(this.query, 10)
    }

    /**
     * Faz uma request para o servidor enviar os dados das
     * Instituicoes registradas, utilizando o filtro selecionado
     * para realizar as buscas.
     *
     * @memberof Main
     */
    search() {
        if (!this.state.keySearch) {
            this.query()
            return
        }
        if (!this.state.valueSearch) {
            this.query()
            return
        }

        const filter = {
            key: this.state.keySearch,
            value: this.state.valueSearch
        }

        const msg = {
            type: ResponseType.CHARITIES,
            message: JSON.stringify(filter)
        }

        if (this.socket.readyState === this.socket.OPEN)
            this.socket.send(JSON.stringify(msg))
        else setTimeout(this.query, 10)
    }

    /**
     * Muda o estado da pagina, guardando 
     * o conteudo pesquisado no servidor
     *
     * @param {Object} content objeto contendo os dados
     * @memberof Main
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
     * @memberof Main
     */
    setError(error) {
        this.setState({
            error: true,
            errorMessage: error
        })
    }

    /**
     * Realiza a configuracao do WebSocket (conexao Client-Server)
     * para realizar a comunicacao e receber os dados 
     *
     * @memberof Main
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
                        error: true
                    })
            }
        }        
    }

    /**
     * Utilizado para gerenciar as submissoes dos 
     * formularios da pagina, realizando a chamada 
     * da busca.
     *
     * @param {*} event evento de submissao no form
     * @memberof Main
     */
    handleSubmit(event) {
        event.preventDefault()
        this.setState({
            loading: true
        })
        this.search()
    }

    /**
     * Utilizado para gerenciar as alteracoes nos 
     * formularios da pagina, guardando os valores no
     * estado
     *
     * @param {*} event evento de mudanca no form
     * @memberof Main
     */
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }  

    /**
     * Metodo built-in da classe Component que é
     * chamado sempre que o componente é montado
     *
     * @memberof Main
     */
    componentDidMount() {
        this.setupSocket()
        this.query()
    }

    /**
     * Metodo built-in do component react que retorna o componente JSX
     * a ser renderizado na tela.
     * Possui campos para a realizacao da busca por nome ou area de atuacao,
     * alem de uma listagem de todas as Instituicoes.
     *
     * @returns JSX Component
     * @memberof Main
     */
    render() {
        const infos = this.state.content.map(
            (charity, index) => <CharityInfo key={index} data={charity} />
        )

        return (
            <div className={'content main'}>
                <input className={'search'} onChange={this.handleChange} name='valueSearch' type='text' placeholder='Pesquisar'></input>
                <div className={'type'}>
                    <label>
                        <input onChange={this.handleChange} type='radio' value='name' name='keySearch'></input>
                        Busca por nome
                    </label>
                    <label>
                        <input onChange={this.handleChange} type='radio' value='field' name='keySearch'></input>
                        Busca por área de atuação
                    </label>
                </div>
                <form name='search' onSubmit={this.handleSubmit}>
                    <input type='submit' value='Pesquisar'></input>
                </form>
                {   
                    this.state.error ?
                    <p className={'error'}>{this.state.errorMessage}</p> :
                    this.state.loading ? 
                    <p className={'loading'}>Loading data...</p> :                 
                    <div className={'charities'}>
                        {infos}
                    </div>
               }
            </div>
        )
    }
}

export default Main