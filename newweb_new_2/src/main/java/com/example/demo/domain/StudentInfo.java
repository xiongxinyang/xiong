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
public class StudentInfo implements Serializable {
    private int id;
    private String studentNum;
    private String stuName;
    private String stuSex;
    private String stuCard;

    private String stuTel;
    private String stuPic;
    private String subject3TotalAmt;
}
