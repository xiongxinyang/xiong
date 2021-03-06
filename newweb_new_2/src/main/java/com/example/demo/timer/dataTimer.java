package com.example.demo.timer;


import com.example.demo.domain.StudentInfo;
import com.example.demo.domain.TbVehicle;
import com.example.demo.domain.TeacherInfo;
import com.example.demo.domain.Vehicles;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by xiong on 2017/12/16.
 */

@RestController
@Controller
@EnableAutoConfiguration
public class dataTimer {
    public static List<TbVehicle> listInfo=new ArrayList<>();

    //车辆数据
    public static Map<Integer, TbVehicle> vehicleInfoMap = new ConcurrentHashMap<>();

   /* //学员数据
    public static Map<String, StudentInfo> studentInfoMap = new ConcurrentHashMap<>();

    //教练数据
    public static Map<String, TeacherInfo> teacherInfoMap = new ConcurrentHashMap<>();*/

    public static List<TbVehicle> listoneInfo=new ArrayList<>();
    /**
     * 已经订阅 车辆ID 订阅数
     */
    public static Map<Integer, TbVehicle> subscribeVehicleMap = new ConcurrentHashMap<>();
    @Autowired
    private RedisTemplate<String,String> redisTemplate;
    //定时加载基础数据----车辆数据
    @Scheduled(cron="0/3600 * *  * * ? ")   //每1小时执行一次
    public void calculateVehicleOnlne(){
        try{
            //加载redis 车辆数据
            Object jsonInRedis=redisTemplate.opsForValue().get("vehicles_info");

            listoneInfo=(List<TbVehicle>) JSONArray.toList(JSONArray.fromObject(jsonInRedis), TbVehicle.class);

            for(TbVehicle veh:listoneInfo)
            {
                JSONObject jsonStu = JSONObject.fromObject(redisTemplate.opsForValue().get("vehicle_"+veh.getSimCardNo()+""));


                TbVehicle vehs = (TbVehicle) JSONObject.toBean( jsonStu,TbVehicle.class);
                //TbVehicle vehs=(TbVehicle) JSONArray.toList(JSONArray.fromObject(jsons), TbVehicle.class);
                listInfo.add(vehs);
                vehicleInfoMap.put(vehs.getVehicleId(),vehs);
            }
        }catch(Exception e){
            e.printStackTrace();
        }

    }

    /*//定时加载基础数据----学员数据
    @Scheduled(cron="0/3600 * *  * * ? ")   //每1小时执行一次
    public void calculateStudentInfo(){
        try{
            //加载redis 车辆数据
            Object jsonInRedis=redisTemplate.opsForValue().get("vehicles_info");

            listoneInfo=(List<TbVehicle>) JSONArray.toList(JSONArray.fromObject(jsonInRedis), TbVehicle.class);

            for(TbVehicle veh:listoneInfo)
            {
                JSONObject jsonStu = JSONObject.fromObject(redisTemplate.opsForValue().get("vehicle_"+veh.getSimCardNo()+""));


                TbVehicle vehs = (TbVehicle) JSONObject.toBean( jsonStu,TbVehicle.class);
                //TbVehicle vehs=(TbVehicle) JSONArray.toList(JSONArray.fromObject(jsons), TbVehicle.class);
                listInfo.add(vehs);
                vehicleInfoMap.put(vehs.getVehicleId(),vehs);
            }
        }catch(Exception e){
            e.printStackTrace();
        }

    }*/
}
