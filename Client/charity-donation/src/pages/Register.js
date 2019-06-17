import React from 'react'

function Register(props) {
    return (
        <div>
            <h2>Registrar</h2>
            <input type='text' placeholder='nome'></input>
            <input type='text' placeholder='email'></input>
            <input type='password' placeholder='senha'></input>
            <button>Registrar</button>
        </div>
    )
}

export default Register