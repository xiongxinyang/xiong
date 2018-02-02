package sample.data.redis.service.impl;

import com.yicheng.protos.JttProtocol;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import sample.data.redis.domain.TbStudentBase;
import sample.data.redis.mapper.StudentBaseMapper;
import sample.data.redis.service.StudentBaseService;

import java.util.List;

/**
 * Created by xiong on 2017/11/7.
 */

@Slf4j
@Component
@Service
public class StudentBaseServiceImpl implements StudentBaseService{

	private StudentBaseMapper studentBaseMapper;
	@Autowired
	public StudentBaseServiceImpl(StudentBaseMapper studentBaseMapper) {
		this.studentBaseMapper = studentBaseMapper;
	}
	@Override
	public List<TbStudentBase> GetStudentList() {
		return  studentBaseMapper.getstulist();
	}

	@Override
	public TbStudentBase GetStudentOne(int id) {
		return  studentBaseMapper.getstuone(id);
	}
}
