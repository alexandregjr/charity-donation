import React, {Component} from 'react'
import CharityInfo from './components/CharityInfo'
import Connection from '../connection/Connection'
import ResponseType from '../connection/ResponseType'

class Main extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            content: [],
        }

        this.query = this.query.bind(this)
        this.setContent = this.setContent.bind(this)
        this.setError = this.setError.bind(this)
        this.setupSocket = this.setupSocket.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

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


    setContent(content) {
        this.setState({
            error: false,
            loading: false,
            content: JSON.parse(content)
        })
    }

    setError(error) {
        this.setState({
            error: true,
            errorMessage: error
        })
    }

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

    handleSubmit(event) {
        event.preventDefault()
        this.search()
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }  

    componentDidMount() {
        this.setupSocket()
        this.query()
    }

    render() {
        const infos = this.state.content.map(
            (charity, index) => <CharityInfo key={index} data={charity} />
        )

        return (
            <div className="search">
                <form name='search' onSubmit={this.handleSubmit}>
                    <input className="search" onChange={this.handleChange} name='valueSearch' type='text' placeholder='pesquisar'></input>
                    <input className="searchBtn" type='submit' value='Pesquisar'></input>
                </form>
                <label className="point">
                    <input onChange={this.handleChange} type='radio' value='name' name='keySearch'></input>
                    Busca por nome
                </label>
                <label className="point">
                    <input onChange={this.handleChange} type='radio' value='field' name='keySearch'></input>
                    Busca por área de atuação
                </label>
                {   
                    this.state.error ?
                    <p>{this.state.errorMessage}</p> :
                    this.state.loading ? 
                    <p>loading...</p> :                 
                    <div>
                        {infos}
                    </div>
               }
            </div>
        )
    }
}

export default Main