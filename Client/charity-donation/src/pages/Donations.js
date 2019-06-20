import React, { Component } from 'react'
import Donation from './components/Donation'
import ResponseType from '../connection/ResponseType'
import Connection from '../connection/Connection'

class Donations extends Component {
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
    }

    query() {
        const msg = {
            id: sessionStorage.getItem('id'),
            type: ResponseType.DONATIONS_MADE,
            message: sessionStorage.getItem('type')
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
                    this.setContent(response.message)
                    break
                case ResponseType.FAIL:
                        
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

    render() {
        const { content } = this.state

        const donations = content.map((donation, index) => 
            <div>
                <Donation data={donation} key={index} />
                {donation.status === 1 &&
                <p>A instituição confirmou o recebimento da doação</p>}
            </div>
        )

        return (
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

export default Donations