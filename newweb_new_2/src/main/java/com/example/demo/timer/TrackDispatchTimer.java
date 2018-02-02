package com.example.demo.timer;

import com.alibaba.fastjson.JSON;
import com.example.demo.domain.Location;
import com.example.demo.domain.TbVehicle;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.Executor;
/**
 * Created by xiong on 2017/12/16.
 */
@Component
public class TrackDispatchTimer {
    final Map<Integer, TbVehicle> vehicles = new HashMap<>();
    public static Map<String, TrackDispatchTimer> wsTrackSessionMap = new ConcurrentHashMap<>();
    public final static Map<Integer, TbVehicle> subscribeVehicleMap = new ConcurrentHashMap<>();

    public static Map<Integer, List<WebSocketSession>> wsTrackVehicleSessionMap = new ConcurrentHashMap<>();

    private  Executor executor;
    private  WebSocketSession webSocketSession;
    private final Queue<String> dataQueue = new ConcurrentLinkedQueue<>();
    private AtomicLong subsLen = new AtomicLong();
    private AtomicLong queueLen = new AtomicLong();
    private AtomicBoolean busyInSend = new AtomicBoolean(false);

    /**
     * 构造函数
     * @param executor
     * @param webSocketSession
     */
    public TrackDispatchTimer(Executor executor, WebSocketSession webSocketSession) {
        this.executor = executor;
        this.webSocketSession = webSocketSession;
    }
    public TrackDispatchTimer() {

    }

    public void clean(){
        for(List<WebSocketSession> websoc : wsTrackVehicleSessionMap.values())
            websoc.remove(this.webSocketSession);

        //subscribeVehicleMap.clear();
    }

   /* //遍历所有连接并发送
    @Scheduled(cron="0/6 * *  * * ? ")   //每6秒执行一次
    public void createTrackTask(){
        try{
            //发送数据
            for(TrackDispatchTimer session: wsTrackSessionMap.values() ){
                session.dispathNewTrack(vehicles);
            }
            //将发送的轨迹数据置为 已使用
//		  for(VehicleInfo vehicle : vehicles.values()){
//			  vehicle.makeTrackUsed();
//		  }
        }catch(Exception e){
            e.printStackTrace();
        }

    }*/

    /*public void dispathNewTrack(Map<Integer, TbVehicle> _vehicles) {
        List<TbVehicle> vehInfoList = new ArrayList<>();
        for(TbVehicle vehicleInfo : subscribeVehicleMap.values()){
            if(vehicleInfo.isNewTrack()){

                if(vehicleInfo.getLocations() != null || vehicleInfo.getMinutes()!=null)
                    vehInfoList.add(vehicleInfo);
                //vehicleInfo.setNewTrack(false);
            }
        }

        if(!vehInfoList.isEmpty()){
            String sendMsgData = JSON.toJSONString(vehInfoList);
            requestSend(sendMsgData);
        }

        vehInfoList.clear();
        vehInfoList = null;
        _vehicles.putAll(subscribeVehicleMap);
    }*/
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

    public void subscribe(int _vehicle_id){
        TbVehicle vehicle = dataTimer.vehicleInfoMap.get(_vehicle_id);
        if(null == vehicle)
            return;

        List<WebSocketSession> websoc=wsTrackVehicleSessionMap.get(_vehicle_id);
        if(!websoc.contains(this.webSocketSession))
        {
            websoc.add(this.webSocketSession);
        }
        wsTrackVehicleSessionMap.put(_vehicle_id,websoc);
       /* if(!subscribeVehicleMap.containsKey(_vehicle_id)){

            subscribeVehicleMap.put(_vehicle_id, vehicle);
            vehicle.addSession(webSocketSession.getId(), this);

            //加入到全局的订阅列表
            if(!dataTimer.subscribeVehicleMap.containsKey(_vehicle_id))
                dataTimer.subscribeVehicleMap.put(_vehicle_id, vehicle);
        }*/
    }

    /**
     * 取消定阅
     * @param _vehicle_id
     */
    public void unscribe(int _vehicle_id){

        List<WebSocketSession> websoc=wsTrackVehicleSessionMap.get(_vehicle_id);
        if(websoc.size()>0) {
            subsLen.decrementAndGet();
            //subscribeVehicleMap.remove(_vehicle_id);
            websoc.remove(this.webSocketSession);
            //vehicle.removeSession(webSocketSession.getId());

           /* if(vehicle.getRefCount().get() == 0)
                subscribeVehicleMap.remove(_vehicle_id);*/
        }
       /* TbVehicle vehicle = subscribeVehicleMap.get(_vehicle_id);
        if(null != vehicle){
            subsLen.decrementAndGet();
            subscribeVehicleMap.remove(_vehicle_id);
            vehicle.removeSession(webSocketSession.getId());

            if(vehicle.getRefCount().get() == 0)
                subscribeVehicleMap.remove(_vehicle_id);
        }*/
    }

    /**
     * 取消全部订阅
     */
    public void unAllscribe(){

        for (List<WebSocketSession> websoc:wsTrackVehicleSessionMap.values())
        {
            websoc.remove(this.webSocketSession);
        }
       /* for(TbVehicle vehicle :subscribeVehicleMap.values()){
            subsLen.decrementAndGet();
            subscribeVehicleMap.remove(vehicle.getVehicleId());
            vehicle.removeSession(webSocketSession.getId());

            if(vehicle.getRefCount().get() == 0)
                subscribeVehicleMap.remove(vehicle.getVehicleId());
        }*/
    }
}
