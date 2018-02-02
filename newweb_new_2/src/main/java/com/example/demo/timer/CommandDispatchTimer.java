package com.example.demo.timer;

import com.alibaba.fastjson.JSON;
import com.example.demo.domain.TbVehicle;
import com.example.demo.websocket.CommandWebSocketListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.Executor;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Created by xiong on 2018/1/12.
 */
@Component
public class CommandDispatchTimer {


    public final static Map<Integer, TbVehicle> commandVehicleMap = new ConcurrentHashMap<>();


    private  Executor executor;
    private  WebSocketSession webSocketSession;
    private final Queue<String> dataQueue = new ConcurrentLinkedQueue<>();
    private AtomicLong subsLen = new AtomicLong();
    private AtomicLong queueLen = new AtomicLong();
    private AtomicBoolean busyInSend = new AtomicBoolean(false);
    /** 存放指令 **/
    public static Map<String, CommandDispatchTimer> wsCommandSessionMap = new ConcurrentHashMap<>();
    /**
     * 构造函数
     * @param executor
     * @param webSocketSession
     */
    public CommandDispatchTimer(Executor executor, WebSocketSession webSocketSession) {
        this.executor = executor;
        this.webSocketSession = webSocketSession;
    }
    public CommandDispatchTimer() {

    }



    /***
     * 请求发送
     * 将消息压入队列中
     * @param _data
     */
    public void requestSend(final String _data){
        dataQueue.offer(_data);
        queueLen.incrementAndGet();

        if(!busyInSend.getAndSet(true))
            executor.execute(doSendTask);
    }
    /***
     * 数据发送线程
     */
    private final Runnable doSendTask = new Runnable(){
        public void run(){
            String data;
            while(null != (data = dataQueue.poll()) ){
                queueLen.decrementAndGet();
                try {
                    if(webSocketSession.isOpen())
                        webSocketSession.sendMessage(new TextMessage(data));
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

            busyInSend.set(false);
        }
    };
    public long getQueueLen(){
        return queueLen.get();
    }

    public long getSubsLen(){
        return subsLen.get();
    }


}
