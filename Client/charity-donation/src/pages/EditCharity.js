import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import Connection from '../connection/Connection'
import ResponseType from '../connection/ResponseType'

/**
 * Componente do React criado utilizando classes para
 * que possa ter acesso a estados. Possui metodos para 
 * renderizar e buscar dados no servidor.
 * O componente EditCharity representa uma pagina que 
 * permite a edicao de uma instituição: adicionar uma 
 * descricao, adicionar fotos, adicionar necessidades
 *
 * @class EditCharity
 * @extends {Component}
 */
class EditCharity extends Component {
    /**
     * Cria uma instancia de EditCharity, que é um JSX Component
     * 
     * @param {*} props propriedades passadas para o objeto
     * @memberof EditCharity
     */
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

    /**
     * Utilizado para gerenciar as submissoes dos 
     * formularios da pagina, vendo qual o tipo de 
     * submissao e enviando uma request daquele tipo 
     * para o servidor.
     *
     * @param {*} event evento de submissao no form
     * @memberof EditCharity
     */
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
        event.target.reset()
    }

    /**
     * Realiza a comunicacao com o Servidor, realizando
     * a mudanca de descricao do usuario logado (instituicao)
     *
     * @memberof EditCharity
     */
    sendDescription() {
        if (this.socket.readyState !== this.socket.OPEN) 
            setTimeout(this.sendDescription, 10)

        const { description } = this.state;
        
        if (!description) {
            this.descriptionFailed('Erro. Você precisa preencher a descrição.')
            return
        }

        const msg = {
            id: sessionStorage.getItem('id'),
            type: ResponseType.UPDATE_DESCRIPTION,
            message: description
        }

        this.socket.send(JSON.stringify(msg))
    
    }

    /**
     * Realiza a comunicacao com o Servidor, realizando
     * a insercao de uma necessidade do usuario logado
     * (instituicao)
     *
     * @memberof EditCharity
     */
    sendNeeds() {
        if (this.socket.readyState !== this.socket.OPEN) 
            setTimeout(this.sendNeeds, 10)

        const { nameNeed, amountNeed, descriptionNeed } = this.state;
        
        if (!nameNeed) {
            this.needingFailed('Erro. Você precisa preencher o nome.')
            return
        }

        if (!amountNeed) {
            this.needingFailed('Erro. Você precisa preencher a quantidade.')
            return
        }
        
        if (!descriptionNeed) {
            this.needingFailed('Erro. Você precisa preencher a descrição.')
            return
        }

        const needs = {
            needs: [{
                name: nameNeed,
                amount: amountNeed,
                description: descriptionNeed
            }]
        }

        const msg = {
            id: sessionStorage.getItem('id'),
            type: ResponseType.NEEDING,
            message: JSON.stringify(needs)
        }

        this.socket.send(JSON.stringify(msg))
    }

    /**
     * Realiza a comunicacao com o Servidor, enviando fotos
     * do usuario logado para serem armazenadas no servidor.
     *
     * @memberof EditCharity
     */
    sendPhotos() {
        if (this.socket.readyState !== this.socket.OPEN) 
            setTimeout(this.sendPhotos, 10)

        const { images } = this.state

        if (!images.length) {
            this.photoFailed('Erro. Você precisa selecionar imagens.')
            return
        }

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

    /**
     * Utilizado para gerenciar as alteracoes nos 
     * formularios da pagina, guardando os valores no
     * estado
     *
     * @param {*} event evento de mudanca no form
     * @memberof EditCharity
     */
    handleChange(event) {
        this.setState({
           [event.target.name]: event.target.value,
           needSuccess: false,
           needError: false,
           descriptionSuccess: false,
           descriptionError: false
        })
    }

    /**
     * Utilizado para gerenciar as alteracoes no
     * input file, guardando os arquivos no estado
     * da pagina
     *
     * @param {*} event evento de mudanca no input file
     * @memberof EditCharity
     */
    handleImages(event) {
        this.setState({
            images: event.target.files,
            photosSuccess: false,
            photosError: false
        })
    }
    
    /**
     * Realiza a configuracao do WebSocket (conexao Client-Server)
     * para realizar a comunicacao e receber os dados 
     *
     * @memberof EditCharity
     */
    setupSocket() {
        this.socket = Connection

        this.socket.binaryType = 'arraybuffer'

        this.socket.onmessage = (r) => {
            const response = JSON.parse(r.data)
            switch (response.type) {
                case ResponseType.SUCCESS:
                    switch (response.id) {
                        case -7:
                            this.needingSuccessful(response.message)
                            break
                        case -12:
                            this.photoSuccessful(response.message)
                            break
                        case -13:
                            this.descriptionSuccessful(response.message)
                            break
                        default:
                    }
                    break
                case ResponseType.FAIL:
                    switch (response.id) {
                        case -7:
                            this.needingFailed(response.message)
                            break
                        case -12:
                            this.photoFailed(response.message)
                            break
                        case -13:
                            this.descriptionFailed(response.message)
                            break
                        default:
                    }
                    break
                default:
                    this.setState({
                        error: true
                    })
            }
        }        
    }

    /**
     * Muda o estado para mostrar a necessidade inserida com
     * sucesso
     *
     * @param {String} message mensagem retornada pelo servidor
     * @memberof EditCharity
     */
    needingSuccessful(message) {
        this.setState({
            needSuccess: true,
            needMessage: message
        })
    }
    
    /**
     * Muda o estado para mostrar a foto enviada com
     * sucesso
     *
     * @param {String} message mensagem retornada pelo servidor
     * @memberof EditCharity
     */
    photoSuccessful(message) {
        this.setState({
            photosSuccess: true,
            photosMessage: message
        })
    }
    
    /**
     * Muda o estado para mostrar a descricao alterada com
     * sucesso
     *
     * @param {String} message mensagem retornada pelo servidor
     * @memberof EditCharity
     */
    descriptionSuccessful(message) {
        this.setState({
            descriptionSuccess: true,
            descriptionMessage: message
        })
    }

    /**
     * Muda o estado para mostrar o erro gerado ao tentar 
     * inserir uma necessidade
     *
     * @param {String} error mensagem retornada pelo servidor
     * @memberof EditCharity
     */
    needingFailed(error) {
        this.setState({
            needError: true,
            needMessage: error
        })
    }

    /**
     * Muda o estado para mostrar o erro gerado ao tentar 
     * enviar uma foto
     *
     * @param {String} error mensagem retornada pelo servidor
     * @memberof EditCharity
     */
    photoFailed(error) {
        this.setState({
            photosError: true,
            photosMessage: error
        })
    }

    /**
     * Muda o estado para mostrar o erro gerado ao tentar 
     * alterar a descricao
     *
     * @param {String} error mensagem retornada pelo servidor
     * @memberof EditCharity
     */
    descriptionFailed(error) {
        this.setState({
            descriptionError: true,
            descriptionMessage: error
        })
    }

    /**
     * Metodo built-in da classe Component que é
     * chamado sempre que o componente é montado
     *
     * @memberof EditCharity
     */
    componentDidMount() {
        this.setupSocket()
    }

    /**
     * Metodo built-in do component react que retorna o componente JSX
     * a ser renderizado na tela.
     * Possui tres formularios para alterar a Instituicao logada:
     * alterar a descricao, inserir fotos e inserir necessidades
     *
     * @returns JSX Component
     * @memberof EditCharity
     */
    render() {
        const arrayImages = Array.from(this.state.images)
        const preview = arrayImages.map((image, index) => 
            <div className={'img'}>
                <img alt={image.name} src={URL.createObjectURL(image)} key={index}/>
            </div>
        )

        return (
            <div className={'content edit'}>
                {
                    !(sessionStorage.getItem('type') === 'CHARITY') &&
                    <Redirect to='/' />
                }
                <h2>Editar a Instituição</h2>
                <h3>Alterar Descrição</h3>
                {this.state.descriptionError &&
                <p className={'error'}>{this.state.descriptionMessage}</p>}
                {this.state.descriptionSuccess &&
                <p className={'success'}>{this.state.descriptionMessage}</p>}
                <form name='description' onSubmit={this.handleSubmit}>
                    <textarea onChange={this.handleChange} name='description' placeholder='Escreva a descriçao' rows='10'></textarea>
                    <input type='submit' value='Alterar descrição'/>
                </form>

                <hr></hr>

                <h3>Adicionar Fotos</h3>
                {this.state.photosError &&
                <p className={'error'}>{this.state.photosMessage}</p>}
                {this.state.photosSuccess &&
                <p className={'success'}>{this.state.photosMessage}</p>}
                <form name='photos' onSubmit={this.handleSubmit}>
                    <label>
                        Selecionar imagens
                        <input style={{display: 'none'}} onChange={this.handleImages} type='file' accept="image/png" multiple/>
                    </label>
                    {this.state.images.length !== 0 &&
                    <p><b>Imagens Selecionadas:</b></p>}
                    {this.state.images.length !== 0 &&
                    <div>
                        {preview}
                    </div>}
                    <input type='submit' value='Enviar fotos'/>
                </form>

                <hr></hr>

                <h3>Adicionar Necessidades</h3>
                {this.state.needError &&
                <p className={'error'}>{this.state.needMessage}</p>}
                {this.state.needSuccess &&
                <p className={'success'}>{this.state.needMessage}</p>}
                <form name='needs' onSubmit={this.handleSubmit}>
                    <input onChange={this.handleChange} name='nameNeed' type='text' placeholder='Item'/>
                    <input onChange={this.handleChange} name='amountNeed' type='number' placeholder='Quantidade' min='1'/>
                    <textarea onChange={this.handleChange} name='descriptionNeed' placeholder='Descrição do item' rows='10'></textarea>
                    <input type='submit' value='Adicionar necessidade'/>
                </form>
                
            </div>
        )
    }
}

export default EditCharity