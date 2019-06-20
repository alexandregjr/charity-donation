import React from 'react'

function Login(props) {
    return (
        <div className="login">
          <h2><b>Entrar</b></h2>
          <p>Error</p>
          <form name='login'>
              <input name='username' type='text' placeholder='username'></input>
              <input name='password' type='password' placeholder='senha'></input>
              <input type='submit' value='login'></input>
          </form>
        </div>
    )
}

export default Login
