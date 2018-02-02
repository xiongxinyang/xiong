package sample.data.redis.collector;


import com.alibaba.fastjson.JSON;
import com.google.protobuf.ByteString;
import com.yicheng.protos.JttProtocol;
import lombok.Value;
import org.springframework.core.env.Environment;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import sample.data.redis.domain.TbStudentBase;
import sample.data.redis.mapper.StudentBaseMapper;
import sample.data.redis.service.StudentBaseService;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by xiong on 2017/11/7.
 */
@RestController
@RequestMapping("student")
public class StudentBaseCollector {


	@Autowired
	private StudentBaseService studentBaseService;

	@Autowired
	private StringRedisTemplate stringRedisTemplate;

	@Autowired
	private RedisTemplate redisTemplate;

	//刷新缓存
	@RequestMapping("getStuList")
	public void getStuList()
	{
		List<TbStudentBase> base= studentBaseService.GetStudentList();

		for(TbStudentBase baseinfo:base)
		{

			String jsons= JSON.toJSONString(baseinfo);
			redisTemplate.opsForValue().set("studentbase_"+baseinfo.getStudentNum(),jsons);
		}

	}
	//删除对应缓存(删除时调用)
	@RequestMapping("deleteStuList")
	public void deleteStuList(int id)
	{
		if(redisTemplate.hasKey("studentbase_"+id)) {
			redisTemplate.delete("studentbase_"+id);
		}
	}

	//添加对应缓存(添加、修改时调用)
	@RequestMapping("addStuList")
	public void addStuList(int id)
	{
		TbStudentBase base= studentBaseService.GetStudentOne(id);

		String jsons= JSON.toJSONString(base);
		redisTemplate.opsForValue().set("studentbase_"+id,jsons);
	}


	public ByteString setValue(TbStudentBase baseinfo)
	{
		JttProtocol.DriveStudent dev= JttProtocol.DriveStudent.newBuilder()
				.setStudentNum(baseinfo.getStudentNum())
				.setDriveType(baseinfo.getDrivetype())
				.setSubject2TotalAmt(baseinfo.getSubject2TotalAmt())
				.setSubject2Amt(baseinfo.getSubject2Amt())
				.setSubject3TotalAmt(baseinfo.getSubject3TotalAmt())
				.setSubject3Amt(baseinfo.getSubject3Amt())
				.setTotalMileage(baseinfo.getTotalMileage())
				.setS3Mileage(baseinfo.getS3mileage()).build();
		return dev.toByteString();
	}

}
