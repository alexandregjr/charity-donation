import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';



class App extends Component {
  constructor() {
    super()
    this.state = {
      loaded: false,
      logged: false
    }

    this.handleMessage = this.handleMessage.bind(this)
    this.handleUser = this.handleUser.bind(this)
    this.sendData = this.sendData.bind(this)
  }

  login() {
    const msg = {
      user: this.state.sendUser, 
      message: this.state.sendMessage
    }
    this.socket.send(JSON.stringify(msg))
  }

  setupSocket() {
    this.socket = new WebSocket("ws://localhost:9000/")

    this.socket.onmessage = (response) => {
      const message = JSON.parse(response.data)
      this.setState({
        loaded: true, 
        logged: true,
        user: message.user, 
        message: message.message
      })

    }

    this.socket.onopen = () => {
      this.login()
    }

    this.socket.onclose = () => {

    }

    this.socket.onerror = () => {

    }
  }

  handleUser(event) {
    this.setState({
      sendUser: event.target.value
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
              <input type='text' placeholder='User' onChange={this.handleUser}></input>
              <input type='text' placeholder='Message' onChange={this.handleMessage}></input>
              <br></br>
              <p onClick={this.sendData}>Enviar</p>
            </form>
            :
            this.state.loaded ?
              <p>
                user: {this.state.user} / message: {this.state.message}
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
