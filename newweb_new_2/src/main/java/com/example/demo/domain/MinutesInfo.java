package com.example.demo.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

/**
 * Created by xiong on 2018/1/5.
 */
@Getter
@Setter
@ToString
public class MinutesInfo implements Serializable{

    private String stuNum = "1"; //学员编号
    private String coachNum = "2"; //教练编号
    private String studyMinutes = "3"; //学时时间
    private double speed = 4; //最大速度
    private Integer maybeAM = 5; //转速
}
