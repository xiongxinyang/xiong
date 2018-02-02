package com.example.demo;
import com.example.demo.domain.TbVehicle;
import com.example.demo.timer.dataTimer;
import com.yicheng.protos.JttProtocol;
import com.yicheng.protos.JttRequestGrpc;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.stub.StreamObserver;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import net.sf.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.scheduling.annotation.EnableScheduling;

import javax.websocket.ContainerProvider;
import javax.websocket.Session;
import javax.websocket.WebSocketContainer;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
@Slf4j
@SpringBootApplication
@EnableScheduling
public class DemoApplication implements CommandLineRunner {
	public static String url="";
	public static String port="";

	@Autowired
	private static  RedisTemplate redisTemplate;
	@Autowired
	private StringRedisTemplate template;

	@Override
	public void run(String... args) throws Exception {
		ValueOperations<String, String> ops = this.template.opsForValue();
		String key = "spring.boot.redis.test";
		if (!this.template.hasKey(key)) {
			ops.set(key, "foo");
		}
		System.out.println("Found key " + key + ", value=" + ops.get(key));
	}
/*	public static  ManagedChannel channel;
	public static  JttRequestGrpc.JttRequestFutureStub asyncStub;
	*//*public static JttRequestGrpc.JttRequestStub stub;*//*
	//public static ExecutorService cachedThreadPool = Executors.newCachedThreadPool();
	public DemoApplication(String host, int port) {
		this(ManagedChannelBuilder.forAddress(host, port)
				.usePlaintext(true)
				.build());
	}
	public DemoApplication()
	{

	}

	*//** Construct client for accessing RouteGuide server using the existing channel. *//*
	DemoApplication(ManagedChannel channel) {
		this.channel = channel;
		asyncStub = JttRequestGrpc.newFutureStub(channel);
		*//*stub = JttRequestGrpc.newStub(channel);*//*
	}

	public void shutdown() throws InterruptedException {
		channel.shutdown().awaitTermination(5, TimeUnit.SECONDS);
	}*/

	/*//设备注册
	@SneakyThrows
	public static void importDevice(String serverid,int devicetype,String deviceid){
		JttProtocol.DeviceInfo dev= JttProtocol.DeviceInfo.newBuilder()
				.setServiceId(serverid)
				.setDeviceType(devicetype)
				.setDeviceId(deviceid).build();
		JttProtocol.Respone respone =asyncStub.importDeviceInfo(dev).get(5, TimeUnit.SECONDS);
		log.info("返回信息：{}",respone.getMessage());
	}

	//订阅
	@SneakyThrows
	public static void RegLocation(String serverid,int devicetype,String deviceid){
		JttProtocol.BaseRequest jtt = JttProtocol.BaseRequest.newBuilder()
				.setDeviceId(deviceid)
				.setDeviceType(devicetype)
				.setServiceId(serverid).build();


		new Thread(() -> stub.subVehicleLocation(jtt, new StreamObserver<JttProtocol.Respone>() {

			@Override
			public void onNext(JttProtocol.Respone respone) {
				log.info("接收数据：{}",respone.getMessage());
			}

			@Override
			public void onError(Throwable throwable) {
			}

			@Override
			public void onCompleted() {
			}
		})).start();
	}

	//取消订阅
	@SneakyThrows
	public static void unRegLocation(String serverid,int devicetype,String deviceid){
		JttProtocol.BaseRequest jtt = JttProtocol.BaseRequest.newBuilder()
				.setDeviceId(deviceid)
				.setDeviceType(devicetype)
				.setServiceId(serverid).build();

		JttProtocol.Respone respone = asyncStub.unSubVehicleLocation(jtt).get(5, TimeUnit.SECONDS);
	}

	//轨迹回放
	@SneakyThrows
	public static void queryVehicleTark(String serverid,int devicetype,String deviceid){
		JttProtocol.BaseRequest jtt = JttProtocol.BaseRequest.newBuilder()
				.setDeviceId(deviceid)
				.setDeviceType(devicetype)
				.setServiceId(serverid).build();
		JttProtocol.QueryVehicleTrack dev= JttProtocol.QueryVehicleTrack.newBuilder()
				.setBaseRequest(jtt)
				.setStartTime(1)
				.setEndTime(1).build();


		new Thread(() -> stub.queryVehicleTark(dev, new StreamObserver<JttProtocol.Respone>() {

			@Override
			public void onNext(JttProtocol.Respone respone) {
				log.info("接收数据：{}",respone.getMessage());
			}

			@Override
			public void onError(Throwable throwable) {
			}

			@Override
			public void onCompleted() {
			}
		})).start();
	}*/

	@SneakyThrows
	public static void main(String[] args) {

		ConfigurableApplicationContext context = SpringApplication.run(DemoApplication.class, args);
		Environment environment = context.getBean(Environment.class);
		url = environment.getProperty("serverTrack.url");
		port = environment.getProperty("serverTrack.port");
		//加载基础数据

/*		ConfigurableApplicationContext context = SpringApplication.run(DemoApplication.class, args);
		Environment environment = context.getBean(Environment.class);
		String url = environment.getProperty("serverTrack.url");
		String port = environment.getProperty("serverTrack.port");
		//链接grpc
		DemoApplication client = new DemoApplication(url, Integer.parseInt(port));*/
	}
}
