import React, {Component} from 'react'
import Connection from '../connection/Connection'
import ResponseType from '../connection/ResponseType'

class Charity extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            content: {},
            errorMessage: '',
            error: false,
            donated: false,
            photos: []
        }

        this.query = this.query.bind(this)
        this.setContent = this.setContent.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.donationSuccessful = this.donationSuccessful.bind(this)
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

    donationSuccessful(message) {
        this.setState({
            donated: true,
            result: message
        })
    }

    donationFailed(message) {
        this.setState({
            errorDonation: true,
            errorMessage: message
        })
    }

    insertImage(image) {
        this.setState((curr) => ({
            photos: curr.photos.concat([image])
        }))
    }

    setupSocket() {
        this.socket = Connection

        this.socket.binaryType = 'arraybuffer'

        this.socket.onmessage = (r) => {
            if (typeof r.data === 'string') {                    
                const response = JSON.parse(r.data)
                switch (response.type) {
                    case ResponseType.SUCCESS:
                        switch(response.id) {
                            case -2: // -2 é id de charity
                                this.setContent(response.message)
                                break
                            case -4: // -4 é id de donation
                                this.donationSuccessful(response.message)
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
                                this.donationFailed(response.message)
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
            } else if (r.data instanceof ArrayBuffer) {
                const image = new Blob([r.data], {type: 'image/png'})
                this.insertImage(image)
            }
        }        
    }

    componentDidMount() {
        this.setupSocket()
        this.query()
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
            donated: false
        })
    }

    handleSubmit(event) {
        event.preventDefault()
        if (this.state.donation === undefined) return
        if (!this.state.amount) return

        this.donate()
    }

    donate() {
        if (this.socket.readyState !== this.socket.OPEN) 
            setTimeout(this.donate, 10)

        const donation = {
            donor: {
                id: sessionStorage.getItem('id')
            },
            receiver: {
                id: this.props.match.params.id
            },
            donation: {
                id: this.state.content.needs.needs[this.state.donation].id
            },
            amount: this.state.amount
        }

        const msg = {
            id: sessionStorage.getItem('type') === 'CHARITY' ? 1 : 0, //0 person, 1 charity
            type: ResponseType.DONATE,
            message: JSON.stringify(donation)
        }

        this.socket.send(JSON.stringify(msg))
    }

    render() {
        const { content, photos } = this.state
        
        const preview = photos.map((image, index) => 
            <img alt={'img'+index} src={URL.createObjectURL(image)} key={index} width='100'/>
        )

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
            <div className="charityPage">
                <h1>{content.name}</h1>
                <h2><b>{content.field}</b></h2>
                <p>{content.description}</p>

                {preview}

                <h2 className="needs"><b>Lista de necessidades</b></h2>
                {this.state.donated &&
                <p>{this.state.result}</p>}
                {this.state.errorDonation &&
                <p>{this.state.errorMessage}</p>}
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