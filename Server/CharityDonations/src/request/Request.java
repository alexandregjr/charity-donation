package request;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.io.Serializable;

/**
 * Classe que define metodos e atributos do request, definindo sua mensagem tipo e id.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class Request implements Serializable {

    int id;
    String message;
    RequestType type;

    /**
     * Constructor da classe Request, simplesmente iniciliza seus atributos;
     */
    public Request(){
        id = 0;
        message = "";
    }

    /**
     *  getter do atributo type.
     * @return RequestType - type do Request.
     */
    public RequestType getType() {
        return type;
    }

    /**
     *  Setter de type, atribui o valor desejado ao atibuto.
     * @param type valor desejado para o atributo type.
     */
    public void setType(RequestType type) {
        this.type = type;
    }

    /**
     *  getter do atributo id.
     * @return int - id do Request.
     */
    public int getId() {
        return id;
    }

    /**
     *  Setter de id, atribui o valor desejado ao atibuto.
     * @param id valor desejado para o atributo id.
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     *  getter do atributo message.
     * @return String - message do Request.
     */
    public String getMessage() {
        return message;
    }

    /**
     *  Setter de message, atribui o valor desejado ao atibuto.
     * @param message valor desejado para o atributo message.
     */
    public void setMessage(String message) {
        this.message = message;
    }

    /**
     * Formata a exibição do Request como string.
     * @return String - gerada pelo procedimento.
     */
    @Override
    public String toString() {
        return "Request{" +
                "id=" + id +
                ", message='" + message + '\'' +
                ", type=" + type +
                '}';
    }
}
