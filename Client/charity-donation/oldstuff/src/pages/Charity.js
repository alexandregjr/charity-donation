import React, {Component} from 'react'
import Needs from './components/Needs'
import Connection from '../connection/Connection'
import ResponseType from '../connection/ResponseType'

class Charity extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            content: {}
        }

        this.query = this.query.bind(this)
        this.setContent = this.setContent.bind(this)
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

    setupSocket() {
        this.socket = Connection

        this.socket.onmessage = (r) => {
            const response = JSON.parse(r.data)
            switch (response.type) {
                case ResponseType.CHARITY:
                    this.setContent(response.message)
                    break
                default:
                    this.setState({
                        error: true
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

        return (
            this.state.error ?
            <p>error</p> :
            this.state.loading ?
            <p>loading...</p> :
            <div className="charityPage">
                <h1>{content.name}</h1>
                <h2>{content.field}</h2>
                <p>{content.description}</p>

                <h2>Lista de nec.</h2>
                <Needs data={content.needs} />
            </div>
        )
    }
}

export default Charity
