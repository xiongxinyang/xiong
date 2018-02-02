package com.example.demo.websocket;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.example.demo.DemoApplication;
import com.example.demo.client.RpcClient;
import com.example.demo.domain.Location;
import com.example.demo.domain.TbVehicle;
import com.example.demo.timer.OnlineDispatchTimer;
import com.example.demo.timer.dataTimer;
import com.google.common.reflect.TypeToken;
import com.yicheng.protos.JttProtocol;
import io.grpc.stub.StreamObserver;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.map.HashedMap;
import org.apache.ibatis.cache.CacheKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Created by xiong on 2017/12/16.
 */
@Slf4j
public class OnlineSocketListener extends TextWebSocketHandler {
    private static final Logger logger = LoggerFactory.getLogger(OnlineSocketListener.class.getSimpleName());

    private final Executor executor = Executors.newCachedThreadPool();
    ExecutorService cachedThreadPool = Executors.newCachedThreadPool();
    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Autowired
    private RedisTemplate redisTemplate;

    public static Map<String,Integer> map=new HashedMap();

    /**
     * 建立连接
     * 将session放入到全局的sessionHashMap
     */
    @Override
    public void afterConnectionEstablished(WebSocketSession session)throws Exception {
        super.afterConnectionEstablished(session);
        logger.info("建立连接:{} sessionID:{}", session.getRemoteAddress(), session.getId());
        OnlineDispatchTimer onlineWebsoketSession = new OnlineDispatchTimer(executor, session);
        onlineWebsoketSession.wsOnlineSessionMap.put(session.getId(), onlineWebsoketSession);
		/*TrackWebsoketSession trackWebsoketSession = new TrackWebsoketSession(executor, session);
		LocalCache.wsTrackSessionMap.put(session.getId(), trackWebsoketSession);*/
    }

    /**
     * 断开连接
     */
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        super.afterConnectionClosed(session, status);

        OnlineDispatchTimer onlineWebsoketSession = OnlineDispatchTimer.wsOnlineSessionMap.get(session.getId());
        if(onlineWebsoketSession!=null){
            onlineWebsoketSession.clean();
            onlineWebsoketSession.wsOnlineSessionMap.remove(session.getId());
        }
        onlineWebsoketSession = null;
        logger.info("断开连接:{} sessionID{}", session.getRemoteAddress(), session.getId());
    }


    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        super.handleTextMessage(session, message);

        JSONObject acceptMsgJson = null;
        String result=message.getPayload();
        //车辆ID
        JSONObject request = (JSONObject) JSON.parse(result);

        String commandId = request.getString("Command");

        JSONObject body=request.getJSONObject("Body");
        String[] vehicles=null;
        //车辆列表
        if (body!=null) {
            vehicles = JSON.parseObject(body.getString("VehicleList"), new TypeReference<String[]>() {
            });
        }
        OnlineDispatchTimer onlinetimer=OnlineDispatchTimer.wsOnlineSessionMap.get(session.getId());
        Map<String, Object> outHm = new HashMap<String, Object>();

        ////按企业请求在线数据(就是监控树节点上面 x/y的x，表示该企业的当前在线车辆数)
        if(commandId.equals("5"))
        {
            String sendData  = onlinetimer.getWorkUnitOnline();
            if(!"".equals(sendData)){
                session.sendMessage(new TextMessage(sendData));
            }
        }
        else if(commandId.equals("4"))
        {
            for(String vid :vehicles){
                onlinetimer.subscribe(Integer.parseInt(vid));
            }

            //立即发送是否上下线
            String sendData = onlinetimer.getVehicleOnline();
            if(!"".equals(sendData)){
                session.sendMessage(new TextMessage(sendData));
            }
        }


    }
}
