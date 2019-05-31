import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import ResponseType from './responses/ResponseType';



class App extends Component {
  constructor() {
    super()
    this.state = {
      loaded: false,
      logged: false
    }

    this.handleMessage = this.handleMessage.bind(this)
    this.handleId = this.handleId.bind(this)
    this.sendData = this.sendData.bind(this)
    this.login = this.login.bind(this)
  }

  login() {
    const msg = {
      id: this.state.sendId, 
      message: this.state.sendMessage,
      type: ResponseType.DEBUG
    }
    this.socket.send(JSON.stringify(msg))

    this.setState({
      logged: true
    })
  }

  setupSocket() {
    this.socket = new WebSocket("ws://localhost:9000/")

    this.socket.onmessage = (r) => {
      const response = JSON.parse(r.data)
      
      switch (response.type) {
        case ResponseType.CHARITIES:
          // call function to read charities
          break
        case ResponseType.CHARITY:
          // call function to read charity
          break
        case ResponseType.DONATE:
          // call function to display donation status
          break
        case ResponseType.DONATIONS_MADE:
          // call function to read donations of user
          break
        case ResponseType.DONATIONS_RECEIVED:
          // call function to read donations to charity
          break
        case ResponseType.NEEDING:
          // call function to display needs status
          break
        case ResponseType.NEEDS:
          // call function to read needs of charity
          break
        case ResponseType.REGISTER_CHARITY:
          // call function to display registration status
          break
        case ResponseType.REGISTER_PERSON:
          // call function to display registration status
          break
        case ResponseType.VALIDATE_DONATION:
          // call function to display validation status
          break
        case ResponseType.DEBUG:
          this.setState({
            loaded: true,
            id: response.id,
            message: response.message
          })
          break
        default:
      }

    }

    this.socket.onopen = () => {
      this.login()
    }

    this.socket.onclose = () => {

    }

    this.socket.onerror = () => {

    }
  }

  handleId(event) {
    this.setState({
      sendId: event.target.value
    })
  }

  handleMessage(event) {
    this.setState({
      sendMessage: event.target.value
    })
  }

  sendData(event) {
    this.setupSocket()
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {!this.state.logged ?
            <form>
              <input type='text' placeholder='ID' onChange={this.handleId}></input>
              <input type='text' placeholder='Message' onChange={this.handleMessage}></input>
              <br></br>
              <p onClick={this.sendData}>Enviar</p>
            </form>
            :
            this.state.loaded ?
              <p>
                id: {this.state.id} / message: {this.state.message}
              </p>
              :
              <p>
                loading...
              </p>
            
        }
        </header>
      </div>
    )
  }
}

export default App;
