package users.charity;

import donations.Donation;
import filter.Filter;
import needs.Item;
import needs.Needs;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.nio.ByteBuffer;
import java.sql.*;
import java.util.ArrayList;

public final class CharityDAO {

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

    public static boolean insertCharity(Charity c){
        Connection con = CharityDAO.connectDB();
        if(con == null) return false;
        boolean ret = false;
        try {
            PreparedStatement stm = con.prepareStatement(
                    "INSERT INTO charityDonation.charity (cnpj, field, webpage, name, email, address, username, password, description) " +
                            "values(?, ?, ?, ?, ?, ?, ?, ?, ?);");
            stm.setString(1, c.getCnpj());
            stm.setString(2, c.getField());
            stm.setString(3, c.getWebpage());
            stm.setString(4, c.getName());
            stm.setString(5, c.getEmail());
            stm.setString(6, c.getAddress());
            stm.setString(7, c.getUsername());
            stm.setString(8, c.getPassword());
            stm.setString(9, c.getDescription());
            stm.executeUpdate();

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

    public static boolean insertNeeds(Needs n, int charityId){
        Connection con = CharityDAO.connectDB();
        if(con == null) return false;
        boolean ret = false;
        for(Item i : n.getNeeds()){
            try {
                con.createStatement().executeUpdate("insert into charityDonation.needs " +
                        "(charity, name, description, amount) " +
                        "values(" + charityId + ", '" + i.getName() + "', '" +
                        i.getDescription() + "', " + i.getAmount() + ");");
                ret = true;
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        try {
            con.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return ret;
    }

    public static boolean insertPhoto(String path, int charityID){
        Connection con = CharityDAO.connectDB();
        if(con == null) return false;
        boolean ret = false;

        try {
            PreparedStatement stm = con.prepareStatement("INSERT INTO charityDonation.photos " +
                    "(charity, path) values (?, ?);");
            stm.setString(1, "" + charityID);
            stm.setString(2, path);
            stm.executeUpdate();
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

    public static boolean updateDescription(String desc, int id){
        Connection con = connectDB();
        if(con == null) return false;
        boolean ret = false;
        try {
            PreparedStatement stm = con.prepareStatement("update charityDonation.charity" +
                    " set description = ?" +
                    " where id = ?;");
            stm.setString(1, desc);
            stm.setString(2, "" + id);
            stm.executeUpdate();
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

    private static Needs getNeeds(int id, Connection con){
        Needs ret = new Needs();
        ResultSet rs = null;
        ArrayList<Item> needsArray = new ArrayList<>();
        try {
            rs = con.createStatement().executeQuery("select * from charityDonation.needs " +
                    "where charity = " + id + ";");
            rs.beforeFirst();
            if(!rs.next()){
                ret.setNeeds(needsArray);
                return ret;
            }
        } catch (SQLException e) {
            ret.setNeeds(needsArray);
            e.printStackTrace();
            return ret;
        }
        try {
            rs.beforeFirst();
            while(rs.next()){
                Item i = new Item();
                i.setId(rs.getInt("id"));
                i.setDescription(rs.getString("description"));
                i.setName(rs.getString("name"));
                i.setAmount(rs.getInt("amount"));
                needsArray.add(i);
            }
        } catch (SQLException e) {
            ret.setNeeds(needsArray);
            e.printStackTrace();
            return ret;
        }

        ret.setNeeds(needsArray);
        return ret;
    }

    public static Charity setCharityValuesFromResultSet(ResultSet rs, Connection con){
        Charity ret = new Charity();
        try {
            ret.setId(rs.getInt("id"));
            ret.setDescription(rs.getString("description"));
            ret.setWebpage(rs.getString("webpage"));
            ret.setName(rs.getString("name"));
            ret.setEmail(rs.getString("email"));
            ret.setField(rs.getString("field"));
            ret.setAddress(rs.getString("address"));
            ret.setNeeds(CharityDAO.getNeeds(ret.getId(), con));

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return ret;
    }

    public static Item setItemValuesFromResultSet(ResultSet rs){
        Item i = new Item();
        try {
            rs.beforeFirst();
            rs.next();
            i.setAmount(rs.getInt("amount"));
            i.setName(rs.getString("name"));
            i.setDescription(rs.getString("description"));
            i.setId(rs.getInt("id"));
            return i;
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    public static Charity getCharity(int id){
        Connection con = connectDB();
        if(con == null) return null;
        ResultSet rs = null;

        try {
            rs = con.createStatement().executeQuery("Select * from charityDonation.charity " +
                    "where id = " + id + ";");
        } catch (SQLException e) {
            try {
                con.close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
            e.printStackTrace();
            return null;
        }

        try {
            rs.beforeFirst();
            if(!rs.next()){
                con.close();
                return null;
            }
        } catch (SQLException e) {
            try {
                con.close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
            e.printStackTrace();
            return null;
        }

        Charity ret;

        try {
            rs.beforeFirst();
            rs.next();
            ret = CharityDAO.setCharityValuesFromResultSet(rs, con);
        } catch (SQLException e) {
            try {
                con.close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
            e.printStackTrace();
            return null;
        }

        try {
            con.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return ret;
    }

    public static ArrayList<Charity> getCharities(Filter f){
        Connection con = CharityDAO.connectDB();
        if(con == null) return null;
        ResultSet rs = null;
        //System.out.println(" f: " + f);

        try {
            PreparedStatement stm;
            if(f.getKey().equals("") || f.getKey() == null){
                //System.out.println("null");
                stm = con.prepareStatement("select * from " +
                        "charityDonation.charity;");

            } else {
                System.out.println("not null");
                stm = con.prepareStatement("select * from " +
                        "charityDonation.charity where " + f.getKey() + " = ?;");
                stm.setString(1, f.getValue());
                System.out.println(stm);
            }
            rs = stm.executeQuery();
        } catch (SQLException e) {
            try {
                con.close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
            e.printStackTrace();
            return null;
        }

        ArrayList<Charity> charityList = new ArrayList<>();
        try {
            rs.beforeFirst();
            while (rs.next()){
                Charity c = CharityDAO.setCharityValuesFromResultSet(rs, con);
                System.out.println(c);
                charityList.add(c);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        try {
            con.close();
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        //System.out.println("return");
//        for(Charity i : charityList){
//            System.out.println(i);
//        }
        return charityList;
    }

    public static Needs getCharityNeeds(int id){
        Connection con = CharityDAO.connectDB();
        Needs needs = getNeeds(id, con);
        try {
            con.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return needs;
    }

    private static  ArrayList<ByteBuffer> getByteArrayFromResultSet(ResultSet rs){
        ArrayList<ByteBuffer> bt = new ArrayList<>();
        try {
            rs.beforeFirst();
            while (rs.next()){
                String path = rs.getString("path");
                BufferedImage bi = ImageIO.read(new File(path));
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                ImageIO.write(bi, "png", baos);
                bt.add(ByteBuffer.wrap(baos.toByteArray()));
            }
            return bt;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static  ArrayList<ByteBuffer> getPhotos(int id){
        Connection con = connectDB();
        if(con == null) return null;
        ResultSet rs;
        ArrayList<ByteBuffer> ret = null;
        try {
            rs = con.createStatement().executeQuery("select photos.path from charityDonation.photos " +
                    "where charity = " + id + ";");
            ret = CharityDAO.getByteArrayFromResultSet(rs);
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

    public static boolean decreaseNeeds(Donation d, int id){
        Connection con = connectDB();
        boolean ret = false;
        try {
            con.createStatement().executeUpdate("update charitydonation.needs " +
                    "set amount = amount - " + d.getAmount() +"" +
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
        return  ret;
    }


}

