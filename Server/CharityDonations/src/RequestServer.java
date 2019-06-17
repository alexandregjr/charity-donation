import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import needs.Item;
import needs.Needs;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;
import request.Request;
import users.charity.Charity;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.ArrayList;

public class RequestServer extends WebSocketServer {

    public RequestServer(int port) {
        super(new InetSocketAddress(port));
        System.out.println("Waiting for connections...");
    }

    @Override
    public void onOpen(WebSocket webSocket, ClientHandshake clientHandshake) {
        System.out.println("New connection from: " + webSocket.getRemoteSocketAddress().getAddress().getHostAddress());
    }

    @Override
    public void onClose(WebSocket webSocket, int code, String cause, boolean remote) {
        System.out.println("Connection closed");
    }

    @Override
    public void onMessage(WebSocket webSocket, String message) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            Request request = mapper.readValue(message, Request.class);

            System.out.println(request);
            switch (request.getType()) {
                case CHARITY:
                    charityResponse(request, webSocket);
                    break;
                case CHARITIES:
                    charitiesResponse(request, webSocket);
                    break;
                case DONATE:
                    donateResponse(request, webSocket);
                    break;
                case DONATIONS_MADE:
                    donationsMadeResponse(request, webSocket);
                    break;
                case DONATIONS_RECEIVED:
                    donationsReceivedResponse(request, webSocket);
                    break;
                case NEEDING:
                    needingResponse(request, webSocket);
                    break;
                case NEEDS:
                    needsResponse(request, webSocket);
                    break;
                case REGISTER_CHARITY:
                    registerCharityResponse(request, webSocket);
                    break;
                case REGISTER_PERSON:
                    registerPersonPesponse(request, webSocket);
                    break;
                case VALIDATE_DONATION:
                    validateDonationResponse(request, webSocket);
                    break;
                case DEBUG:
                    debugResponse(request, webSocket);
                    break;
                default:

                    break;
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void charityResponse(Request request, WebSocket connection) {
        ObjectMapper mapper = new ObjectMapper();
        Request response = new Request();
        // GET DATA (NEEDS AND INFO) FROM THE CHARITY ASKED (ID VALUE)
        // WRITE DATA IN JSON STRING
        Charity c = new Charity();
        c.setCnpj("1234123");
        c.setField("ongs");
        c.setName("test");
        c.setId(1);

        Needs n = new Needs();
        n.addNeeds(new Item(1, "test1", "desc", 4));
        n.addNeeds(new Item(2, "test2", "desc", 8));
        n.addNeeds(new Item(3, "test3", "desc", 3));

        c.setNeeds(n);

        String cJson = null;
        try {
            cJson = mapper.writeValueAsString(c);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        response.setType(request.getType());
        response.setMessage(cJson);

        String rJson = null;
        try {
            rJson = mapper.writeValueAsString(response);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        // SEND THE RESPONSE
        connection.send(rJson);
    }

    private void charitiesResponse(Request request, WebSocket connection) {
        ObjectMapper mapper = new ObjectMapper();
        Request response = new Request();
        // GET DATA (INFO AND ABSTRACT OF NEEDS) FROM ALL CHARITIES
        // FOLLOWING A ORDER

        ArrayList<Charity> charities = new ArrayList<>();
        Charity c = new Charity();
        c.setCnpj("1234123");
        c.setField("ongs");
        c.setName("test");
        c.setId(1);
        Needs n = new Needs();
        n.addNeeds(new Item(1, "test1", "desc", 4));
        n.addNeeds(new Item(2, "test2", "desc", 8));
        n.addNeeds(new Item(3, "test3", "desc", 3));

        c.setNeeds(n);

        charities.add(c);

        String charitiesJson = null;
        try {
            charitiesJson = mapper.writeValueAsString(charities);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        // FILTER WITH FILTERS ASKED (CHARITY VALUE)
        response.setType(request.getType());
        response.setMessage(charitiesJson);
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

    private void donateResponse(Request request, WebSocket connection) {
        ObjectMapper mapper = new ObjectMapper();
        Request response = new Request();
        // CREATE A NEW DONATION TO CHARITY (ID VALUE) IN THE DB
        // CONTENT OF DONATION IS IN MESSAGE VALUE (JSON)

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

    private void donationsMadeResponse(Request request, WebSocket connection) {
        ObjectMapper mapper = new ObjectMapper();
        Request response = new Request();
        // GET DONATIONS MADE BY AN USER (ID VALUE)

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

    private void donationsReceivedResponse(Request request, WebSocket connection) {
        ObjectMapper mapper = new ObjectMapper();
        Request response = new Request();
        // GET DONATIONS MADE TO AN CHARITY (ID VALUE)

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

    private void needsResponse(Request request, WebSocket connection) {
        ObjectMapper mapper = new ObjectMapper();
        Request response = new Request();
        // GET NEEDS OF A CHARITY (ID VALUE)

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

    private void needingResponse(Request request, WebSocket connection) {
        ObjectMapper mapper = new ObjectMapper();
        Request response = new Request();
        // CREATE NEW NEEDS FOR A CHARITY (ID VALUE) IN THE DB
        // CONTENT OF NEEDS IS IN MESSAGE VALUE (JSON)

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

    private void registerPersonPesponse(Request request, WebSocket connection) {
        ObjectMapper mapper = new ObjectMapper();
        Request response = new Request();
        // CREATE NEW PERSON IN THE DB
        // CONTENTS OF PERSON ARE IN MESSAGE VALUE

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

    private void registerCharityResponse(Request request, WebSocket connection) {
        ObjectMapper mapper = new ObjectMapper();
        Request response = new Request();
        // CREATE NEW PERSON IN THE DB
        // CONTENTS OF PERSON ARE IN MESSAGE VALUE

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

    private void validateDonationResponse(Request request, WebSocket connection) {
        ObjectMapper mapper = new ObjectMapper();
        Request response = new Request();
        // CHANGE THE DONATION (ID VALUE) TO RECEIVED

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
    }
    @Override
    public void onError(WebSocket webSocket, Exception e) {
        System.out.println("Error:");
        System.out.println(e.getMessage());
        //System.out.println("From " + webSocket.getRemoteSocketAddress().getAddress().getHostAddress());
    }

    public static void main(String[] args) {
        new RequestServer(9000).start();
    }
}
