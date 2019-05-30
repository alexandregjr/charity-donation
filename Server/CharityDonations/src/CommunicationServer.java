import com.fasterxml.jackson.core.JsonParser;
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
        System.out.println("Aguardando conexoes");
    }

    @Override
    public void onOpen(WebSocket webSocket, ClientHandshake clientHandshake) {
        System.out.println("New connection from: " + webSocket.getRemoteSocketAddress().getAddress().getHostAddress());
    }

    @Override
    public void onClose(WebSocket webSocket, int i, String s, boolean b) {
        System.out.println("close");
    }

    @Override
    public void onMessage(WebSocket webSocket, String message) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            Request r = mapper.readValue(message, Request.class);
            System.out.println(r);
            String rJson = mapper.writeValueAsString(r);
            webSocket.send(rJson);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onError(WebSocket webSocket, Exception e) {
        System.out.println("error");
    }

    public static void main(String[] args) {
        new CommunicationServer(9000).start();
    }
}
