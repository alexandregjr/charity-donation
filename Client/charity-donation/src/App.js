import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Header from './pages/components/Header'
import Footer from './pages/components/Footer'
import Charity from './pages/Charity'
import Donations from './pages/Donations'
import Login from './pages/Login'
import Register from './pages/Register'
import Main from './pages/Main'
import Connection from './connection/Connection'
import EditCharity from './pages/EditCharity'
import Received from './pages/Received'
import Logout from './pages/Logout'
import { Redirect } from 'react-router-dom'
import './App.css'

/**
 * Componente do React criado utilizando classes para
 * que possa ter acesso a estados. Possui metodos para 
 * renderizar e buscar dados no servidor.
 * O componente App representa o WebApp como um todo, 
 * mostrando determinados componentes de acordo com o 
 * link acessado
 *
 * @class App
 * @extends {Component}
 */
class App extends Component {
  /**
   * Cria uma instancia de App, que é um JSX Component
   * 
   * @memberof App
   */
  constructor() {
    super()
    this.socket = Connection
  }

  /**
   * Metodo built-in do component react que retorna o componente JSX
   * a ser renderizado na tela.
   * Sempre renderiza o Header e o Footer, e de acordo com o 
   * 'Route' (link), renderiza os outros componentes.
   *
   * @returns JSX Component
   * @memberof EditCharity
   */
  render() {
    return (
      <div>
        <BrowserRouter>
          <Header />
          <Switch>
            <Route exact path='/' component={Main} />
            <Route exact path='/charity/:id' component={Charity}/>
            <Route exact path='/register' component={Register}/>
            <Route exact path='/login' component={Login}/>
            <Route exact path='/logout' component={Logout}/>
            <Route exact path='/donations' component={Donations}/>
            <Route exact path='/edit' component={EditCharity}/>
            <Route exact path='/received' component={Received}/>
            <Route path='/' render={() => <Redirect to='/' />}/>
          </Switch>
          <Footer />
        </BrowserRouter>
      </div>
    )
  }
}

export default App;
