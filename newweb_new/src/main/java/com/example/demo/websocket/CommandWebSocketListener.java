package com.example.demo.websocket;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.example.demo.DemoApplication;
import com.yicheng.protos.JttProtocol;
import io.grpc.stub.StreamObserver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Date;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

/**
 * Created by xiong on 2017/11/22.
 */
public class CommandWebSocketListener extends TextWebSocketHandler {
    private static final Logger logger = LoggerFactory.getLogger(CommandWebSocketListener.class.getSimpleName());

    private final Executor executor = Executors.newFixedThreadPool(8);

    /**
     *
     * 建立连接
     * 将session放入到全局的sessionHashMap
     */
    @Override
    public void afterConnectionEstablished(WebSocketSession session)throws Exception {
        super.afterConnectionEstablished(session);
        logger.info("建立连接:{} sessionID:{}", session.getRemoteAddress(), session.getId());

		/*TrackWebsoketSession trackWebsoketSession = new TrackWebsoketSession(executor, session);
		LocalCache.wsTrackSessionMap.put(session.getId(), trackWebsoketSession);*/
    }

    /**
     * 断开连接
     */
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        super.afterConnectionClosed(session, status);


        //trackWebsoketSession = null;
        logger.info("断开连接:{} sessionID{}", session.getRemoteAddress(), session.getId());
    }


    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        super.handleTextMessage(session, message);

        JSONObject acceptMsgJson = null;
        try{

        }catch(Exception e){
            logger.error("handleTextMessage err: ", e);
            return;
        }
    }
}
