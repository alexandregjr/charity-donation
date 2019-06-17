import React from 'react'

function Login(props) {
    return (
        <div>
            <h2>Logar</h2>
            <input type='text' placeholder='email'></input>
            <input type='password' placeholder='senha'></input>
            <button>Login</button>
        </div>
    )
}

export default Login