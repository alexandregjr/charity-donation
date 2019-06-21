import React from 'react'
import Needs from './Needs';
import {Link} from 'react-router-dom'

function CharityInfo(props) {

    return (
        <div className={'charity-info'}>
            <h3><b>{props.data.name}</b> #{props.data.id}</h3>
            <p className={'field'}><i>{props.data.field}</i></p>
            <hr></hr>
            {props.data.description &&
            <p className={'desc'}>{props.data.description}</p>}
            {props.data.description &&
            <hr></hr>}
            <p className={'subtitle'}><b>Necessidades da Instituição</b></p>
            <Needs data={props.data.needs}/>
            <hr></hr>
            <Link to={'/charity/' + props.data.id}>
                Ver detalhes
            </Link>
        </div>
    )
}

export default CharityInfo