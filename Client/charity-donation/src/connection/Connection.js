/**
 * Retorna a instancia conectada no momento
 */
const Connection = (() => {
    let instance

    return (
        !instance ? 
        instance = new WebSocket("ws://192.168.0.12:9000") : 
        instance
    ) 
})()

export default Connection