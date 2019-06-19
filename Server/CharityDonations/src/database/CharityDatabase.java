package database;


import needs.Needs;
import users.charity.Charity;
import users.charity.CharityDAO;
import users.person.Person;
import users.person.PersonDAO;

import java.sql.*;

import java.sql.DriverManager;

public class CharityDatabase {
    public static void main(String args[]) {
        Person p = new Person();
        p.setCpf("496.461.178-64");
        p.setName("Dudu");
        p.setAddress("Rua 14");
        p.setEmail("test@test.com");
        PersonDAO.insertPerson(p);
    }
}
