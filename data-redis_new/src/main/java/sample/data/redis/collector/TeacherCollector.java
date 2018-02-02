package sample.data.redis.collector;

import com.alibaba.fastjson.JSON;
import com.google.protobuf.ByteString;
import com.yicheng.protos.JttProtocol;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sample.data.redis.domain.TbStudentBase;
import sample.data.redis.domain.TbTeacher;
import sample.data.redis.mapper.TeacherMapper;
import sample.data.redis.service.TeacherService;

import java.util.List;

/**
 * Created by xiong on 2017/11/8.
 */
@RestController
@RequestMapping("teacher")
public class TeacherCollector {

    @Autowired
    private TeacherService teacherService;

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Autowired
    private RedisTemplate redisTemplate;

    //刷新缓存
    @RequestMapping("getTeacherList")
    public void getTeacherList()
    {
        List<TbTeacher> base= teacherService.GetTeacherList();
        for(TbTeacher baseinfo:base)
        {

            String jsons= JSON.toJSONString(baseinfo);
            redisTemplate.opsForValue().set("teacher_"+baseinfo.getCoachNum(),jsons);
        }

    }
    //删除对应缓存(删除时调用)
    @RequestMapping("deleteTeacherList")
    public void deleteTeacherList(int id) {
        if (redisTemplate.hasKey("teacher_"+id)) {
            redisTemplate.delete("teacher_"+id);
        }
    }

    //添加对应缓存(添加、修改时调用)
    @RequestMapping("addTeacherList")
    public void addTeacherList(int id)
    {
        TbTeacher base= teacherService.GetTeacherOne(id);

        String jsons= JSON.toJSONString(base);
        redisTemplate.opsForValue().set("teacher_"+id,jsons);
    }

    public ByteString setValue(TbTeacher baseinfo)
    {
        JttProtocol.DriveCoach dev= JttProtocol.DriveCoach.newBuilder()
                .setCoachNum(baseinfo.getCoachNum())
                .setTeachCarType(baseinfo.getTechVehicleType()).build();
        return dev.toByteString();
    }
}
