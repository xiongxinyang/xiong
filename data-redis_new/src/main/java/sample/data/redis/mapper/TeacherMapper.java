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
    @Select("select id as coachNum,techVehicleType from tb_teacher where DeleteMark=0 and Employstatus=0 and TrainingStatus=0")
    List<TbTeacher> gettealist();

    @Select("select id as coachNum,techVehicleType from tb_teacher where DeleteMark=0 and Employstatus=0 and TrainingStatus=0 and id=#{id}")
    TbTeacher getteaone(int id);
}
