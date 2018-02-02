package sample.data.redis.mapper;

import com.yicheng.protos.JttProtocol;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import sample.data.redis.domain.TbTeacher;

import java.util.List;

/**
 * Created by xiong on 2017/11/8.
 */
@Mapper
public interface TeacherMapper {
    @Select("select id,Coachnum as coachNum,\n" +
            "\n" +
            "            teacherName,techVehicleType,\n" +
            "            case Sex when 1 then '男' else '女' end as teaSex,\n" +
            "            IDCardNo as teaCard,\n" +
            "            Mobilephone as teaTel,\n" +
            "\t\t\tTechPic as teaPic \n" +
            "            from tb_teacher where DeleteMark=0 and Employstatus=0 and TrainingStatus=0 and Coachnum is not null")
    List<TbTeacher> gettealist();

    @Select("select id,Coachnum as coachNum,\n" +
            "\n" +
            "            teacherName,techVehicleType,\n" +
            "            case Sex when 1 then '男' else '女' end as teaSex,\n" +
            "            IDCardNo as teaCard,\n" +
            "            Mobilephone as teaTel,\n" +
            "\t\t\tTechPic as teaPic \n" +
            "            from tb_teacher where DeleteMark=0 and Employstatus=0 and TrainingStatus=0 and Coachnum is not null and id=#{id}")
    TbTeacher getteaone(int id);
}
