import React from 'react'
import logo from '../logo.svg'
import Neeeds from './components/Needs'

function EditCharity(props) {
    return (
        <div>
            <h2>Descrição</h2>
            <textarea placeholder='Escreva a descriçao'></textarea>

            <h2>Fotos</h2>
            <div>
                <img src={logo}></img>
                <img src={logo}></img>
            </div>
            <button>Adicionar foto</button>

            <h2>necessidades</h2>
            <Needs />
        </div>
    )
}

export default EditCharity