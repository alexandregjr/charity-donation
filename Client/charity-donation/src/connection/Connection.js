const Connection = (() => {
    let instance

    return (
        !instance ? 
        instance = new WebSocket("ws://localhost:9000") : 
        instance
    ) 
})()

export default Connection