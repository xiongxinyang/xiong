package com.example.demo.client;

import com.alibaba.fastjson.JSON;
import com.yicheng.protos.JttProtocol;
import com.yicheng.protos.JttRequestGrpc;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.StatusRuntimeException;
import io.grpc.stub.StreamObserver;
import lombok.Getter;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

/**
 * Created by xiong on 2017/12/1.
 */
@Slf4j
@Getter
@SpringBootApplication
public class RpcClient {
    private  ManagedChannel channel;

    /**
     * Construct client connecting to HelloWorld server at {@code host:port}.
     */
    public RpcClient(String host, int port) {
        this(ManagedChannelBuilder.forAddress(host, port)
                .usePlaintext(true)
                .build());
    }
    public RpcClient(){}

    /**
     * Construct client for accessing RouteGuide server using the existing channel.
     */
   private  RpcClient(ManagedChannel channel) {
        this.channel = channel;
    }

    public void shutdown() throws InterruptedException {
        channel.shutdown().awaitTermination(5, TimeUnit.MINUTES);
    }
    //轨迹回放
    @SneakyThrows
    public final void queryVehicleTark(String serverid,int devicetype,String deviceid,long begintime,long endtime,StreamObserver<JttProtocol.Respone> streamObserver){
        JttRequestGrpc.JttRequestStub stub = JttRequestGrpc.newStub(channel);
        JttProtocol.BaseRequest jtt = JttProtocol.BaseRequest.newBuilder()
                .setDeviceId(deviceid)
                .setDeviceType(devicetype)
                .setServiceId(serverid).build();
        JttProtocol.QueryVehicleTrack dev= JttProtocol.QueryVehicleTrack.newBuilder()
                .setBaseRequest(jtt)
                .setStartTime(begintime)
                .setEndTime(endtime).build();


        stub.queryVehicleTark(dev, streamObserver);
    }
    //订阅
    public final  void subVehicleLocation(String serverid,int devicetype,String deviceid,StreamObserver<JttProtocol.Respone> streamObserver) {

        try {

            JttRequestGrpc.JttRequestStub stub = JttRequestGrpc.newStub(channel);
            JttProtocol.BaseRequest baseRequest = JttProtocol.BaseRequest.newBuilder()
                    .setDeviceId(deviceid).setDeviceType(devicetype).setServiceId(serverid).build();
            stub.subVehicleLocation(baseRequest,streamObserver);
        } catch (StatusRuntimeException e) {
            log.info("RPC failed: {}", e.getStatus());
        }

    }

    //取消订阅
    @SneakyThrows
    public final String unSubVehicleLocation(String serverid,int devicetype,String deviceid){

        try{
            JttRequestGrpc.JttRequestFutureStub asyncStub = JttRequestGrpc.newFutureStub(channel);
            JttProtocol.BaseRequest jtt = JttProtocol.BaseRequest.newBuilder()
                    .setDeviceId(deviceid)
                    .setDeviceType(devicetype)
                    .setServiceId(serverid).build();

            JttProtocol.Respone respone = asyncStub.unSubVehicleLocation(jtt).get(5, TimeUnit.SECONDS);
            return respone.getMessage();
        }
        catch (StatusRuntimeException e) {
            return "RPC failed: {}"+e.getStatus();
            }
    }

    //设备注册
	@SneakyThrows
	public final void importDevice(String serverid,int devicetype,String deviceid){
        try {
            JttRequestGrpc.JttRequestFutureStub asyncStub = JttRequestGrpc.newFutureStub(channel);
            JttProtocol.DeviceInfo dev= JttProtocol.DeviceInfo.newBuilder()
                    .setServiceId(serverid)
                    .setDeviceType(devicetype)
                    .setDeviceId(deviceid).build();
            JttProtocol.Respone respone =asyncStub.importDeviceInfo(dev).get(5, TimeUnit.SECONDS);
            log.info("返回信息：{}",respone.getMessage());
        }
        catch (StatusRuntimeException e)
        {
            log.info("RPC failed: {}", e.getStatus());
        }

	}








}
