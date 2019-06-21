package donations;

import needs.Item;
import users.User;
import users.charity.Charity;


/**
 *  Classe que define os atributos e metodos de uma Donation especificando quantidade item doador
 *  e entidade favorecida.
 */
public class Donation {
    private int id;
    private User donor;
    private Charity receiver;
    private Item donation;
    private int status;
    private int amount;

    /**
     * Constructor da classe Donation, simplesmente iniciliza seus atributos;
     */
    public Donation() {
        this.donor = new User();
        this.receiver = new Charity();
        this.donation = new Item();
    }

    /**
     *  getter do atributo id.
     * @return int - id da Donation.
     */
    public int getId() {
        return id;
    }

    /**
     *  Setter de id, atribui o valor desejado ao atibuto.
     * @param id - valor desejado para o atributo id.
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     *  getter do atributo donor.
     * @return User - donor da Donation.
     */
    public User getDonor() {
        return donor;
    }

    /**
     *  Setter de donor, atribui o valor desejado ao atibuto.
     * @param donor - valor desejado para o atributo donor.
     */
    public void setDonor(User donor) {
        this.donor = donor;
    }

    /**
     *  getter do atributo receiver.
     * @return Charity - receiver da Donation.
     */
    public Charity getReceiver() {
        return receiver;
    }

    /**
     *  Setter de receiver, atribui o valor desejado ao atibuto.
     * @param receiver - valor desejado para o atributo receiver.
     */
    public void setReceiver(Charity receiver) {
        this.receiver = receiver;
    }

    /**
     *  getter do atributo donation.
     * @return Item - donation da Donation.
     */
    public Item getDonation() {
        return donation;
    }

    /**
     *  Setter de donation, atribui o valor desejado ao atibuto.
     * @param donation - valor desejado para o atributo donation.
     */
    public void setDonation(Item donation) {
        this.donation = donation;
    }

    /**
     *  getter do atributo status.
     * @return int - status da Donation.
     */
    public int getStatus() {
        return status;
    }

    /**
     *  Setter de status, atribui o valor desejado ao atibuto.
     * @param status - valor desejado para o atributo status.
     */
    public void setStatus(int status) {
        this.status = status;
    }

    /**
     *  getter do atributo amount.
     * @return int - amount da Donation.
     */
    public int getAmount() {
        return amount;
    }

    /**
     *  Setter de amount, atribui o valor desejado ao atibuto.
     * @param amount - valor desejado para o atributo amount.
     */
    public void setAmount(int amount) {
        this.amount = amount;
    }
}
