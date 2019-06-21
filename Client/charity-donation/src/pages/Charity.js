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

        if (this.state.donation && this.state.content.needs.needs[this.state.donation].amount === 0) {
            this.setState({
                donation: ''
            })
        }
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

        this.query()
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
            errorDonation: false,
            donated: false
        })
    }

    handleSubmit(event) {
        event.preventDefault()
        if (!this.state.donation) {
            this.setState({
                        errorDonation: true,
                        errorMessage: 'Erro. Precisa selecionar um item.'
            })
            return
        }
        if (!this.state.amount) {
            this.setState({
                errorDonation: true,
                errorMessage: 'Erro. Precisa dizer a quantidade.'
            })
            return
        }
        this.donate()
    }

    donate() {
        if (this.socket.readyState !== this.socket.OPEN) 
            setTimeout(this.donate, 10)

        console.log('donation: ' + !this.state.donation)
        

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
            <div>
                <img alt={'img'+index} src={URL.createObjectURL(image)} key={index}/>
            </div>
        )

        let needs
        if (!content.needs) needs = []
        else if (!content.needs.needs) needs = []
        else needs = content.needs.needs

        const needsSelector = needs.map((need, index) => 
            <label key={index}>
                {need.amount !== 0 && sessionStorage.getItem('id') &&
                <input onChange={this.handleChange} type='radio' name='donation' value={index}></input>}
                <div className={'selection'}></div>
                <b>{need.name}</b> 
                {need.amount !== 0 ?
                <i>({need.amount} para completar)</i> :
                <i>(completo)</i>}
                <p>{need.description}</p>
            </label>
        )

        return (
            this.state.error ?
                <p className={'error'}>{this.state.errorMessage}</p> :
            this.state.loading ?
                <p className={'loading'}>Loading data...</p> :
            <div className={'content charity'}>
                <h2>{content.name}</h2>
                <h4><i>{content.field}</i></h4>
                <hr></hr>
                <p>{content.description}</p>
                <hr></hr>
                <div className={'images'}>
                    {preview}
                </div>
                <hr></hr>
                <h3>Lista de nec.</h3>
                {this.state.donated &&
                <div>
                    <p className={'success'}>{this.state.result}</p>
                    <p className={'loading'}>Envie sua doação para o seguinte endereço: {content.address}</p>
                </div>}
                {this.state.errorDonation &&
                <p className={'error'}>{this.state.errorMessage}</p>}
                <form name='donate' onSubmit={this.handleSubmit}>
                    {needsSelector}
                    <div className={'inputs'}>
                        {this.state.donation &&
                        <input type='number' name='amount' placeholder='Quantidade' min='1' max={needs[this.state.donation].amount} onChange={this.handleChange}></input>}
                        {sessionStorage.getItem('id') &&
                        <input type='submit' value='Enviar doação'/>}
                    </div>
                </form>
            </div>
        )
    }
}

export default Charity