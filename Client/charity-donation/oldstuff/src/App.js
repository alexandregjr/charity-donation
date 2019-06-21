import React, {Component} from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Header from './pages/components/Header'
import Footer from './pages/components/Footer'
import Charity from './pages/Charity'
import Donations from './pages/Donations'
import Login from './pages/Login'
import Register from './pages/Register'
import Main from './pages/Main'
import Connection from './connection/Connection'

class App extends Component {
  constructor() {
    super()
    this.socket = Connection
  }

  render() {
    return (
      <div>
        <BrowserRouter>
          <Header />
          <Switch>
            <Route exact path='/' component={Main}/>
            <Route exact path='/charity/:id' component={Charity}/>
            <Route exact path='/register' component={Register}/>
            <Route exact path='/login' component={Login}/>
            <Route exact path='/donations' component={Donations}/>
            <Route exact path='/Login' component={Login}/>
          </Switch>
          <Footer />
        </BrowserRouter>
        
      </div>
    )
  }
}

export default App;
