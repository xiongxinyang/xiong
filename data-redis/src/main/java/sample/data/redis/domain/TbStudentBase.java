package sample.data.redis.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;
/**
 * Created by xiong on 2017/11/7.
 */
@Getter
@Setter
@ToString
public class TbStudentBase implements Serializable {
	//学员编号
	private int id;

	private String studentNum;

	private String stuName;
	private String stuSex;
	private String stuCard;

	private String stuTel;
	private String stuPic;

	//学驾类型
	private String drivetype;
	//科目二总学时
	private int subject2TotalAmt;
	//科目二已完成学时
	private int subject2Amt;
	//科目三总学时
	private int subject3TotalAmt;
	//科目三已完成学时
	private int subject3Amt;
	//总里程
	private int totalMileage;
	//已学里程
	private int s3mileage;
}
