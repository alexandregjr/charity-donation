package users;

/**
 *  Classe que define os atributos e metodos de um User especificando nome, email, username, etc.
 */
public class User {
    private int id;
    private String name;
    private String email;
    private String address;
    private String username;
    private String password;

    /**
     * Constructor da classe User, simplesmente iniciliza seus atributos;
     */
    public User() {
        this.name = "";
        this.email = "";
        this.address = "";
        this.username = "";
        this.password = "";
    }


    /**
     *  getter do atributo username.
     * @return String - username do User.
     */
    public String getUsername() {
        return username;
    }

    /**
     *  Setter de username, atribui o valor desejado ao atibuto.
     * @param username valor desejado para o atributo username.
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     *  getter do atributo password.
     * @return String - password do User.
     */
    public String getPassword() {
        return password;
    }

    /**
     *  Setter de password, atribui o valor desejado ao atibuto.
     * @param password valor desejado para o atributo password.
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     *  getter do atributo id.
     * @return int - id do User.
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
     *  getter do atributo name.
     * @return String - name do User.
     */
    public String getName() {
        return name;
    }

    /**
     *  Setter de name, atribui o valor desejado ao atibuto.
     * @param name valor desejado para o atributo name.
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     *  getter do atributo email.
     * @return String - email do User.
     */
    public String getEmail() {
        return email;
    }

    /**
     *  Setter de email, atribui o valor desejado ao atibuto.
     * @param email valor desejado para o atributo email.
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     *  getter do atributo address.
     * @return String - address do User.
     */
    public String getAddress() {
        return address;
    }

    /**
     *  Setter de address, atribui o valor desejado ao atibuto.
     * @param address valor desejado para o atributo address.
     */
    public void setAddress(String address) {
        this.address = address;
    }
}
