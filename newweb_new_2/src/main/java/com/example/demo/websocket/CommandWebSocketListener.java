package com.example.demo.websocket;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.example.demo.DemoApplication;
import com.example.demo.client.RpcClient;
import com.example.demo.domain.*;
import com.example.demo.timer.CommandDispatchTimer;
import com.example.demo.timer.TrackDispatchTimer;
import com.example.demo.timer.dataTimer;
import com.yicheng.protos.JttProtocol;
import io.grpc.stub.StreamObserver;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

/**
 * Created by xiong on 2017/11/22.
 */
@Slf4j
public class CommandWebSocketListener extends TextWebSocketHandler {

    final static SimpleDateFormat splDf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    private static Map<String,Integer> commandVehicle=new HashMap<String,Integer>();
    private static final Logger logger = LoggerFactory.getLogger(CommandWebSocketListener.class.getSimpleName());
    final Executor executor = Executors.newCachedThreadPool();
    //private final Executor executor = Executors.newFixedThreadPool(8);
    final Map<Integer, TbVehicle> vehicleInfo = new HashMap<>();


    /**
     * 建立连接
     * 将session放入到全局的sessionHashMap
     */
    @Override
    public void afterConnectionEstablished(WebSocketSession session)throws Exception {
        super.afterConnectionEstablished(session);
        logger.info("建立连接:{} sessionID:{}", session.getRemoteAddress(), session.getId());

        CommandDispatchTimer websocketSessionManager = new CommandDispatchTimer(executor, session);
        websocketSessionManager.wsCommandSessionMap.put(session.getId(), websocketSessionManager);

		/*TrackWebsoketSession trackWebsoketSession = new TrackWebsoketSession(executor, session);
		LocalCache.wsTrackSessionMap.put(session.getId(), trackWebsoketSession);*/
    }

    /**
     * 断开连接
     */
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        super.afterConnectionClosed(session, status);

        CommandDispatchTimer websocketSessionManager = CommandDispatchTimer.wsCommandSessionMap.get(session.getId());
        if(websocketSessionManager != null){
            CommandDispatchTimer.wsCommandSessionMap.remove(session.getId());
        }
        websocketSessionManager = null;
        logger.info("断开连接:{} sessionID{}", session.getRemoteAddress(), session.getId());
    }


    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        super.handleTextMessage(session, message);

        JSONObject acceptMsgJson = null;
        try{
            //Command = "3"   Body={VehicleID:vid,Instruction:commandId,Parameter:commandParams}
            //调用接口  保存指令及结果，返回结果
            String result=message.getPayload();

            SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            //车辆ID
            JSONObject request = (JSONObject) JSON.parse(result);
            // Command ID
            int Command=request.getIntValue("Command");

            // requestId  需要传到 接口
            long requestId=request.getIntValue("requestId");

            JSONObject body=request.getJSONObject("Body");

            JSONObject param=JSON.parseObject(body.getString("Parameter"));
            //车辆ID
            Integer vehicles = JSON.parseObject(body.getString("VehicleID"), new TypeReference<Integer>(){});
            //参数信息
            //String Parameter = JSON.parseObject(body.getString("Parameter"), new TypeReference<String>(){});
            //CommandDispatchTimer trackbackWebsoketSession = CommandDispatchTimer.wsCommandSessionMap.get(session.getId());
            RpcClient client = new RpcClient(DemoApplication.url,Integer.parseInt(DemoApplication.port));
            //判断是否需要执行
            boolean bClient=false;
            TbVehicle vehicleInfo = dataTimer.vehicleInfoMap.get(vehicles); //找到对应的车 如果没有找到 则表示没有数据过来
            if(vehicleInfo != null) {

                if(!commandVehicle.containsKey(vehicleInfo.getVehicleId() + "_" + Command)) {
                    commandVehicle.put(vehicleInfo.getVehicleId() + "_" + Command, 1);
                    bClient=true;
                }
                else
                {
                    if(commandVehicle.get(vehicleInfo.getVehicleId() + "_" + Command).equals(0)) {
                        bClient=true;
                    }
                    else
                    {
                        bClient=false;
                        session.sendMessage(new TextMessage("操作失败！"));
                    }
                }

                if(bClient==true)
                {
                    StreamObserver<JttProtocol.Respone> streamObserver = new StreamObserver<JttProtocol.Respone>() {
                        @Override
                        public void onNext(JttProtocol.Respone respone) {
                            try {
                                //1、该处 车辆ID及指令ID  为 接口传来的 2:、将车辆ID及指令ID传回页面
                                commandVehicle.put(vehicleInfo.getVehicleId() + "_" + Command, 0);
                                String message = respone.getMessage();
                                CommandResult result=new CommandResult();
                                result.setCommandId(Command);
                                result.setResult(message);
                                String jsons = JSON.toJSONString(result);
                                session.sendMessage(new TextMessage(jsons));
                            } catch (IOException ex) {

                            }

                        }

                        @Override
                        public void onError(Throwable throwable) {
                            log.error(throwable.getMessage());
                        }

                        @Override
                        public void onCompleted() {
                        }
                    };


                    if (Command == 2) {
                        //拍照
                        String uploadMode = param.getString("uploadMode");
                        String cameraChannel = param.getString("cameraChannel");
                        String pictureSize = param.getString("pictureSize");

                        //调用接口
                        //commandID
                        JttProtocol.CommandId commandId = JttProtocol.CommandId.TakePhoto;


                        //立即拍照消息数据格式
                        JttProtocol.TakePhotoCommandBody jtt = JttProtocol.TakePhotoCommandBody.newBuilder()
                                .setUploadMode(Integer.parseInt(uploadMode))
                                .setCameraChannel(Integer.parseInt(cameraChannel))
                                .setPictureSize(Integer.parseInt(pictureSize)).build();

                        client.takePhotoCommand("jtt", vehicleInfo.getKindID(), vehicleInfo.getSimCardNo(), commandId, jtt, streamObserver);
                    }

                    if (Command == 3) {
                        //查询照片

                        //开始时间
                        String BeginTime = request.getString("startTime");
                        Date BeginTime_date = sdf.parse(BeginTime);
                        //结束时间
                        String EndTime = request.getString("endTime");
                        Date EndTime_date = sdf.parse(EndTime);

                        //调用接口
                        //commandID
                        JttProtocol.CommandId commandId = JttProtocol.CommandId.SearchPhoto;


                        //查询照片数据格式
                       /* JttProtocol.TerminalControlCommandBody jtt = JttProtocol.TerminalControlCommandBody.newBuilder()
                                .setCommandCode(commandCode)
                                .setCommandParameter(commandParameter).build();

                        client.terminalControlCommand("jtt", vehicleInfo.getKindID(), vehicleInfo.getSimCardNo(), commandId, jtt, streamObserver);*/
                    }

                    if (Command == 4) {
                        //查询单个照片
                        String picCode = request.getString("picCode");

                        JttProtocol.CommandId commandId = JttProtocol.CommandId.UpLoadSpecifiedPhoto;
                    }
                    if (Command == 10) {
                        //终端参数设置
                        //命令字
                        Integer commandCode = param.getInteger("commandCode");
                        //命令参数
                        String commandParameter = param.getString("commandParameter");
                        //调用接口
                        //commandID
                        JttProtocol.CommandId commandId = JttProtocol.CommandId.TerminalControl;


                        //立即拍照消息数据格式
                        JttProtocol.TerminalControlCommandBody jtt = JttProtocol.TerminalControlCommandBody.newBuilder()
                                .setCommandCode(commandCode)
                                .setCommandParameter(commandParameter).build();

                        client.terminalControlCommand("jtt", vehicleInfo.getKindID(), vehicleInfo.getSimCardNo(), commandId, jtt, streamObserver);
                    }
                }
            }
            else{
                session.sendMessage(new TextMessage("Redis无车辆id为"+vehicles+"的数据！"));
            }



        }catch(Exception e){
            logger.error("handleTextMessage err: ", e);
            return;
        }
    }
}
