

const Connection = (() => {
    let instance

    return (
        !instance ? 
        instance = new WebSocket("ws://localhost:9000") : 
        instance
    ) 
})()

export default Connection
  
// this.socket.onmessage = (r) => {
//     const response = JSON.parse(r.data);
//     switch (response.type) {
//         case ResponseType.CHARITIES:
//             // call function to read charities
//             break;
//         case ResponseType.CHARITY:
//             // call function to read charity
//             break;
//         case ResponseType.DONATE:
//             // call function to display donation status
//             break;
//         case ResponseType.DONATIONS_MADE:
//             // call function to read donations of user
//             break;
//         case ResponseType.DONATIONS_RECEIVED:
//             // call function to read donations to charity
//             break;
//         case ResponseType.NEEDING:
//             // call function to display needs status
//             break;
//         case ResponseType.NEEDS:
//             // call function to read needs of charity
//             break;
//         case ResponseType.REGISTER_CHARITY:
//             // call function to display registration status
//             break;
//         case ResponseType.REGISTER_PERSON:
//             // call function to display registration status
//             break;
//         case ResponseType.VALIDATE_DONATION:
//             // call function to display validation status
//             break;
//         case ResponseType.DEBUG:
//             this.setState({
//                 loaded: true,
//                 id: response.id,
//                 message: response.message
//             });
//             break;
//         default:
//     }
// };
// this.socket.onopen = () => {
//     this.login();
// };
// this.socket.onclose = () => {
// };
// this.socket.onerror = () => {
// };