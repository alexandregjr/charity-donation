import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import Needs from './components/Needs'
import Connection from '../connection/Connection'
import ResponseType from '../connection/ResponseType'

class EditCharity extends Component {
    constructor(props) {
        super(props)
        this.state = {
            images: []
        }

        this.handleImages = this.handleImages.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.sendPhotos = this.sendPhotos.bind(this)
    }

    handleSubmit(event) {
        event.preventDefault()
        switch(event.target.name) {
            case 'needs':
                this.sendNeeds()
                break
            case 'description':
                this.sendDescription()
                break
            case 'photos':
                this.sendPhotos()
                break
            
            default:
        }
    }

    sendDescription() {
        if (this.socket.readyState !== this.socket.OPEN) 
            setTimeout(this.sendDescription, 10)

        const { description } = this.state;
    
        // TODO: send id of logged charity
        const msg = {
            id: sessionStorage.getItem('id'),
            type: ResponseType.UPDATE_DESCRIPTION,
            message: description
        }

        this.socket.send(JSON.stringify(msg))
    
    }

    sendNeeds() {
        if (this.socket.readyState !== this.socket.OPEN) 
            setTimeout(this.sendNeeds, 10)

        const { nameNeed, amountNeed, descriptionNeed } = this.state;
        
        const needs = {
            needs: [{
                name: nameNeed,
                amount: amountNeed,
                description: descriptionNeed
            }]
        }

        // TODO: send id of logged charity
        const msg = {
            id: sessionStorage.getItem('id'),
            type: ResponseType.NEEDING,
            message: JSON.stringify(needs)
        }

        this.socket.send(JSON.stringify(msg))
    }

    sendPhotos() {
        if (this.socket.readyState !== this.socket.OPEN) 
            setTimeout(this.sendPhotos, 10)

        const { images } = this.state

        for (const image of images) {
            const msg = {
                type: ResponseType.PHOTO,
                id: sessionStorage.getItem('id')
            }

            this.socket.send(JSON.stringify(msg))
            
            const reader = new FileReader()
            let data = new ArrayBuffer()

            reader.onload = (event) => {
                data = event.target.result
                this.socket.send(data)
            }

            reader.readAsArrayBuffer(image)
        }

        this.setState({
            images: []
        })
    }

    handleChange(event) {
        this.setState({
           [event.target.name]: event.target.value
        })
    }

    handleImages(event) {
        this.setState({
            images: event.target.files
        })
    }
    
    //TODO arrumar responses possiveis
    setupSocket() {
        this.socket = Connection

        this.socket.binaryType = 'arraybuffer'

        this.socket.onmessage = (r) => {
            const response = JSON.parse(r.data)
            switch (response.type) {
                case ResponseType.DEBUG:
                    break
                default:
                    this.setState({
                        error: true
                    })
            }
        }        
    }

    componentDidMount() {
        this.setupSocket()
    }

    render() {
        const arrayImages = Array.from(this.state.images)
        const preview = arrayImages.map((image, index) => 
            <img alt={image.name} src={URL.createObjectURL(image)} key={index} width='100'/>
        )

        return (
            <div>
                {
                    !(sessionStorage.getItem('type') === 'CHARITY') &&
                    <Redirect to='/' />
                }
                <h2>Descrição</h2>
                <form name='description' onSubmit={this.handleSubmit}>
                    <textarea onChange={this.handleChange} name='description' placeholder='Escreva a descriçao' style={{resize: 'none'}} rows='10' cols='40'></textarea>
                    <input type='submit' value='Alterar descrição'/>
                </form>

                <h2>Fotos</h2>
                <form name='photos' onSubmit={this.handleSubmit}>
                    <label style={{border: '1px solid'}}>
                        Selecionar imagens
                        <input style={{display: 'none'}} onChange={this.handleImages} type='file' accept="image/png" multiple/>
                    </label>
                    <p><b>Selecionadas</b></p>
                    {preview}
                    <input type='submit' value='Enviar fotos'/>
                </form>

                <h2>necessidades</h2>
                <Needs data={[]}/>
                <form name='needs' onSubmit={this.handleSubmit}>
                    <input onChange={this.handleChange} name='nameNeed' type='text' placeholder='Item'/>
                    <input onChange={this.handleChange} name='amountNeed' type='number' placeholder='Quantidade' min='1'/>
                    <textarea onChange={this.handleChange} name='descriptionNeed' placeholder='Descrição do item'></textarea>
                    <input type='submit' value='Adicionar necessidade'/>
                </form>
                
            </div>
        )
    }
}

export default EditCharity