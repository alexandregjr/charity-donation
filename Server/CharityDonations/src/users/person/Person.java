package users.person;

import users.User;

/**
 *  Classe que define os atributos e metodos de um Person especificando nome, cpf, email, etc.
 */
public class Person extends User {
    private String cpf;

    /**
     * Constructor da classe Person, simplesmente iniciliza seus atributos;
     */
    public Person() {
        cpf = "";
    }

    /**
     *  getter do atributo cpf.
     * @return String - cpf do Person.
     */
    public String getCpf() {
        return cpf;
    }

    /**
     *  Setter de cpf, atribui o valor desejado ao atibuto.
     * @param cpf valor desejado para o atributo cpf.
     */
    public void setCpf(String cpf) {
        this.cpf = cpf;
    }
}
