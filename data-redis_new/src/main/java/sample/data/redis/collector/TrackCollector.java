package sample.data.redis.collector;

import com.yicheng.proto.RpcClient;
import com.yicheng.protos.JttProtocol;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sample.data.redis.mapper.TeacherMapper;

import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * Created by xiong on 2017/11/9.
 */
@RestController
@RequestMapping("track")
public class TrackCollector {
    @Autowired
    private Environment env;


    //设备注册
    @RequestMapping("importDevice")
    public void importDevice(String serverId,int deviceType,String deviceId)
    {
        RpcClient client = new RpcClient(RpcClient.url,Integer.parseInt(RpcClient.port));
        client.importDevice(serverId,deviceType,deviceId);
    }
    //订阅
    /*@RequestMapping("Location")
    public void Location(String serverId,int deviceType,String deviceId)
    {
        RpcClient.RegLocation(serverId,deviceType,deviceId);
    }
    //取消订阅
    @RequestMapping("unLocation")
    public void unLocation(String serverId,int deviceType,String deviceId)
    {
        RpcClient.unRegLocation(serverId,deviceType,deviceId);
    }

    //轨迹回放
    @RequestMapping("queryVehicleTark")
    public void queryVehicleTark(String serverId,int deviceType,String deviceId)
    {
        RpcClient.queryVehicleTark(serverId,deviceType,deviceId);
    }*/
}
