package sample.data.redis.collector;

import com.google.protobuf.ByteString;
import com.yicheng.protos.JttProtocol;
import jdk.nashorn.internal.runtime.JSONFunctions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sample.data.redis.domain.TbStudentBase;
import sample.data.redis.domain.TbVehicle;
import sample.data.redis.service.VehicleService;
import com.alibaba.fastjson.JSON;
import java.util.List;

/**
 * Created by xiong on 2017/11/8.
 */
@RestController
@RequestMapping("vehicle")
public class VehicleCollector {
    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Autowired
    private RedisTemplate<String,String> redisTemplate;

    //刷新缓存
    @RequestMapping("getVehicleList")
    public void getVehicleList()
    {
        List<TbVehicle> base= vehicleService.GetVehicleList();

        for(TbVehicle baseinfo:base)
        {
            String jsons= JSON.toJSONString(baseinfo);
            redisTemplate.opsForValue().set("vehicle_"+baseinfo.getSimCardNo(),jsons);
        }
        String json= JSON.toJSONString(base);
        redisTemplate.opsForValue().set("vehicles_info",json);
    }
    //删除对应缓存(删除时调用)
    @RequestMapping("deleteVehicleList")
    public void deleteVehicleList(int id) {

        if (redisTemplate.hasKey("vehicle_"+id)) {
            redisTemplate.delete("vehicle_"+id);
        }
    }

    //添加对应缓存(添加、修改时调用)
    @RequestMapping("addVehicleList")
    public void addVehicleList(int id)
    {
        TbVehicle base= vehicleService.GetVehicleOne(id);
        String jsons= JSON.toJSONString(base);
        redisTemplate.opsForValue().set("vehicle_"+base.getSimCardNo(),jsons);
    }


}
