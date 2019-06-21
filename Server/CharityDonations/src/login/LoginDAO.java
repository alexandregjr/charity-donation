package login;

import users.User;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;

/**
 *  Classe responsavel pela conexao com o banco de dados para resgatar e escrever informações
 *  relacionadas a logins de Users.
 */
public final class LoginDAO {

    /**
     * methodo que inicia uma conexao com o banco de dados.
     * @return Connection -  resultante da conexão (null se houver falha).
     */
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

    /**
     * Metodo que realiza o login, verificando se o usuario e a senha estão corretos.
     * @param user User que deseja realizar login
     * @param userType String[] userType usada para retornar o tipo do User que realizou login.
     * @return int identificador do User, caso consiga logar, e -1, caso falhe.
     */
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
