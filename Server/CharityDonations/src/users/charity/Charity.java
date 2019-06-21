package users.charity;

import needs.Needs;
import users.User;

/**
 *  Classe que define os atributos e metodos de uma Charity, especificando informações como
 *  area de atuação, cnpj, nome, etc.
 */
public class Charity extends User {
    private String cnpj;
    private String field;
    private Needs needs;
    private String webpage;
    private String description;

    /**
     * Constructor da classe Charity, simplesmente iniciliza seus atributos;
     */
    public Charity() {
        this.needs = new Needs();
    }

    /**
     *  getter do atributo cnpj.
     * @return String - cnpj da Charity.
     */
    public String getCnpj() {
        return cnpj;
    }

    /**
     *  Setter de cnpj, atribui o valor desejado ao atibuto.
     * @param cnpj valor desejado para o atributo cnpj.
     */
    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }

    /**
     *  getter do atributo field.
     * @return String - field da Charity.
     */
    public String getField() {
        return field;
    }

    /**
     *  Setter de field, atribui o valor desejado ao atibuto.
     * @param field valor desejado para o atributo field.
     */
    public void setField(String field) {
        this.field = field;
    }

    /**
     *  getter do atributo need.
     * @return Needs - needs da Charity.
     */
    public Needs getNeeds() {
        return needs;
    }

    /**
     *  Setter de needs, atribui o valor desejado ao atibuto.
     * @param needs valor desejado para o atributo needs.
     */
    public void setNeeds(Needs needs) {
        this.needs = needs;
    }

    /**
     *  getter do atributo webpage.
     * @return String - webpage da Charity.
     */
    public String getWebpage() {
        return webpage;
    }

    /**
     *  Setter de webpage, atribui o valor desejado ao atibuto.
     * @param webpage valor desejado para o atributo webpage.
     */
    public void setWebpage(String webpage) {
        this.webpage = webpage;
    }

    /**
     *  getter do atributo description.
     * @return String - descrioption da Charity.
     */
    public String getDescription() {
        return description;
    }

    /**
     *  Setter de description, atribui o valor desejado ao atibuto.
     * @param description valor desejado para o atributo description.
     */
    public void setDescription(String description) {
        this.description = description;
    }
}
