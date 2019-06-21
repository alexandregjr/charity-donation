import React from 'react'
import { Redirect } from 'react-router-dom'

function Logout(props) {
    let reload = false
    if (sessionStorage.getItem('id'))
        reload = true

    sessionStorage.clear()
    localStorage.clear()

    if (reload)
        window.location.reload()
    
    return (
        !reload &&
        <Redirect to='/'></Redirect>
    )
}

export default Logout