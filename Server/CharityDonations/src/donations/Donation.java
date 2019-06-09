package donations;

import needs.Item;
import users.User;
import users.charity.Charity;

public class Donation {
    private int id;
    private User donor;
    private Charity receiver;
    private Item donation;

    public Donation() {
        this.donor = new User();
        this.receiver = new Charity();
        this.donation = new Item();
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public User getDonator() {
        return donor;
    }

    public void setDonator(User donator) {
        this.donor = donator;
    }

    public Charity getReceiver() {
        return receiver;
    }

    public void setReceiver(Charity receiver) {
        this.receiver = receiver;
    }

    public Item getDonation() {
        return donation;
    }

    public void setDonation(Item donation) {
        this.donation = donation;
    }
}
