package users.person;

import java.sql.*;

/**
 *  Classe responsavel pela conexao com o banco de dados para resgatar e escrever informações
 *  relacionadas a Person.
 */
public final class PersonDAO {

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
     * Metodo que cria uma Person a partir de um ResultSet.
     * @param rs ResultSet com as infromações da Person buscada.
     * @return Person - objeto Person criado pela função.
     */
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

    /**
     * Metodo responsavel pela inserção de um objeto da classe Person no banco de dados.
     * @param p Person a ser inserida no banco de dados.
     * @return boolean - indicando se a inserção foi bem sucedida (true) ou nao (false).
     */
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
