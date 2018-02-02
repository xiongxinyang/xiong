package com.example.demo.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

/**
 * Created by xiong on 2018/1/8.
 */
@Getter
@Setter
@ToString
public class TeacherInfo implements Serializable {
    private int id;
    private String coachNum;
    private String teacherName;
    private String teaSex;
    private String teaCard;

    private String teaTel;
    private String teaPic;
    //private String teaStuTime;
}
