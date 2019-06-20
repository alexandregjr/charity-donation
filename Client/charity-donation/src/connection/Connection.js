const Connection = (() => {
    let instance

    return (
        !instance ? 
        instance = new WebSocket("ws://192.168.0.22:9000") : 
        instance
    ) 
})()

export default Connection