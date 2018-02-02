package sample.data.redis.service;

import com.yicheng.protos.JttProtocol;
import org.springframework.stereotype.Service;
import sample.data.redis.domain.TbTeacher;

import java.util.List;

/**
 * Created by xiong on 2017/11/8.
 */
public interface TeacherService {
    List<TbTeacher> GetTeacherList();
    TbTeacher GetTeacherOne(int id);
}
