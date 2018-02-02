package com.example.demo.websocket;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

/*import com.etrans.baf.api.common.exception.BissinessException;
import com.etrans.baf.collector.open.bsagent.impl.AgentManager;
import com.etrans.baf.collector.open.websocket.service.LoadLocalCache;*/

/**
 * websocket url映射配置
 * @author zzf
 */

@Configuration
@EnableWebSocket
@Controller
public class MainWebSocketConfigurer implements WebSocketConfigurer {


	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		try {
			//LoadLocalCache.initLocalCache();
			//AgentManager.start();//与Agent建立连接

			registry.addHandler(trackWebSocketListener(), "/track");//车辆订阅
			registry.addHandler(trackWebSocketListener(), "/sockjs/track");//车辆订阅
			registry.addHandler(onlineSocketListener(), "/online");//车辆上下线
			registry.addHandler(trackbackWebSocketListener(), "/trackback");//车辆轨迹回放
			registry.addHandler(trackbackWebSocketListener(), "/sockjs/trackback");//车辆轨迹回放

			registry.addHandler(commandWebSocketListener(), "/commandorder");//指令下发
			registry.addHandler(commandWebSocketListener(), "/sockjs/commandorder");//指令下发
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	
	//车辆订阅
	@Bean
	public TrackWebSocketListener trackWebSocketListener() {
		return new TrackWebSocketListener();
	}

	//车辆轨迹回放
	@Bean
	public TrackBackWebSocketListener trackbackWebSocketListener() {
		return new TrackBackWebSocketListener();
	}

	//车辆上下线 企业中车辆上线数
	@Bean
	public OnlineSocketListener onlineSocketListener() {
		return new OnlineSocketListener();
	}
	//指令下发
	@Bean
	public CommandWebSocketListener commandWebSocketListener() {
		return new CommandWebSocketListener();
	}

}
