import React, {Component} from 'react'
import CharityInfo from './components/CharityInfo'
import Connection from '../connection/Connection'
import ResponseType from '../connection/ResponseType'

class Main extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            content: []
        }

        this.query = this.query.bind(this)
        this.setContent = this.setContent.bind(this)
    }

    query() {
        const msg = {
            type: ResponseType.CHARITIES
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
                case ResponseType.CHARITIES:
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
        const infos = this.state.content.map(
            (charity, index) => <CharityInfo key={index} data={charity} />
        )

        return (
            <div>
                <input type='text' placeholder='pesquisar instituição'></input>
                <button className='search'><i class="fa fa-search"></i></button>
                {
                    this.state.error ?
                    <p>error</p> :
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
