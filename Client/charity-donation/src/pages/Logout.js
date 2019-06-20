import React from 'react'
import { Redirect } from 'react-router-dom'

function Logout(props) {
    sessionStorage.clear()
    localStorage.clear()
    window.location.reload()
    return (
        <Redirect  to='/'></Redirect>
    )
}

export default Logout