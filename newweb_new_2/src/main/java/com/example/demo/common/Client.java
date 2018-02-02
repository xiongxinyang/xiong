package com.example.demo.common;

import javax.websocket.*;

/**
 * Created by xiong on 2017/12/6.
 */
@ClientEndpoint
public class Client {
    @OnOpen
    public void onOpen(Session session) {
        System.out.println("Connected to endpoint: " + session.getBasicRemote());
    }

    @OnMessage
    public void onMessage(String message) {
        System.out.println(message);
    }

    @OnError
    public void onError(Throwable t) {
        t.printStackTrace();
    }
}
