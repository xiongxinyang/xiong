package com.yicheng.proto;


import com.google.protobuf.ByteString;
import com.yicheng.protos.JttProtocol;
import com.yicheng.protos.JttRequestGrpc;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.stub.StreamObserver;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.RestController;
import sample.data.redis.SampleRedisApplication;

import java.util.concurrent.TimeUnit;

@Slf4j
@SpringBootApplication
public class RpcClient {
    public static String url="";
    public static String port="";
    private final ManagedChannel channel;
    private  JttRequestGrpc.JttRequestFutureStub asyncStub;
    private JttRequestGrpc.JttRequestStub stub;

    public RpcClient(String host, int port) {
        this(ManagedChannelBuilder.forAddress(host, port)
                .usePlaintext(true)
                .build());
    }

    /** Construct client for accessing RouteGuide server using the existing channel. */
    RpcClient(ManagedChannel channel) {
        this.channel = channel;
        asyncStub = JttRequestGrpc.newFutureStub(channel);
        stub = JttRequestGrpc.newStub(channel);
    }

    public void shutdown() throws InterruptedException {
        channel.shutdown().awaitTermination(5, TimeUnit.SECONDS);
    }

    //设备注册
    @SneakyThrows
    public void importDevice(String serverid,int devicetype,String deviceid){
        JttProtocol.DeviceInfo dev= JttProtocol.DeviceInfo.newBuilder()
                .setServiceId(serverid)
                .setDeviceType(devicetype)
                .setDeviceId(deviceid).build();
        JttProtocol.Respone respone =asyncStub.importDeviceInfo(dev).get(5, TimeUnit.SECONDS);
        log.info("返回信息：{}",respone.getMessage());
    }

    //订阅
    @SneakyThrows
    public void RegLocation(String serverid,int devicetype,String deviceid){
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
    public void unRegLocation(String serverid,int devicetype,String deviceid){
        JttProtocol.BaseRequest jtt = JttProtocol.BaseRequest.newBuilder()
                .setDeviceId(deviceid)
                .setDeviceType(devicetype)
                .setServiceId(serverid).build();

        JttProtocol.Respone respone = asyncStub.unSubVehicleLocation(jtt).get(5, TimeUnit.SECONDS);
    }

    //轨迹回放
    @SneakyThrows
    public void queryVehicleTark(String serverid,int devicetype,String deviceid){
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
    }

    @SneakyThrows
    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(SampleRedisApplication.class, args);
        Environment environment = context.getBean(Environment.class);

        url = environment.getProperty("serverTrack.url");
        port = environment.getProperty("serverTrack.port");
        //链接grpc
        //RpcClient client = new RpcClient(url, Integer.parseInt(port));
        //client.RegLocation("jtt",1,"");
    }


}
