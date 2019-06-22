/**
 * Classe que representa uma tipo de mensagem na comunicação com o servidor
 * 
 * @export
 * @class ResponseType
 */
export default class ResponseType {
    static CHARITIES = 'CHARITIES' 
    static CHARITY = 'CHARITY' 
    static DONATE = 'DONATE' 
    static DONATIONS_MADE = 'DONATIONS_MADE' 
    static DONATIONS_RECEIVED = 'DONATIONS_RECEIVED' 
    static NEEDS = 'NEEDS' 
    static NEEDING = 'NEEDING' 
    static REGISTER_CHARITY = 'REGISTER_CHARITY' 
    static REGISTER_PERSON = 'REGISTER_PERSON' 
    static VALIDATE_DONATION = 'VALIDATE_DONATION'
    static DEBUG = 'DEBUG'
    static PHOTO = 'PHOTO' 
    static SUCCESS = 'SUCCESS' 
    static FAIL = 'FAIL'
    static UPDATE_DESCRIPTION = 'UPDATE_DESCRIPTION' 
    static LOGIN = 'LOGIN'
}
