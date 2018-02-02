package com.example.demo.websocket;

import java.beans.Expression;
import java.io.IOException;
import java.rmi.server.ExportException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.*;

import com.alibaba.fastjson.TypeReference;
import com.example.demo.DemoApplication;
import com.example.demo.client.RpcClient;
import com.example.demo.domain.Location;
import com.example.demo.domain.TbVehicle;
import com.example.demo.timer.TrackDispatchTimer;
import com.example.demo.timer.dataTimer;
import com.yicheng.protos.JttProtocol;
import com.yicheng.protos.JttRequestGrpc;
import io.grpc.stub.StreamObserver;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.map.HashedMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import static com.example.demo.timer.dataTimer.subscribeVehicleMap;
/*import com.etrans.baf.api.common.util.MapType;
import com.etrans.baf.api.common.util.StringUtils;
import com.etrans.baf.collector.open.domain.CmdConstants;
import com.etrans.baf.collector.open.domain.LocalCache;
import com.etrans.baf.collector.open.domain.TrackInfo;
import com.etrans.baf.collector.open.domain.VehicleInfo;
import com.etrans.baf.collector.open.domain.websocket.TrackWebsoketSession;*/

/**
 * 车辆订阅websocket服务端
 * @author zzf
 */
@Slf4j
public class TrackWebSocketListener extends TextWebSocketHandler {
	private static final Logger logger = LoggerFactory.getLogger(TrackWebSocketListener.class.getSimpleName());

	private final Executor executor = Executors.newFixedThreadPool(8);
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

		TrackDispatchTimer trackWebsoketSession = new TrackDispatchTimer(executor, session);
		TrackDispatchTimer.wsTrackSessionMap.put(session.getId(), trackWebsoketSession);
	}

	/**
	 * 断开连接
	 */
	 @Override
	 public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		super.afterConnectionClosed(session, status);

		 TrackDispatchTimer trackWebsoketSession = TrackDispatchTimer.wsTrackSessionMap.get(session.getId());
		 if(trackWebsoketSession != null){
			 trackWebsoketSession.clean();
			 TrackDispatchTimer.wsTrackSessionMap.remove(session.getId());
		 }

		 trackWebsoketSession = null;
		logger.info("断开连接:{} sessionID{}", session.getRemoteAddress(), session.getId());
	}
 

	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		super.handleTextMessage(session, message);

		JSONObject acceptMsgJson = null;
		try{

			String result=message.getPayload();
			//车辆ID
			JSONObject request = (JSONObject) JSON.parse(result);
			// 0 订阅  1 取消订阅
			int type=request.getIntValue("Type");

			JSONObject body=request.getJSONObject("Body");
			//车辆列表
			String[] vehicles = JSON.parseObject(body.getString("VehicleList"), new TypeReference<String[]>(){});

			TrackDispatchTimer trackWebsoketSession = TrackDispatchTimer.wsTrackSessionMap.get(session.getId());

            //订阅
			if(type==1)
			{
				List<TbVehicle> vehInfoList = new ArrayList<>();
				RpcClient client = new RpcClient(DemoApplication.url,Integer.parseInt(DemoApplication.port));
				//订阅
				for(String v:vehicles) {
					//获取车辆的 设备ID及类型


					int Vehicleid=Integer.parseInt(v);
					//TbVehicle vehicleInfo = (TbVehicle) redisTemplate.opsForValue().get("vehicle_" + v);
					TbVehicle vehicleInfo = dataTimer.vehicleInfoMap.get(Vehicleid); //找到对应的车 如果没有找到 则表示没有数据过来
					/*TbVehicle vehicleInfo=new TbVehicle();
					vehicleInfo.setVehicleId(1);
					vehicleInfo.setKindID(11);
					vehicleInfo.setSimCardNo("15929554571");*/
					if(vehicleInfo != null){

						/* if(map.containsKey(veh.getSimCardNo()))
					 {
						 map.put(veh.getSimCardNo(),map.get(veh.getSimCardNo())+1);
					 }
					 else
					 {
						 map.put(veh.getSimCardNo(),1);
					 }
					 if(map.get(veh.getSimCardNo()).equals(1))
					 {*/
						StreamObserver<JttProtocol.Respone> streamObserver = new StreamObserver<JttProtocol.Respone>() {
							@Override
							public void onNext(JttProtocol.Respone respone) {

								JttProtocol.DataLocation ds = respone.getLocation();
								log.info(ds.toString());

								TbVehicle vehicleInfoback = dataTimer.vehicleInfoMap.get(vehicleInfo.getVehicleId());
								vehicleInfoback.setVehicleId(vehicleInfo.getVehicleId());
								/*	vehs.setKindID(vehs.getKindID());
									vehs.setVehicleNo(vehs.getVehicleNo());*/
								vehicleInfoback.setKindID(12);
								//vehicleInfoback.setNewTrack(true);
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

								long lastGpsTime=vehicleInfoback.getLastGpsTime();
								if(ds.getTime() > lastGpsTime){
									vehicleInfoback.setNewTrack(true);

									//long nowTime = System.currentTimeMillis();
									vehicleInfoback.setLastGpsTime(ds.getTime());
								}


								vehicleInfoback.setLocations(lo);
								TrackDispatchTimer.subscribeVehicleMap.put(vehicleInfoback.getVehicleId(), vehicleInfoback);
								/*	String result=JSON.toJSONString(vehs);

									session.sendMessage(new TextMessage(result));*/

								//更新 当前车辆redis 的 最后轨迹时间
								String jsons= JSON.toJSONString(vehicleInfoback);
								redisTemplate.opsForValue().set("vehiclevalue_"+vehicleInfo.getVehicleId()+"",jsons);

							}

							@Override
							public void onError(Throwable throwable) {
								log.error(throwable.getMessage());
							}

							@Override
							public void onCompleted() {
							}
						};
						client.subVehicleLocation("jtt808",vehicleInfo.getKindID(),vehicleInfo.getSimCardNo(),streamObserver);



						trackWebsoketSession.subscribe(Vehicleid);

						//立即返回订阅数据

						if(null != vehicleInfo.getLocations())
							vehInfoList.add(vehicleInfo);
					}
					else
					{
						session.sendMessage(new TextMessage("Redis无车辆id为"+v+"的数据！"));
					}





				}

				if(!vehInfoList.isEmpty()){
					String sendMsgData = JSON.toJSONString(vehInfoList);
					session.sendMessage(new TextMessage(sendMsgData));
				}
			}
			else
			{
				RpcClient clients = new RpcClient(DemoApplication.url,Integer.parseInt(DemoApplication.port));
				for(String v:vehicles) {
					//获取车辆的 设备ID及类型
					TbVehicle veh = (TbVehicle) redisTemplate.opsForValue().get("vehicle_" + v);
					if (veh != null) {
						//取消订阅
						if(map.containsKey(veh.getSimCardNo()))
						{
							if(map.get(veh.getSimCardNo()).equals(1))
							{
								map.remove(veh.getSimCardNo());
							}
							else {
								map.put(veh.getSimCardNo(), map.get(veh.getSimCardNo()) - 1);
							}
						}
						if(-1 ==Integer.parseInt(v)){ //全部取消
							trackWebsoketSession.unAllscribe();
							return;
						}

						TbVehicle vo = dataTimer.vehicleInfoMap.get(Integer.parseInt(v));
						if(null != vo){
							trackWebsoketSession.unscribe(Integer.parseInt(v));//取消订阅
							TbVehicle scribeVehicleInfo = subscribeVehicleMap.get(Integer.parseInt(v));//将该车辆要发送的session 中移除
							if(null != scribeVehicleInfo)
								scribeVehicleInfo.removeSession(session.getId());
						}


						String results=clients.unSubVehicleLocation("jtt",veh.getKindID(),veh.getSimCardNo());
						session.sendMessage(new TextMessage(results));
					}
					else
					{
						session.sendMessage(new TextMessage("Redis无车辆id为"+v+"的数据！"));
					}
				}
			}


		}catch(Exception e){
			logger.error("handleTextMessage err: ", e);
			return;
		}
      }
}