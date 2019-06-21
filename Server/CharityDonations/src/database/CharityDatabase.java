package database;


import donations.Donation;
import donations.DonationDAO;
import needs.Item;
import needs.Needs;
import users.charity.Charity;
import users.charity.CharityDAO;
import users.person.Person;

import java.util.ArrayList;

/**
 * Classe usada para debug do banco de bados.
 */
public class CharityDatabase {
    public static void main(String args[]) {
        Charity c = new Charity();
        c.setField("field");
        c.setAddress("address");
        c.setEmail("email");
        c.setName("name");
        c.setWebpage("webpage");
        c.setCnpj("cnpj");
        c.setUsername("user");
        c.setPassword("pass");
        c.setDescription("description");
        //CharityDAO.insertCharity(c);
        c.setDescription("description Updated");
        //CharityDAO.updateDescription(c.getDescription(), 5);

        Needs n = new Needs();
        Item i = new Item();
        i.setName("23");
        i.setAmount(2);
        i.setDescription("eh isso ai");
        Item j = new Item();
        j.setName("btata");
        j.setAmount(3);
        j.setDescription("nao eh memo");
        ArrayList<Item> ai = new ArrayList<>();
        ai.add(i);
        ai.add(j);
        n.setNeeds(ai);

        //CharityDAO.insertNeeds(n, 5);

        Donation d = new Donation();

        i.setId(4);
        d.setDonation(i);
        Person p = new Person();
        p.setId(3);
        d.setDonor(p);
        c.setId(6);
        d.setReceiver(c);
        DonationDAO.insertDonation(d, 0);

        Charity a = new Charity();


    }
}
