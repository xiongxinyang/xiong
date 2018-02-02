package sample.data.redis.service;

import com.yicheng.protos.JttProtocol;
import org.springframework.stereotype.Service;
import sample.data.redis.domain.TbStudentBase;

import java.util.List;

/**
 * Created by xiong on 2017/11/7.
 */
public interface StudentBaseService {
	List<TbStudentBase> GetStudentList();
	TbStudentBase GetStudentOne(int id);

}
