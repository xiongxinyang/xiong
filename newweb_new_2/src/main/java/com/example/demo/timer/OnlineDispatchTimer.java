package com.example.demo.timer;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.Executor;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;

import com.alibaba.fastjson.JSON;
import com.example.demo.domain.TbVehicle;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;


/***
 *  上下 线数量定时发送
 * @author zzf
 *
 */
@Component
public class OnlineDispatchTimer {

	static int iOnlineSleepTime = 600;

	private Executor executor;

	private WebSocketSession webSocketSession;
	//该用户所管辖的企业  用于求在线数
	private final List<HashMap<String, Object>> userWorkUnitList = new ArrayList<>();
	private final Map<Integer, Integer> vehicleMap = new ConcurrentHashMap<>();
	private final AtomicLong subsLen = new AtomicLong();

	private final Queue<String> dataQueue = new ConcurrentLinkedQueue<>();
	private final HashMap<Integer,Integer> totalVehicleMap = new HashMap<>();
	private final AtomicLong queueLen = new AtomicLong();


	/**
	 * 存放上下线数
	 **/
	public static Map<String, OnlineDispatchTimer> wsOnlineSessionMap = new ConcurrentHashMap<>();

	public OnlineDispatchTimer(Executor executor, WebSocketSession webSocketSession) {
		this.executor = executor;
		this.webSocketSession = webSocketSession;
	}

	public OnlineDispatchTimer() {

	}

	public void clean() {
		userWorkUnitList.clear();
		//userVehicleList.clear();
	}


	//遍历所有在线
	@Scheduled(cron = "0/10 * *  * * ? ")   //每10秒执行一次
	public void createOnlineTask() {
		try {
			//发送数据
			//System.out.println("createOnlineTask:"+LocalCache.wsOnlineSessionMap.size());
			for (OnlineDispatchTimer session : wsOnlineSessionMap.values()) {
				session.dispathOnlineCount();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

	}


	//计算车辆是否是在线
	@Scheduled(cron = "0/5 * *  * * ? ")   //每10秒执行一次
	public void calculateVehicleOnlne() {
		try {
			long nowTime = System.currentTimeMillis();
			for (TbVehicle vehicleInfo : dataTimer.vehicleInfoMap.values()) {
				if (vehicleInfo.getLastGpsTime() != 0) {
					boolean isOnline = isVehicleOnline(vehicleInfo.getVehicleId(), nowTime, vehicleInfo.getLastGpsTime());
					vehicleInfo.setOnline(isOnline);
				} else {
					// System.out.println(vehicleInfo.getTrackInfo().getVehicleId()+" 没有轨迹");
					vehicleInfo.setOnline(false);
				}
			}

			// System.out.println(String.format("========计算完成 %s 历时:%s==========",LocalCache.userInfoMap.size(),((new Date()).getTime()-s)));

		} catch (Exception e) {
			e.printStackTrace();
		}

	}


	/**
	 * 获取最后一条车辆轨迹时间
	 *
	 * @return
	 */
	public boolean isVehicleOnline(int vehicleID, Long nowTime, Long lastTrackTime) {
		boolean bFlag = false;
		if (lastTrackTime == null) {
			return bFlag;
		}
		long deltaTime = (nowTime - lastTrackTime) / 1000;//单位是秒
		if (deltaTime >= 0) {
			bFlag = deltaTime <= iOnlineSleepTime ? true : false;
		} else {//如果是时间超前的都认为是上线的
			bFlag = true;
			//System.out.println(String.format("时间不准确,当前时间:%s  车辆ID:%s  轨迹时间:%s", nowTime,vehicleID,lastTrackTime));
		}
		return bFlag;
	}


	public void subscribe(int _vehicle_id) {
		if (!vehicleMap.containsKey(_vehicle_id)) {
			subsLen.incrementAndGet();
			vehicleMap.put(_vehicle_id, _vehicle_id);
		}
	}

	/**
	 * 车辆在线
	 *
	 * @return
	 */
	public String getVehicleOnline() {

		// 用于保存返回在线的车辆信息
		List<String> onlineList = new ArrayList<String>();
		List<String> offlineList = new ArrayList<String>();
		for (Integer vid : vehicleMap.values()) { //生成上下线
			TbVehicle vehicleInfo = dataTimer.vehicleInfoMap.get(vid);
			if (null != vehicleInfo) {
				if (vehicleInfo.isOnline()) {
					onlineList.add(String.valueOf(vid));
				} else {
					offlineList.add(String.valueOf(vid));
				}
			} else {
				offlineList.add(String.valueOf(vid));
			}
		}
		Map<String, Object> outHm = new HashMap<String, Object>();
		outHm.put("RETURN_CODE", "4");
		outHm.put("OnlineItems", onlineList);
		outHm.put("OfflineItems", offlineList);

		String senddata = JSON.toJSONString(outHm);
		onlineList.clear();
		onlineList = null;
		offlineList.clear();
		offlineList = null;
		outHm.clear();
		outHm = null;
		return senddata;
	}

	/***
	 * 请求发送
	 * 将消息压入队列中
	 * @param _data
	 */
	public void requestSend(String _data) {
		dataQueue.offer(_data);
		queueLen.incrementAndGet();
		if (!busyInSend.getAndSet(true)) {
			executor.execute(doSendTask);
		}
	}

	public void dispathOnlineCount() {
		String vehicleSendData = getVehicleOnline();
		if (!"".equals(vehicleSendData)) {
			requestSend(vehicleSendData);
		}
		String  workUnitSendData =  getWorkUnitOnline();
		if(!"".equals(workUnitSendData)){
			requestSend(workUnitSendData);
		}
//		String  totalVehicleSendData =  getVehicleTotalCount();
//		if(!"".equals(totalVehicleSendData)){
//			requestSend(totalVehicleSendData);
//		}
	}

	private AtomicBoolean busyInSend = new AtomicBoolean(false);


	/***
	 * 数据发送线程
	 */
	private Runnable doSendTask = new Runnable() {
		public void run() {
			String data;
			while (null != (data = dataQueue.poll())) {
				queueLen.decrementAndGet();
				try {
					if (webSocketSession.isOpen()) {
						webSocketSession.sendMessage(new TextMessage(data));
					}
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			busyInSend.set(false);
		}
	};

	public long getQueueLen() {
		return queueLen.get();
	}

	public long getSubsLen() {
		return subsLen.get();
	}


	/**
	 * 企业数在线
	 * @return
	 */
	public String getWorkUnitOnline(){


		Map<Integer,Integer>  totalOnlineCount = new HashMap<Integer,Integer>();



			for (TbVehicle vehicleInfo :  dataTimer.vehicleInfoMap.values()) {

				if(null!=vehicleInfo && vehicleInfo.isOnline()){

					totalOnlineCount.put(vehicleInfo.getVehicleId(),vehicleInfo.getVehicleId());
				}
				totalVehicleMap.put(vehicleInfo.getVehicleId(),vehicleInfo.getVehicleId());
			}


		Map<String, Object> outData = new HashMap<String, Object>();
		outData.put("RETURN_CODE", "5");
		outData.put("ALLCOUNT", totalVehicleMap.size());//车辆总数
		outData.put("ONLINECOUNT", totalOnlineCount.size());//在线总数

		//总数
		//在线数

		String senddata = JSON.toJSONString(outData);
		outData = null;

		totalOnlineCount  = null;
		return senddata;
	}


}
