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
import java.util.concurrent.Executor;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Created by xiong on 2017/12/20.
 */
@Component
public class TrackBackDispatchTimer {

    final Map<Integer, TbVehicle> vehicles = new HashMap<>();
    public static Map<String, TrackBackDispatchTimer> wsTrackbackSessionMap = new ConcurrentHashMap<>();
    public final static Map<Integer, TbVehicle> subscribebackVehicleMap = new ConcurrentHashMap<>();
    public static  List<Location> loc=new ArrayList<>();

    private  Executor executor;
    private  WebSocketSession webSocketSession;

    private final Queue<String> dataQueue = new ConcurrentLinkedQueue<>();
    private AtomicLong subsLen = new AtomicLong();
    private AtomicLong queueLen = new AtomicLong();
    private AtomicBoolean busyInSend = new AtomicBoolean(false);

    public TrackBackDispatchTimer(Executor executor, WebSocketSession webSocketSession) {
        this.executor = executor;
        this.webSocketSession = webSocketSession;
    }
    public TrackBackDispatchTimer() {

    }

    public void clean(){
        for(TbVehicle vehicle : subscribebackVehicleMap.values())
            vehicle.removeSession(webSocketSession.getId());

        subscribebackVehicleMap.clear();
    }

    //遍历所有连接并发送
   /* @Scheduled(cron="0/6 * *  * * ? ")   //每6秒执行一次
    public void createTrackTask(){
        try{
            //发送数据
            for(TrackBackDispatchTimer session: wsTrackbackSessionMap.values() ){
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

    public void dispathNewTrack(Map<Integer, TbVehicle> _vehicles) {
        List<TbVehicle> vehInfoList = new ArrayList<>();
        for(TbVehicle vehicleInfo : subscribebackVehicleMap.values()){
            if(vehicleInfo.isNewTrack()){

                if(vehicleInfo.getLocation_back()!= null) {
                    vehInfoList.add(vehicleInfo);
                    //vehicleInfo.setNewTrack(false);
                    /*vehicleInfo.setLocation_back(new ArrayList<Location>());*/
                }
            }
        }

        if(!vehInfoList.isEmpty()){
            String sendMsgData = JSON.toJSONString(vehInfoList);

            requestSend(sendMsgData);
        }

        vehInfoList.clear();
        vehInfoList = null;
        _vehicles.putAll(subscribebackVehicleMap);
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

    public void subscribe(int _vehicle_id){
        TbVehicle vehicle = dataTimer.vehicleInfoMap.get(_vehicle_id);
        if(null == vehicle)
            return;

        if(!subscribebackVehicleMap.containsKey(_vehicle_id)){

            subscribebackVehicleMap.put(_vehicle_id, vehicle);
            vehicle.addbackSession(webSocketSession.getId(), this);

            //加入到全局的订阅列表
            if(!dataTimer.subscribeVehicleMap.containsKey(_vehicle_id))
                dataTimer.subscribeVehicleMap.put(_vehicle_id, vehicle);
        }
    }
}
