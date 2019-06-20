import React, { Component } from 'react'
import Item from './components/Item'
import ResponseType from '../connection/ResponseType'
import Connection from '../connection/Connection'
import { Redirect } from 'react-router-dom'

class Received extends Component {
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

    query() {
        const msg = {
            id: sessionStorage.getItem('id'),
            type: ResponseType.DONATIONS_RECEIVED
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
                            break
                        default:
                    }
                    break
                case ResponseType.FAIL:
                    switch (response.id) {
                        case -6:
                            break
                        case -11:
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

    validateDonation(id) {
        if (this.socket.readyState !== this.socket.OPEN) 
            setTimeout(this.validateDonation, 10)

        const msg = {
            id: id,
            type: ResponseType.VALIDATE_DONATION
        }

        this.socket.send(JSON.stringify(msg))
    }

    handleSubmit(event) {
        event.preventDefault()
        this.validateDonation(event.target.name)
    }

    render() {
        const { content } = this.state

        const donations = content.map((donation, index) => 
            <form key={index} name={donation.id} onSubmit={this.handleSubmit}>
                <Item data={donation} />
                {donation.status === 0 ?
                <input type='submit' value='Confirmar recebimento'></input> :
                <p>Recebimento confirmado</p>}
            </form>
        )

        return (
            !(sessionStorage.getItem('type') === 'CHARITY') ?
                <Redirect to='/' />:
            this.state.error ?
                <p>{this.state.errorMessage}</p> :
            this.state.loading ?
                <p>Loading data...</p> :
            <div>
                {donations}
            </div>
        )
    }
}

export default Received