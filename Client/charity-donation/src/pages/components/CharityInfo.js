import React from 'react'
import logo from '../../logo.svg'
import Needs from './Needs';
import {Link} from 'react-router-dom'

function CharityInfo(props) {

    return (
        <div className="charityInfo">
            <p><b>{props.data.name}</b> #{props.data.id}</p>
            <p><i>{props.data.field}</i></p>
            <p><b>Necessidades</b></p>
            <Needs data={props.data.needs}/>
            <img src={logo} width='100' height='100' alt='logo from charity'></img>
            <Link to={'/charity/' + props.data.id}>
                Ver detalhes
            </Link>
        </div>
    )
}

export default CharityInfo