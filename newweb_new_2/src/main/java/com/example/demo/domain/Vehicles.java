package com.example.demo.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

/**
 * Created by xiong on 2017/12/19.
 */
@Getter
@Setter
@ToString
public class Vehicles implements Serializable {
    ////车辆主键id
    private int vehicleId;
    private int gpsId;
    private String vehicleNo;
    //车型
    private int kindID;
    ////设备编号
    private String simCardNo;
}
