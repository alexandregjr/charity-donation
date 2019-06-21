package users.person;

import java.sql.*;

public final class PersonDAO {
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

    public static Person setPersonValuesFromResultSet(ResultSet rs){
        Person ret = new Person();
        try {
            rs.beforeFirst();
            rs.next();
            ret.setId(rs.getInt("id"));
            ret.setEmail(rs.getString("email"));
            ret.setAddress(rs.getString("address"));
            ret.setName(rs.getString("name"));
            return ret;
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    public static boolean insertPerson(Person p){
        Connection con = PersonDAO.connectDB();
        if(con == null) return false;
        boolean ret = false;
        ResultSet rs = null;
        try {
            rs = con.createStatement().executeQuery("SELECT id from charityDonation.charity " +
                    "where username = '" + p.getUsername() + "';");
        } catch (SQLException e) {
            try {
                con.close();
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
            e.printStackTrace();
            return false;
        }

        try {
            if(rs.next()){
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
            PreparedStatement stm = con.prepareStatement(
                    "INSERT INTO charityDonation.person (cpf, name, email, address, username, password) " +
                            "values(?, ?, ?, ?, ?, ?);");
            stm.setString(1, p.getCpf());
            stm.setString(2, p.getName());
            stm.setString(3, p.getEmail());
            stm.setString(4, p.getAddress());
            stm.setString(5, p.getUsername());
            stm.setString(6, p.getPassword());
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
}
