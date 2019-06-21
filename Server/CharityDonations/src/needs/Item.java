package needs;

/**
 *  Classe que define os atributos e metodos de um Item especificando descrição, quantidadee nome.
 */
public class Item {
    private int id;
    private String item;
    private String description;
    private int amount;

    /**
     * Constructor da classe Item, simplesmente iniciliza seus atributos;
     */
    public Item() {
        this.item = "";
        this.description = "";
        this.amount = 0;
    }

    /**
     *  getter do atributo id.
     * @return int - id do Item.
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
     * @return String - name do Item.
     */
    public String getName() {
        return item;
    }

    /**
     *  Setter de name, atribui o valor desejado ao atibuto.
     * @param name valor desejado para o atributo name.
     */
    public void setName(String name) {
        this.item = name;
    }

    /**
     *  getter do atributo description.
     * @return String - description do Item.
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

    /**
     *  getter do atributo amount.
     * @return int - amount do Item.
     */
    public int getAmount() {
        return amount;
    }

    /**
     *  Setter de amount, atribui o valor desejado ao atibuto.
     * @param amount valor desejado para o atributo amount.
     */
    public void setAmount(int amount) {
        this.amount = amount;
    }
}
