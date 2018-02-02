package com.example.demo.timer;

import com.example.demo.websocket.CommandWebSocketListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by xiong on 2017/12/19.
 */
public class CacheManager {

    @Autowired
    private static Environment environment;



    private HashMap<String, List<HashMap<String, Object>>> userUnit = new HashMap<String, List<HashMap<String, Object>>>();

    public static String getPropValueByCode(String code)
    {
        return environment.getProperty(code);
    }
}
