package users.person;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public final class PersonDAO {
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

    public static boolean insertPerson(Person p){
        Connection con = PersonDAO.connectDB();
        if(con == null) return false;
        boolean ret = false;
        try {
            con.createStatement().executeUpdate("insert into users.person (cpf, name, email, address) " +
                    "values('" + p.getCpf() + "', '" + p.getName() + "', '" + p.getEmail()+ "', '" +
                    p.getAddress() + "');");
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
