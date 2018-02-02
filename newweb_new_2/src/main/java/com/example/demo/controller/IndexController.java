package com.example.demo.controller;

import com.example.demo.domain.TbVehicle;
import com.example.demo.common.Client;
import com.example.demo.timer.dataTimer;
import net.sf.json.JSONArray;
import net.sf.json.JSONSerializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.websocket.ContainerProvider;
import javax.websocket.Session;
import javax.websocket.WebSocketContainer;
import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by xiong on 2017/11/15.
 */
@Controller
@EnableAutoConfiguration
@RequestMapping("/")
public class IndexController {

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Autowired
    private RedisTemplate redisTemplate;

    @RequestMapping(value = {"","/","/index"})
    String home() {
        dataTimer data=new dataTimer();
      /*  Object jsonInRedis=redisTemplate.opsForValue().get("vehicle_info");

        data.listInfo=(List<TbVehicle>) JSONArray.toList(JSONArray.fromObject(jsonInRedis), TbVehicle.class);*/
      //data.calculateVehicleOnlne();
        return "index";
    }

    @RequestMapping(value = {"","/","/vehicleTree"})
    public String vehicleTree() {
        return "vehicleTree";
    }

    @RequestMapping(value = {"","/","/demo"})
    public String demo() {
        return "demo";
    }

    @RequestMapping(value = {"","/","/trackBack"})
    public String trackBack(Model model, String vehicleno) {
        model.addAttribute("vehicleno",vehicleno);
        return "trackBack";
    }
    @RequestMapping(value = {"","/","/attention"})
    public String attention() {
        return "attention";
    }

    @RequestMapping(value = {"","/","/attentionPic"})
    @ResponseBody
    public List<Map<String, Object>>  attentionPic()
    {
        List<Map<String, Object>> maps=new ArrayList<Map<String, Object>>();


        /*for(TbVehicle vh:dataTimer.vehicleInfoMap.values())*/
        for(Integer i=0;i<10;i++)
        {
            Map<String, Object> map = new HashMap<>();
            map.put("picUrl","../img/unonline.gif");
            map.put("date","2018-01-31 14:09:46");
            maps.add(map);
        }

        return maps;
    }


    @RequestMapping(value = {"","/","/CreateTree"})
    @ResponseBody
    public List<Map<String, Object>>  CreateTree()
    {
        List<Map<String, Object>> maps=new ArrayList<Map<String, Object>>();

        /*Map<String, Object> map = new HashMap<>();
        TbVehicle veh=(TbVehicle)redisTemplate.opsForValue().get("");*/
        List<testTrackTree> list=new ArrayList<testTrackTree>();
        Map<String, Object> msap = new HashMap<>();
        msap.put("ID",0);
        msap.put("PID",0);
        msap.put("NAME","陕西亿程");
        msap.put("TYPE",1);
        maps.add(msap);

        for(TbVehicle vh:dataTimer.vehicleInfoMap.values())
        {
            Map<String, Object> map = new HashMap<>();
            map.put("ID",vh.getVehicleId()+"_0");
            map.put("PID",0);
            map.put("NAME",vh.getVehicleNo());
            map.put("TYPE",2);
            map.put("icon","../../img/unonline.gif");
            maps.add(map);
        }

        return maps;
    }

    @RequestMapping(value = {"","/","/VehicleList"})
    @ResponseBody
    public net.sf.json.JSON VehicleList()
    {
        Map<String, Object> map = new HashMap<>();
        TbVehicle veh=(TbVehicle)redisTemplate.opsForValue().get("");
        return JSONSerializer.toJSON(veh);

    }





    public class testTrackTree
    {
        private int ID;
        private int PID;
        private String Name;
    }

    @RequestMapping(value = {"","/","/text"})
    String text() {
        return "text";
    }

    @RequestMapping(value = {"","/","/textinfo"})
    String textinfo() {
        try {
            WebSocketContainer container = ContainerProvider.getWebSocketContainer(); // 获取WebSocket连接器，其中具体实现可以参照websocket-api.jar的源码,Class.forName("org.apache.tomcat.websocket.WsWebSocketContainer");
            String uri = "ws://47.92.2.45:8195/collector/command";
            Session session = container.connectToServer(Client.class, new URI(uri)); // 连接会话
            session.getBasicRemote().sendText("123132132131"); // 发送文本消息
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "textinfo";
    }


    @RequestMapping(value = {"","/","Command/commandIndex"})
    public String commandIndex() {
        return "Command/commandIndex";
    }

    @RequestMapping(value = {"","/","Command/commandTree"})
    public String commandTree() {
        return "Command/commandTree";
    }

    @RequestMapping(value = {"","/","Command/command"})
    public String command() {
        return "Command/command";
    }
    @RequestMapping(value = {"","/","Command/commandSendtext"})
    public String commandSendtext() {
        return "Command/commandSendtext";
    }

    @RequestMapping(value = {"","/","Command/commandTerminal"})
    public String commandTerminal() {
        return "Command/commandTerminal";
    }

    @RequestMapping(value = {"","/","Command/commandSearchPhoto"})
    public String commandSearchPhoto() {
        return "Command/commandSearchPhoto";
    }

    @RequestMapping(value = {"","/","/CreateCommandTree"})
    @ResponseBody
    public List<Map<String, Object>>  CreateCommandTree()
    {
        List<Map<String, Object>> maps=new ArrayList<Map<String, Object>>();

        /*Map<String, Object> map = new HashMap<>();
        TbVehicle veh=(TbVehicle)redisTemplate.opsForValue().get("");*/
        List<testTrackTree> list=new ArrayList<testTrackTree>();
        Map<String, Object> msap = new HashMap<>();
        msap.put("ID",0);
        msap.put("PID",0);
        msap.put("NAME","指令下发");
        msap.put("TYPE",1);
        msap.put("open",true);
        maps.add(msap);

        Map<String, Object> map = new HashMap<>();
        map.put("ID",10);
        map.put("PID",0);
        map.put("NAME","终端参数设置");
        map.put("TYPE",2);
        maps.add(map);

        map = new HashMap<>();
        map.put("ID",3);
        map.put("PID",0);
        map.put("NAME","查询照片");
        map.put("TYPE",2);
        maps.add(map);

        return maps;
    }
}
