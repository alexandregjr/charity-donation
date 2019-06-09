package users.person;

import users.User;

public class Person extends User {
    private String cpf;

    public Person() {
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }
}
