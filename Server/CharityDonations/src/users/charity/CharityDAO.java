package users.charity;

import needs.Item;
import needs.Needs;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public final class CharityDAO {

    private static Connection connectDB(){
        Connection con;
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            con = DriverManager.getConnection(
                    "jdbc:mysql://localhost:3306/users", "root", "databasecharity");
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
            con.createStatement().executeUpdate("insert into users.charity (cnpj, field, webpage, name, email, address) " +
                    "values('" + c.getCnpj() + "', '" + c.getField() + "', '" + c.getWebpage()+ "', '" +
                    c.getName() + "', '" + c.getEmail() + "', '" + c.getAddress() + "');");
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
                con.createStatement().executeUpdate("insert into users.needs " +
                        "values(" + charityId + ", '" + i.getId() + "', '" + i.getName() + "', '" +
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
}
