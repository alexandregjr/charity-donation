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
            errorConfirm: false,
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

    setError(error) {
        this.setState({
            error: true,
            errorMessage: error
        })
    }

    confirmFailed(error) {
        this.setState({
            errorConfirm: true,
            errorMessage: error
        })
    }

    confirmSuccessful() {
        this.setState({
            loading: true
        })

        this.query()
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