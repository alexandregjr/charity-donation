package login;

import users.User;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;

public final class LoginDAO {

    private static Connection connectDB(){
        Connection con;
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            con = DriverManager.getConnection(
                    "jdbc:mysql://localhost:3306/charityDonation", "root", "databasecharity");
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
        return con;
    }

    public static int login(User user, String[] userType){
        Connection con = connectDB();
        if(con == null) {
            userType[0] = "null";
            return -1;
        }
        ResultSet rs;
        try {
            rs = con.createStatement().executeQuery("select password, id from charityDonation.charity " +
                    "where username = '" + user.getUsername() + "';");
            rs.beforeFirst();
            if(!rs.next()){
                rs = con.createStatement().executeQuery("select password, id from " +
                        "charityDonation.person " +
                        "where username = '" + user.getUsername() + "';");
                rs.beforeFirst();
                if(!rs.next()){
                    userType[0] = "none";
                    return -1;
                } else {
                    if(rs.getString("password").equals(user.getPassword())){
                        userType[0] = "person";
                        return rs.getInt("id");
                    } else {
                        userType[0] = "invalidPassword";
                        return -1;
                    }
                }
            } else {
                if(rs.getString("password").equals(user.getPassword())){
                    userType[0] = "charity";
                    return rs.getInt("id");
                } else {
                    userType[0] = "invalidPassword";
                    return -1;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            userType[0] = "null";
            return -1;
        }
    }
}
