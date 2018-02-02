package sample.data.redis.service.impl;

import com.yicheng.protos.JttProtocol;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import sample.data.redis.domain.TbStudentBase;
import sample.data.redis.domain.TbTeacher;
import sample.data.redis.mapper.TeacherMapper;
import sample.data.redis.service.TeacherService;

import java.util.List;

/**
 * Created by xiong on 2017/11/8.
 */
@Slf4j
@Component
@Service
public class TeacherServiceImpl implements TeacherService{
    private TeacherMapper teacherMapper;
    @Autowired
    public TeacherServiceImpl(TeacherMapper teacherMapper) {
        this.teacherMapper = teacherMapper;
    }
    @Override
    public List<TbTeacher> GetTeacherList() {
        return  teacherMapper.gettealist();
    }

    @Override
    public TbTeacher GetTeacherOne(int id) {
        return  teacherMapper.getteaone(id);
    }
}
