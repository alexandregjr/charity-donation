package donations;

import needs.Item;
import users.charity.Charity;
import users.charity.CharityDAO;
import users.person.Person;
import users.person.PersonDAO;

import java.sql.*;
import java.util.ArrayList;


/**
 *  Classe responsavel pela conexao com o banco de dados para resgatar e escrever informações
 *  relacionadas a Donations.
 */
public final class DonationDAO {

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
     * Metodo responsavel pela inserção de um objeto da classe Donation no banco de dados.
     * @param d Donation a ser inserida no banco de dados.
     * @param donorType Inteiro que define o tipo da doação<br>
     *                  (0 = Person to Charity)<br>
     *                  (1 = Charity to Charity).<br>
     * @return boolean - indicando se a inserção foi bem sucedida (true) ou nao (false).
     */
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

    /**
     * Metodo que cria uma lista de Donations a partir de um ResultSet e uma Connection com o
     * banco de dados.
     * @param rs ResultSet com as infromações das Donations buscadas.
     * @param con Connection com o banco de dados.
     * @return ArrayList(Donation) lista de Donations gerada pela função.
     */
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


    /**
     * Metodo que retorna uma lista de Donations feitas pelo id especificado,
     * carregadas a partir do banco de dados.
     * @param donorId int identificador do doador.
     * @param donorType int que define o tipo da doação<br>
     *      *                  (0 = Person to Charity)<br>
     *      *                  (1 = Charity to Charity).<br>
     * @return ArrayList(Donation) lista de Donations carregados do banco de daods.
     */
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

    /**
     * Metodo que retorna uma lista de Donations recebidas pelo id especificado,
     * carregadas a partir do banco de dados.
     * @param receiverId int identificador do doador.
     * @return ArrayList(Donation) lista de Donations carregados do banco de daods.
     */
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

    /**
     * Metodo que valida uma Donation como recebida, alterando seu status no banco de dados.
     * @param id int identificador da Donation que deseja-se validar.
     * @return boolean reportando se a operação foi bem sucedida (true) ou nao (false).
     */
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


