import React from 'react'
import logo from '../../logo.svg'
import Needs from './Needs';
import {Link} from 'react-router-dom'

function CharityInfo(props) {

    return (
        <div className="charityInfo">
          <div>
            <p className="name"><b>{props.data.name}</b> #{props.data.id}</p>
            <p className="field"><i>{props.data.field}</i></p>
            <p className="pneed"><b>Necessidades</b></p>
            <Needs data={props.data.needs}/>
            <img src={logo} width='100' height='100' alt='logo from charity'></img>
            <Link to={'/charity/' + props.data.id}>
                Ver detalhes
            </Link>
          </div>
        </div>
    )
}

export default CharityInfo
