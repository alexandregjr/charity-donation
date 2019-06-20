import React, {Component} from 'react'
import Needs from './components/Needs'
import Connection from '../connection/Connection'
import ResponseType from '../connection/ResponseType'

class Charity extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            content: {},
            errorMessage: '',
            error: false
        }

        this.query = this.query.bind(this)
        this.setContent = this.setContent.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    query() {
        const msg = {
            id: this.props.match.params.id,
            type: ResponseType.CHARITY
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
            errorMessage: error,
            error: true
        })
    }

    setupSocket() {
        this.socket = Connection

        this.socket.onmessage = (r) => {
            const response = JSON.parse(r.data)
            switch (response.type) {
                case ResponseType.SUCCESS:
                    switch(response.id) {
                        case -2: // -2 é id de charity
                            this.setContent(response.message)
                            break
                        case -4: // -4 é id de donation
                            this.donationSuccessful()
                            break
                        default:
                    }
                    break
                case ResponseType.FAIL:
                        switch(response.id) {
                            case -2: // -2 é id de charity
                            this.setError(response.message)
                                break
                            case -4: // -4 é id de donation
                                this.donationFailed()
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

    componentDidMount() {
        this.setupSocket()
        this.query()
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleSubmit(event) {
        event.preventDefault()
        if (!this.state.donation) return
        if (!this.state.amount) return
    }

    render() {
        const { content } = this.state

        let needs
        if (!content.needs) needs = []
        else if (!content.needs.needs) needs = []
        else needs = content.needs.needs

        const needsSelector = needs.map((need, index) => 
            <label key={index}>
                <input onChange={this.handleChange} type='radio' name='donation' value={index}></input>
                {need.name}
            </label>
        )

        return (
            this.state.error ?
            <p>{this.state.errorMessage}</p> :
            this.state.loading ?
            <p>Loading data...</p> :
            <div>
                <h1>{content.name}</h1>
                <h2>{content.field}</h2>
                <p>{content.description}</p>

                <h2>Lista de nec.</h2>
                <form name='donate' onSubmit={this.handleSubmit}>
                    {needsSelector}
                    {this.state.donation &&
                    <input type='number' name='amount' min='1' max={needs[this.state.donation].amount} onChange={this.handleChange}></input>}
                    <input type='submit' value='Enviar doação'/>
                </form>
            </div>
        )
    }
}

export default Charity