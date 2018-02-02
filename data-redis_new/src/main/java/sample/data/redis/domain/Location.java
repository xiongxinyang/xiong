package sample.data.redis.domain;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

/**
 * Created by xiong on 2017/12/14.
 */
@Getter
@Setter
@ToString
public class Location implements Serializable {

    private double longitude = 1; // 纬度
    private double sHlat;// 偏移后纬度
    private  double latitude = 2; // 经度
    private double sHlon;// 偏移后经度
    private double speed = 3; // 行驶记录速度
    private double satelliteSpeed = 4; //卫星定位速度
    private int direction = 5; //方向
    private long time = 6; //时间

    ////车辆主键id
    private int vehicleId;
    ////车牌号
    private String vehicleNo;

}
