package com.example.demo.domain;

import com.example.demo.timer.TrackBackDispatchTimer;
import com.example.demo.timer.TrackDispatchTimer;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Created by xiong on 2017/11/8.
 */
@Getter
@Setter
@ToString
public class TbVehicle implements Serializable {

    /**
     * 需要发送的SessionID
     */
    private final Map<String, TrackDispatchTimer> sessionMap = new ConcurrentHashMap<>();

    private final Map<String, TrackBackDispatchTimer> sessionbackMap = new ConcurrentHashMap<>();

    private final AtomicLong refCount = new AtomicLong();
    private int code;
    ////车辆主键id
    private int vehicleId;
    private int gpsId;
    ////车牌号
    private String vehicleNo;
    private String Tel;

    private boolean isNewTrack = false;
    //车型
    private int kindID;
    ////设备编号
    private String simCardNo;

    //所属驾校名称
    private String driverSchoolName;
    //所属驾校编号
    private int driverSchoolCode;

    private MinutesInfo minutes;
    private Location Locations;
    private List<Location> Location_back =new ArrayList<Location>();

    private TeacherInfo teacherInfo;
    private StudentInfo studentInfo;

    /**
     * 是否在线
     */
    private boolean isOnline = false;

    /**
     * 最后GPS时间
     */
    private long lastGpsTime;

    /***
     * 移除该辆车需要发送到的session
     * @param _session_id
     */
    public void removeSession(final String _session_id){
        sessionMap.remove(_session_id);
        refCount.decrementAndGet();
    }

    /***
     * 增加该辆车需要发送到哪些 session
     * @param _session_id
     * @param _session
     */
    public void addSession(final String _session_id, TrackDispatchTimer _session){
        sessionMap.put(_session_id, _session);
        refCount.incrementAndGet();
    }

    /***
     * 增加该辆车需要发送到哪些 session
     * @param _session_id
     * @param _session
     */
    public void addbackSession(final String _session_id, TrackBackDispatchTimer _session){
        sessionbackMap.put(_session_id, _session);
        refCount.incrementAndGet();
    }

    /***
     * 移除该辆车需要发送到的session
     * @param _session_id
     */
    public void removebackSession(final String _session_id){
        sessionbackMap.remove(_session_id);
        refCount.decrementAndGet();
    }
}
