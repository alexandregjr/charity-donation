package donations;

import needs.Item;
import request.RequestType;
import users.User;
import users.charity.Charity;
import users.charity.CharityDAO;
import users.person.Person;
import users.person.PersonDAO;

import java.sql.*;
import java.util.ArrayList;

public final class DonationDAO {
    private static Connection connectDB(){
        Connection con;
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            con = DriverManager.getConnection(
                    "jdbc:mysql://localhost:3306/charityDonation", "root", "charityRoot123");
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
        return con;
    }

    public static boolean insertDonation(Donation d, int donorType){
        Connection con = connectDB();
        if(con == null) return false;
        boolean ret = false;
        ResultSet rs = null;
        if(donorType == 0){ // user -> charity
            try {
                rs = con.createStatement().executeQuery(
                        "select id from charityDonation.person where id = " + d.getDonor().getId() + ";");
            } catch (SQLException e) {
                e.printStackTrace();
                try {
                    con.close();
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
                return false;
            }
        } else { // charity -> charity
            try {
                rs = con.createStatement().executeQuery(
                        "select id from charityDonation.charity where id = " + d.getDonor().getId() + ";");
            } catch (SQLException e) {
                e.printStackTrace();
                try {
                    con.close();
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
                return false;
            }
        }

        try {
            rs.beforeFirst();
            if(!rs.next()){
                con.close();
                return false;
            }
        } catch (SQLException e) {
            e.printStackTrace();
            try {
                con.close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
            return false;
        }

        try {
            PreparedStatement stm = con.prepareStatement("INSERT INTO charityDonation.donations " +
                    "(donor, receiver, itemID, donationType, status, amount) " +
                    "values(?, ?, ?, ?, ?, ?);");
            stm.setString(1, "" + d.getDonor().getId());
            stm.setString(2, "" + d.getReceiver().getId());
            stm.setString(3, "" + d.getDonation().getId());
            stm.setString(4, "" + donorType);
            stm.setString(5, "0");
            stm.setString(6, "" + d.getAmount());
            stm.executeUpdate();
            ret = true;
        } catch (SQLException e) {
            e.printStackTrace();
            ret = false;
        }

        try {
            con.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return ret;
    }

    private static ArrayList<Donation> getDonationFromResultSet(ResultSet rs, Connection con){
        ArrayList<Donation> ad = new ArrayList<>();
        try {
            rs.beforeFirst();
            while(rs.next()){
                Donation d = new Donation();
                if(rs.getInt("donationType") == 0){
                    ResultSet donorRS = con.createStatement().executeQuery("select * from " +
                            "charityDonation.person where id = " + rs.getInt("donor") + ";");
                    Person donor = PersonDAO.setPersonValuesFromResultSet(donorRS);
                    d.setDonor(donor);
                } else {
                    ResultSet donorRS = con.createStatement().executeQuery("select * from " +
                            "charityDonation.charity where id = " + rs.getInt("donor") + ";");
                    Charity donor = CharityDAO.setCharityValuesFromResultSet(donorRS, con);
                    d.setDonor(donor);
                }

                ResultSet receiverRS = con.createStatement().executeQuery("select * from " +
                        "charityDonation.charity where id = " + rs.getInt("receiver") +";");
                Charity receiver = CharityDAO.setCharityValuesFromResultSet(receiverRS, con);
                d.setReceiver(receiver);
                ResultSet itemRS = con.createStatement().executeQuery("select * from " +
                        "charityDonation.needs where id = " + rs.getInt("itemID") + ";");
                Item i = CharityDAO.setItemValuesFromResultSet(itemRS);
                d.setDonation(i);
                d.setAmount(rs.getInt("amount"));
                d.setId(rs.getInt("id"));
                d.setStatus(rs.getInt("status"));
                ad.add(d);
            }
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }

        return ad;
    }

    public static ArrayList<Donation> getDonationsMade(int donorId, String donorType){
        Connection con = connectDB();
        if(con == null) return null;
        ArrayList<Donation> ret = null;
        int type = donorType.equals("person") ? 0: 1;
        ResultSet rs;
        try {
            rs = con.createStatement().executeQuery("select * from charityDonation.donations " +
                    "where donor = " + donorId + " and donationType = " +
                    type + ";");

            ret = DonationDAO.getDonationFromResultSet(rs, con);
            con.close();
            return ret;
        } catch (SQLException e) {
            try {
                con.close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
            e.printStackTrace();
            return null;
        }

    }

    public static ArrayList<Donation> getDonationsReceived(int receiverId){
        Connection con = connectDB();
        if(con == null) return null;
        ArrayList<Donation> ret = null;
        ResultSet rs;
        try {
            rs = con.createStatement().executeQuery("select * from charityDonation.donations " +
                    "where receiver = " + receiverId + ";");

            ret = DonationDAO.getDonationFromResultSet(rs, con);
            con.close();
            return ret;
        } catch (SQLException e) {
            try {
                con.close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
            e.printStackTrace();
            return null;
        }

    }

    public static boolean validate(int id){
        Connection con = connectDB();
        boolean ret = false;
        try {
            con.createStatement().executeUpdate("update charityDonation.donations " +
                    "set status = " + 1 +
                    " where id = " + id + ";");
            ret = true;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        try {
            con.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return ret;
    }

}


