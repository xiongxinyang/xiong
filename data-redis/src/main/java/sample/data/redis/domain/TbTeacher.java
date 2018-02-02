package sample.data.redis.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

/**
 * Created by xiong on 2017/11/8.
 */
@Getter
@Setter
@ToString
public class TbTeacher implements Serializable {
    //教练员编号
    private int id;
    private String coachNum;

    //教练名称
    private String teacherName;
    //教练员准教车类型
    private String techVehicleType;


    private String teaSex;
    private String teaCard;
    private String teaTel;
    private String teaPic;

}
