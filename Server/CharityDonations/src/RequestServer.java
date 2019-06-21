import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import donations.Donation;
import donations.DonationDAO;
import filter.Filter;
import login.LoginDAO;
import needs.Needs;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;
import request.Request;
import request.RequestType;
import users.User;
import users.charity.Charity;
import users.charity.CharityDAO;
import users.person.Person;
import users.person.PersonDAO;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.UUID;

/**
 *  Classe responsavel pela conexao entre o cliente e o servidor.
 */
public class RequestServer extends WebSocketServer {

    ArrayList<Integer> idsPhotos = new ArrayList<>();

    /**
     * Constructor da classe Request Server, liga RequestServer a um port,
     * a partir de então esperando por uma conexão.
     * @param port Porto ao qual RequestServer eh conectado.
     */
    public RequestServer(int port) {
        super(new InetSocketAddress(port));
        System.out.println("Waiting for connections...");
    }

    /**
     * Metodo que eh executado quando uma nova conexão eh aberta.
     * @param webSocket WebSocket conexão com o Client.
     * @param clientHandshake ClientHandshake handshake realizado com o client.
     */
    @Override
    public void onOpen(WebSocket webSocket, ClientHandshake clientHandshake) {
        System.out.println("New connection from: " + webSocket.getRemoteSocketAddress().getAddress().getHostAddress());
    }

    /**
     * Metodo que eh executado quando uma conexão eh fechada.
     * @param webSocket WebSocket conexão com Client.
     * @param code int codigo de saida.
     * @param cause String causa da finalização.
     * @param remote boolean indicando se o fechamento foi remoto ou não.
     */
    @Override
    public void onClose(WebSocket webSocket, int code, String cause, boolean remote) {
        System.out.println("Connection closed");
    }

    /**
     * Metodo que eh executado quando o servidor recebe uma mensagem do cliente.
     * @param webSocket WebSocket conexão com Client.
     * @param message String mensagem recebida.
     */
    @Override
    public void onMessage(WebSocket webSocket, String message) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            Request request = mapper.readValue(message, Request.class);

            System.out.println(request);
            switch (request.getType()) {
                case CHARITY: // request id -2
                    charityResponse(request, webSocket);
                    break;
                case CHARITIES: // request id -3
                    charitiesResponse(request, webSocket);
                    break;
                case DONATE:    // request id -4
                    donateResponse(request, webSocket);
                    break;
                case DONATIONS_MADE:   // request id -5
                    donationsMadeResponse(request, webSocket);
                    break;
                case DONATIONS_RECEIVED: // request id -6
                    donationsReceivedResponse(request, webSocket);
                    break;
                case NEEDING: // request id -7
                    needingResponse(request, webSocket);
                    break;
                case NEEDS: // request id -8
                    needsResponse(request, webSocket);
                    break;
                case REGISTER_CHARITY: // request id -9
                    registerCharityResponse(request, webSocket);
                    break;
                case REGISTER_PERSON: // request id -10
                    registerPersonResponse(request, webSocket);
                    break;
                case VALIDATE_DONATION: // request id -11
                    validateDonationResponse(request, webSocket);
                    break;
                case PHOTO: // request id -12
                    this.idsPhotos.add(request.getId());
                    break;
                case UPDATE_DESCRIPTION: // request id -13
                    updateCharityDescription(request, webSocket);
                    break;
                case LOGIN: // request id -1
                    loginUser(request, webSocket);
                    break;
                /*case DEBUG:
                    debugResponse(request, webSocket);
                    break;*/
                default:

                    break;
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * Metodo que eh executado quando o servidor recebe uma mensagem do cliente.
     * @param conn WebSocket conexão com Client.
     * @param message ByteBuffer mensagem recebida.
     */
    @Override
    public void onMessage(WebSocket conn, ByteBuffer message) {
        System.out.println(Thread.currentThread().getName());

        System.out.println("Binary message");

        UUID uuid = UUID.randomUUID();
        int charity = idsPhotos.remove(0);

        String path = "resources/ch" + charity + "id" +uuid.toString() + ".png";

        FileOutputStream fos = null;
        try {
            fos = new FileOutputStream(path);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        if (fos == null) return;

        while (message.hasRemaining()) {
            try {
                fos.write(message.get());
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        Request response = new Request();
        //SAVE PHOTOS PATH AND CHARITY ID JUST LIKE NEEDS
        if(CharityDAO.insertPhoto(path, charity)){
            response.setMessage("Photo insertion succeeded");
            response.setType(RequestType.SUCCESS);
        } else {
            response.setMessage("Photo insertion faild");
            response.setType(RequestType.FAIL);
        }

        response.setId(-12);

        String rJson = null;
        ObjectMapper mapper = new ObjectMapper();
        try {
            rJson = mapper.writeValueAsString(response.getMessage());
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        conn.send(rJson);
    }

    /**
     * Metodo chamado pelo Server para requisitar uma operação de carregamento de um
     * objeto Charity, cujo id esta definido em request.id, do banco de dados.
     * @param request Request contendo as informações do requerimento feito pelo Client.
     * @param connection WebSocket conexço com o Client, para onde a resposta deve ir.
     */
    private void charityResponse(Request request, WebSocket connection) {
        ObjectMapper mapper = new ObjectMapper();
        Request response = new Request();
        Charity c = CharityDAO.getCharity(request.getId());
        if(c == null){
            response.setType(RequestType.FAIL);
            response.setMessage("Error: Could not get desired Charity\n");
        } else {
            response.setType(RequestType.SUCCESS);
            try {
                response.setMessage(mapper.writeValueAsString(c));
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        }

        response.setId(-2);

        String rJson = null;
        try {
            rJson = mapper.writeValueAsString(response);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        // SEND THE RESPONSE
        connection.send(rJson);

        ArrayList<ByteBuffer> imgs = CharityDAO.getPhotos(request.getId());
        for(ByteBuffer i: imgs){
            System.out.println("Sending Image");
            connection.send(i);
        }
    }

    /**
     * Metodo chamado pelo Server para requisitar uma operação de carregamento de uma
     * lista de objetos do tipo Charity, que condizam com a busca realizada sobre um Filter
     * definido em request.message, do banco de dados.
     * @param request Request contendo as informações do requerimento feito pelo Client.
     * @param connection WebSocket conexão com o Client, para onde a resposta deve ir.
     */
    private void charitiesResponse(Request request, WebSocket connection) {
        ObjectMapper mapper = new ObjectMapper();
        Request response = new Request();
        Filter f = null;
        ArrayList<Charity> charityList = null;
        try {
             f = mapper.readValue(request.getMessage(), Filter.class);
            charityList = CharityDAO.getCharities(f);
            if(charityList == null){
                response.setType(RequestType.FAIL);
                response.setMessage("Error: Could not get desired Charity List");
            } else {
                response.setType(RequestType.SUCCESS);
                response.setMessage(mapper.writeValueAsString(charityList));
            }
        } catch (IOException e) {
            response.setType(RequestType.FAIL);
            response.setMessage("Error: Could not get desired Charity List");
            return;
        }

        response.setId(-3);
        // WRITE DATA IN JSON STRING
        String rJson = null;
        try {
            rJson = mapper.writeValueAsString(response);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        // SEND THE RESPONSE
        connection.send(rJson);
    }

    /**
     * Metodo chamado pelo Server para requisitar uma operação de inserção de uma
     * nova Donation, definido em request.message, cujo tipo esta em request.id, no banco de dados.
     * @param request Request contendo as informações do requerimento feito pelo Client.
     * @param connection WebSocket conexão com o Client, para onde a resposta deve ir.
     */
    private void donateResponse(Request request, WebSocket connection) {
        ObjectMapper mapper = new ObjectMapper();
        Request response = new Request();
        // CREATE A NEW DONATION TO CHARITY (ID VALUE) IN THE DB
        // CONTENT OF DONATION IS IN MESSAGE VALUE (JSON)
        try {
            Donation d = mapper.readValue(request.getMessage(), Donation.class);
            if(DonationDAO.insertDonation(d, request.getId())) {
                response.setType(RequestType.SUCCESS);
                response.setMessage("Donation insertion succeeded");
                if(CharityDAO.decreaseNeeds(d, request.getId())){
                    response.setType(RequestType.SUCCESS);
                    response.setMessage("Donation insertion succeeded");
                } else {
                    response.setType(RequestType.SUCCESS);
                    response.setMessage("Donation insertion succeeded");
                }
            } else {
                response.setType(RequestType.SUCCESS);
                response.setMessage("Donation insertion succeeded");
            }

            response.setId(-4);
        } catch (IOException e) {
            response.setType(RequestType.FAIL);
            response.setMessage("Donation insertion failed");
            e.printStackTrace();
        }

        // WRITE DATA IN JSON STRING
        String rJson = null;
        try {
            rJson = mapper.writeValueAsString(response);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        // SEND 'OK' STATUS IF INSERTION ON DB WENT FINE,
        // OR 'ERROR' IF THERE WAS AN ERROR
        connection.send(rJson);
    }

    /**
     * Metodo chamado pelo Server para requisitar uma operação de carregamento de uma
     * lista de objetos do tipo Donations, contendo Donations realizadas pelo
     * User com id definido em request.id e tipo definido em request.message, do banco de dados.
     * @param request Request contendo as informações do requerimento feito pelo Client.
     * @param connection WebSocket conexão com o Client, para onde a resposta deve ir.
     */
    private void donationsMadeResponse(Request request, WebSocket connection) {
        ObjectMapper mapper = new ObjectMapper();
        Request response = new Request();
        // GET DONATIONS MADE BY AN USER (ID VALUE)
        ArrayList donations = DonationDAO.getDonationsMade(request.getId(), request.getMessage());
        if(donations == null){
            response.setType(RequestType.FAIL);
            response.setMessage("Error: Could not make desired Donation List\n");
        } else {
            response.setType(RequestType.SUCCESS);
            try {
                response.setMessage(mapper.writeValueAsString(donations));
            } catch (JsonProcessingException e) {
                e.printStackTrace();
                response.setType(RequestType.FAIL);
                response.setMessage("Error: Could not make desired Donation List\n");
            }
        }

        response.setId(-5);

        // WRITE DATA IN JSON STRING
        String rJson = null;
        try {
            rJson = mapper.writeValueAsString(response);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        // SEND THE RESPONSE
        connection.send(rJson);
    }

    /**
     * Metodo chamado pelo Server para requisitar uma operação de carregamento de uma
     * lista de objetos do tipo Donations, contendo Donations recebidas pela Charity com id definido em request.id,
     * do banco de dados.
     * @param request Request contendo as informações do requerimento feito pelo Client.
     * @param connection WebSocket conexão com o Client, para onde a resposta deve ir.
     */
    private void donationsReceivedResponse(Request request, WebSocket connection) {
        ObjectMapper mapper = new ObjectMapper();
        Request response = new Request();
        // GET DONATIONS MADE BY AN USER (ID VALUE)
        ArrayList donations = DonationDAO.getDonationsReceived(request.getId());
        if(donations == null){
            response.setType(RequestType.FAIL);
            response.setMessage("Error: Could not make desired Donation List\n");
        } else {
            response.setType(RequestType.SUCCESS);
            try {
                response.setMessage(mapper.writeValueAsString(donations));
            } catch (JsonProcessingException e) {
                e.printStackTrace();
                response.setType(RequestType.FAIL);
                response.setMessage("Error: Could not make desired Donation List\n");
            }
        }

        response.setId(-6);

        // WRITE DATA IN JSON STRING
        String rJson = null;
        try {
            rJson = mapper.writeValueAsString(response);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        // SEND THE RESPONSE
        connection.send(rJson);
    }

    /**
     * Metodo chamado pelo Server para requisitar uma operação de carregamento de um
     * objeto Needs, pertencente a uma Charity cujo id esta especificado em request.id,
     * do banco de dados.
     * @param request Request contendo as informações do requerimento feito pelo Client.
     * @param connection WebSocket conexão com o Client, para onde a resposta deve ir.
     */
    private void needsResponse(Request request, WebSocket connection) {
        ObjectMapper mapper = new ObjectMapper();
        Request response = new Request();
        // GET NEEDS OF A CHARITY (ID VALUE)

        Needs needs = CharityDAO.getCharityNeeds(request.getId());
        if(needs == null){
            response.setMessage("Error: Could not get desired Needs");
            request.setType(RequestType.FAIL);
        } else {
            request.setType(RequestType.SUCCESS);
            try {
                response.setMessage(mapper.writeValueAsString(needs));
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        }

        response.setId(-8);

        // WRITE DATA IN JSON STRING
        String rJson = null;
        try {
            rJson = mapper.writeValueAsString(response);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        // SEND THE RESPONSE
        connection.send(rJson);
    }

    /**
     * Metodo chamado pelo Server para requisitar uma operação de login de um User,
     * com senha definida em request.message e o tipo do usuario definido em request.id.
     * @param request Request contendo as informações do requerimento feito pelo Client.
     * @param conn WebSocket conexão com o Client, para onde a resposta deve ir.
     */
    private void loginUser(Request request, WebSocket conn){
        ObjectMapper mapper = new ObjectMapper();
        Request response = new Request();

        User u = null;
        String[] userType = new String[1];
        int connectedUserId;
        try {
            u = mapper.readValue(request.getMessage(), User.class);
            connectedUserId = LoginDAO.login(u, userType);
            if(connectedUserId == -1){
                response.setId(-1);
                response.setType(RequestType.FAIL);
                if(userType[0].equals("null")) response.setMessage("Error: Could not complete User Login");
                else if(userType[0].equals("none")) response.setMessage("Erros: User does not exist");
                else if(userType[0].equals("invalidPassword")) response.setMessage("Error: Invalid Password");
            } else {
                response.setType(RequestType.SUCCESS);
                response.setMessage(userType[0]);
                response.setId(connectedUserId);
            }
        } catch (IOException e) {
            response.setId(-1);
            response.setType(RequestType.FAIL);
            response.setMessage("Error: Could not complete User Login");
            e.printStackTrace();
        }


        String rJson = null;

        try {
            rJson = mapper.writeValueAsString(response);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        conn.send(rJson);
    }

    /**
     * Metodo chamado pelo Server para requisitar uma operação de inserção de um
     * novo Needs, definido em request.message, pertencente a Charity cujo id esta em request.id,
     * no banco de dados.
     * @param request Request contendo as informações do requerimento feito pelo Client.
     * @param connection WebSocket conexão com o Client, para onde a resposta deve ir.
     */
    private void needingResponse(Request request, WebSocket connection) {
        ObjectMapper mapper = new ObjectMapper();
        Request response = new Request();
        try {
            Needs n = mapper.readValue(request.getMessage(), Needs.class);
            if(CharityDAO.insertNeeds(n, request.getId())){
                response.setMessage("Need insertion succeeded");
                response.setType(RequestType.SUCCESS);
            } else {
                response.setMessage("Need insertion failed");
                response.setType(RequestType.FAIL);
            }
        } catch (IOException e) {
            e.printStackTrace();
            response.setMessage("Need insertion failed");
            response.setType(RequestType.FAIL);
        }
        // CREATE NEW NEEDS FOR A CHARITY (ID VALUE) IN THE DB
        // CONTENT OF NEEDS IS IN MESSAGE VALUE (JSON)

        response.setId(-7);

        // WRITE DATA IN JSON STRING
        String rJson = null;
        try {
            rJson = mapper.writeValueAsString(response);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        // SEND 'OK' STATUS IF INSERTION ON DB WENT FINE,
        // OR 'ERROR' IF THERE WAS AN ERROR
        connection.send(rJson);
    }

    /**
     * Metodo chamado pelo Server para requisitar uma operação de inserção de um
     * novo Person, especificado no request.message, no banco de dados.
     * @param request Request contendo as informações do requerimento feito pelo Client.
     * @param connection WebSocket conexão com o Client, para onde a resposta deve ir.
     */
    private void registerPersonResponse(Request request, WebSocket connection) {
        ObjectMapper mapper = new ObjectMapper();
        Request response = new Request();
        try {
            Person p = mapper.readValue(request.getMessage(), Person.class);
            if(PersonDAO.insertPerson(p)) {
                response.setMessage("Person creation succeeded");
                response.setType(RequestType.SUCCESS);
            }else{
                response.setMessage("Person creation failed");
                response.setType(RequestType.FAIL);
            }
        } catch (IOException e) {
            e.printStackTrace();
            response.setMessage("Charity creation failed");
            response.setType(RequestType.FAIL);
        }

        response.setId(-10);

        // WRITE DATA IN JSON STRING
        String rJson = null;
        try {
            rJson = mapper.writeValueAsString(response);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        // SEND 'OK' STATUS IF INSERTION ON DB WENT FINE,
        // OR 'ERROR' IF THERE WAS AN ERROR
        connection.send(rJson);
    }


    /**
     * Metodo chamado pelo Server para requisitar uma operação de inserção de um
     * novo Charity, especificado no request.message, no banco de dados.
     * @param request Request contendo as informações do requerimento feito pelo Client.
     * @param connection WebSocket conexão com o Client, para onde a resposta deve ir.
     */
    private void registerCharityResponse(Request request, WebSocket connection) {
        ObjectMapper mapper = new ObjectMapper();
        Request response = new Request();
        try {
            Charity c = mapper.readValue(request.getMessage(), Charity.class);
            if(CharityDAO.insertCharity(c)) {
                response.setMessage("Charity creation succeeded");
                response.setType(RequestType.SUCCESS);
            }else{
                response.setMessage("Charity creation failed");
                response.setType(RequestType.FAIL);
            }
        } catch (IOException e) {
            e.printStackTrace();
            response.setMessage("Charity creation failed");
            response.setType(RequestType.FAIL);
        }

        response.setId(-9);
        // WRITE DATA IN JSON STRING
        String rJson = null;
        try {
            rJson = mapper.writeValueAsString(response);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        // SEND 'OK' STATUS IF INSERTION ON DB WENT FINE,
        // OR 'ERROR' IF THERE WAS AN ERROR
        connection.send(rJson);
    }

    /**
     * Metodo chamado pelo Server para requisitar uma operação de validação de uma
     * Donation cujo id esta especificado em request.id.
     * @param request Request contendo as informações do requerimento feito pelo Client.
     * @param connection WebSocket conexão com o Client, para onde a resposta deve ir.
     */
    private void validateDonationResponse(Request request, WebSocket connection) {
        ObjectMapper mapper = new ObjectMapper();
        Request response = new Request();
        // CHANGE THE DONATION (ID VALUE) TO RECEIVED
        if(DonationDAO.validate(request.getId())){
            response.setType(RequestType.SUCCESS);
            response.setMessage("Donation validation succeeded");
        } else {
            response.setType(RequestType.FAIL);
            response.setMessage("Donation validation faild");
        }

        response.setId(-11);

        // WRITE DATA IN JSON STRING
        String rJson = null;
        try {
            rJson = mapper.writeValueAsString(response);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        // SEND 'OK' STATUS IF UPDATE ON DB WENT FINE,
        // OR 'ERROR' IF THERE WAS AN ERROR
        connection.send(rJson);
    }

   /*
    private void debugResponse(Request request, WebSocket connection) {
        ObjectMapper mapper = new ObjectMapper();

        String rJson = null;
        try {
            rJson = mapper.writeValueAsString(request);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        System.out.println(rJson);
        connection.send(rJson);
    }*/

    /**
     * Metodo chamado pelo Server para requisitar uma operação de atualização da descrição,
     * especificada no request.message, de uma Charity, especificada no request.id, no banco de dados.
     * @param request Request contendo as informações do requerimento feito pelo Client.
     * @param connection WebSocket conexão com o Client, para onde a resposta deve ir.
     */
    private void updateCharityDescription(Request request, WebSocket connection){
        ObjectMapper mapper = new ObjectMapper();
        Request response = new Request();
        String desc = request.getMessage();
        if(CharityDAO.updateDescription(desc, request.getId())){
            response.setType(RequestType.SUCCESS);
            response.setMessage("Description update succeeded");
        } else {
            response.setType(RequestType.FAIL);
            response.setMessage("Description update failed");
        }

        response.setId(-13);


        String rJson = null;
        try {
            rJson = mapper.writeValueAsString(response);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        connection.send(rJson);
    }

    /**
     * Metodo que eh executado quando uma erro ocorre.
     * @param webSocket WebSocket conexão com o cliente.
     * @param e Exception causa do erro.
     */
    @Override
    public void onError(WebSocket webSocket, Exception e) {
        System.out.println("Error:");
        System.out.println(e.getMessage());
        //System.out.println("From " + webSocket.getRemoteSocketAddress().getAddress().getHostAddress());
    }

    /**
     * Metodo main, simplesmente inicializa a coneção do RequestServer.
     * @param args Srting[] argumentos passados para main.
     */
    public static void main(String[] args) {
        new RequestServer(9000).start();
    }
}
