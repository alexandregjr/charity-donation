package filter;


/**
 *  Classe que define os atributos e metodos de um Filter especificando key e value.
 */
public class Filter {
    private String key;
    private String value;

    /**
     * Constructor da classe Filter, simplesmente iniciliza seus atributos;
     */
    public Filter(){
        this.key = "";
        this.value = "";
    }

    /**
     *  getter do atributo key.
     * @return String - key do Filter.
     */
    public String getKey() {
        return key;
    }


    /**
     *  Setter de key, atribui o valor desejado ao atibuto.
     * @param key valor desejado para o atributo key.
     */
    public void setKey(String key) {
        this.key = key;
    }

    /**
     *  getter do atributo value.
     * @return String - value do Filter.
     */
    public String getValue() {
        return value;
    }

    /**
     *  Setter de value, atribui o valor desejado ao atibuto.
     * @param value valor desejado para o atributo value.
     */
    public void setValue(String value) {
        this.value = value;
    }

    /**
     * Formata a saida de Filter como string.
     * @return String - string gerada.
     */
    @Override
    public String toString(){
        return this.getKey() +  " " + this.getValue();
    }

}
