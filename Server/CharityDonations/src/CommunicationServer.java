import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;
import request.Request;

import java.io.IOException;
import java.net.InetSocketAddress;

public class CommunicationServer extends WebSocketServer {

    public CommunicationServer(int port) {
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
        System.out.println("From " + webSocket.getRemoteSocketAddress().getAddress().getHostAddress());
        System.out.println("Cause: " + cause);
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
        // GET DATA (NEEDS AND INFO) FROM THE CHARITY ASKED (ID VALUE)
        // WRITE DATA IN JSON STRING
        String rJson = null;
        try {
            rJson = mapper.writeValueAsString(request);
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

        // FILTER WITH FILTERS ASKED (CHARITY VALUE)

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
        new CommunicationServer(9000).start();
    }
}
