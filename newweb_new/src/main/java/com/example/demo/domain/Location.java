package com.example.demo.domain;

import com.example.demo.common.Tools;
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
    /**
     * 地图纠编
     * @param _mapType 地图类型
     */
    public void RegulateMap(final String _mapType){
        String[] lngLon = Tools.getRealLngLat(String.valueOf(this.longitude), String.valueOf(this.latitude), _mapType);
        if(lngLon.length == 2){
            this.sHlon = Double.parseDouble(lngLon[0]);
            this.sHlat = Double.parseDouble(lngLon[1]);
        }
    }
}
