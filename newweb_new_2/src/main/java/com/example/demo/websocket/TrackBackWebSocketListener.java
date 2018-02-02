package com.example.demo.websocket;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.example.demo.DemoApplication;
import com.example.demo.client.RpcClient;
import com.example.demo.domain.Location;
import com.example.demo.domain.TbVehicle;
import com.example.demo.timer.TrackBackDispatchTimer;
import com.example.demo.timer.TrackDispatchTimer;
import com.example.demo.timer.dataTimer;
import com.yicheng.protos.JttProtocol;
import com.yicheng.protos.JttRequestGrpc;
import io.grpc.stub.StreamObserver;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

/**
 * Created by xiong on 2017/11/21.
 */
@Slf4j
public class TrackBackWebSocketListener extends TextWebSocketHandler {
    final Map<Integer, TbVehicle> vehicles = new HashMap<>();
    private static final Logger logger = LoggerFactory.getLogger(TrackBackWebSocketListener.class.getSimpleName());
    private final Executor executor = Executors.newFixedThreadPool(8);
    ExecutorService cachedThreadPool = Executors.newCachedThreadPool();
    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Autowired
    private RedisTemplate redisTemplate;

    /**
     * 建立连接
     * 将session放入到全局的sessionHashMap
     */
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        super.afterConnectionEstablished(session);
        logger.info("建立连接:{} sessionID:{}", session.getRemoteAddress(), session.getId());

        TrackBackDispatchTimer trackbackWebsoketSession = new TrackBackDispatchTimer(executor, session);
        trackbackWebsoketSession.wsTrackbackSessionMap.put(session.getId(), trackbackWebsoketSession);
    }

    /**
     * 断开连接
     */
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        super.afterConnectionClosed(session, status);
        TrackBackDispatchTimer trackbackWebsoketSession = TrackBackDispatchTimer.wsTrackbackSessionMap.get(session.getId());
        if (trackbackWebsoketSession != null) {
            trackbackWebsoketSession.clean();
            TrackBackDispatchTimer.wsTrackbackSessionMap.remove(session.getId());
        }

        trackbackWebsoketSession = null;
        logger.info("断开连接:{} sessionID{}", session.getRemoteAddress(), session.getId());
    }


    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        super.handleTextMessage(session, message);

        JSONObject acceptMsgJson = null;
        try {
            RpcClient client = new RpcClient(DemoApplication.url, Integer.parseInt(DemoApplication.port));
            //车辆ID
            SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

            JSONObject request = (JSONObject) JSON.parse(message.getPayload());
            String Vehicle = request.getString("Vehicle");
            String BeginTime = request.getString("BeginTime");
            Date BeginTime_date = sdf.parse(BeginTime);
            String EndTime = request.getString("EndTime");
            Date EndTime_date = sdf.parse(EndTime);
            TrackBackDispatchTimer trackbackWebsoketSession = TrackBackDispatchTimer.wsTrackbackSessionMap.get(session.getId());
            List<TbVehicle> vehInfoList = new ArrayList<>();
            int Vehicleid = Integer.parseInt(Vehicle);
            //TbVehicle veh=(TbVehicle)redisTemplate.opsForValue().get("vehicle_"+Vehicle);
            TbVehicle veh = dataTimer.vehicleInfoMap.get(Vehicleid);
            if (veh != null) {

                //立即返回订阅数据

                if (veh.getLocation_back().size()>0)
                    vehInfoList.add(veh);

                if (!vehInfoList.isEmpty()) {
                    String sendMsgData = JSON.toJSONString(vehInfoList);
                    session.sendMessage(new TextMessage(sendMsgData));
                }

                StreamObserver<JttProtocol.Respone> streamObserver = new StreamObserver<JttProtocol.Respone>() {
                    @Override
                    public void onNext(JttProtocol.Respone respone) {

                        JttProtocol.DataLocation ds = respone.getLocation();
                        log.info(ds.toString());

                        TbVehicle vehicleInfoback = dataTimer.vehicleInfoMap.get(veh.getVehicleId());
                        vehicleInfoback.setVehicleId(veh.getVehicleId());
								/*	vehs.setKindID(vehs.getKindID());
									vehs.setVehicleNo(vehs.getVehicleNo());*/
                        vehicleInfoback.setNewTrack(true);
                        vehicleInfoback.setCode(1);
                        Location lo = new Location();


                        lo.setLatitude(ds.getLatitude());
                        lo.setLongitude(ds.getLongitude());
                        //地图纠编  百度d地图
                        lo.RegulateMap("0");
                        lo.setLatitude(lo.getSHlat());
                        lo.setLongitude(lo.getSHlon());

                        lo.setSpeed(ds.getSpeed());
                        lo.setSatelliteSpeed(ds.getSatelliteSpeed());
                        lo.setTime(ds.getTime());
                        lo.setVehicleId(veh.getVehicleId());
                        lo.setVehicleNo(veh.getVehicleNo());
                        long nowTime = System.currentTimeMillis();
                        vehicleInfoback.setLastGpsTime(nowTime);



                      /*  HashMap<String, Object> map = new HashMap<String, Object>(); //组装消息内容
                        map.put("latitude",lo.getLatitude());
                        map.put("longitude",lo.getLongitude());
                        map.put("speed",ds.getSpeed());
                        map.put("satelliteSpeed",ds.getSatelliteSpeed());
                        map.put("time",ds.getTime());*/
                        vehicleInfoback.getLocation_back().add(lo);

                        //vehicleInfoback.setLocation_back(TrackBackDispatchTimer.loc);
                        String result = JSON.toJSONString(lo);
                        TrackBackDispatchTimer.subscribebackVehicleMap.put(vehicleInfoback.getVehicleId(), vehicleInfoback);
                        //session.sendMessage(new TextMessage(ds.toString()));


                        //更新 当前车辆redis 的 最后轨迹时间
                        String jsons= JSON.toJSONString(vehicleInfoback);
                        //redisTemplate.opsForValue().set("vehiclevalue_"+veh.getVehicleId()+"",jsons);



                    }

                    @Override
                    public void onError(Throwable throwable) {
                        log.error(throwable.getMessage());
                    }

                    @Override
                    public void onCompleted() {
                        trackbackWebsoketSession.subscribe(Vehicleid);

                        for (TrackBackDispatchTimer session : TrackBackDispatchTimer.wsTrackbackSessionMap.values()) {
                            session.dispathNewTrack(vehicles);

                        }
                        TrackBackDispatchTimer.subscribebackVehicleMap.get(Vehicleid).setLocation_back(new ArrayList<Location>());
                    }
                };

                client.queryVehicleTark("jtt", veh.getKindID(), veh.getSimCardNo(), BeginTime_date.getTime(), EndTime_date.getTime(), streamObserver);
            } else {
                session.sendMessage(new TextMessage("Redis无车辆id为" + Vehicle + "的数据！"));
            }

        } catch (Exception e) {
            logger.error("handleTextMessage err: ", e);
            return;
        }
    }
}
