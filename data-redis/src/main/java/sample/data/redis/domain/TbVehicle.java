package sample.data.redis.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by xiong on 2017/11/8.
 */
@Getter
@Setter
@ToString
public class TbVehicle implements Serializable {
    private int code;

    ////车辆主键id
    private int vehicleId;
    private int gpsId;
    //车牌号
    private String vehicleNo;
    private String Tel;
    //车型
    private int kindID;
    ////设备编号
    private String simCardNo;
    //所属驾校名称
    private String driverSchoolName;
    //所属驾校编号
    private int driverSchoolCode;



    private boolean isNewTrack = false;
    private Location Locations;
    private List<Location> Location_back =new ArrayList<Location>();

    private long lastGpsTime;
    private boolean isOnline = false;
}
