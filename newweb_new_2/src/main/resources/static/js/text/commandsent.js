
//公用指令发送
$(function(){
	webSocketConnect();
	 
});

function MsgBodys(){
    this.COMMAND_ID = null;

    this.USERID = null;
    this.VEHICLES = null;
    this.commandId = null;
    this.commandCode = null;
    this.commandArgs = null;
    this.commandBody = null;
	this.requestID=null;
    // 如需更多信息，在实例化之后，直接添加进去
    // 发送前，用这个转换为字符串 JSON.stringify(实例名) 即可
}
var timestamp = "";
function sendcommand() {
    timestamp = Date.parse(new Date());
    var msg = new MsgBodys();

    //查询录像
    msg.COMMAND_ID= "3";
    msg.USERID= "1";
    msg.VEHICLEID= "25";
    msg.commandId= "904510";
    msg.commandCode= "8900";
    msg.commandArgs= "13,8D06,1,2017-12-05 7:00:00,2017-12-05 9:00:00, ";
    msg.commandBody= "";
    msg.requestID=timestamp;
    sendWebSocketData(msg);

  /*  //上传指定录像
    msg.VEHICLEID= "25";
    msg.USERID= "1";
    msg.commandId= "904511";
    msg.commandCode= "8900";
    msg.commandBody= "";
    msg.commandArgs= "13,8D08,1";
    msg.requestID=timestamp;


    //二维码比对指令
    msg.VEHICLEID= "25";
    msg.USERID= "1";
    msg.commandId= "904508";
    msg.commandCode= "8900";
    msg.commandArgs= "13,8D05, , , ,1";
    msg.requestID=timestamp;


    //平台参数设置
    msg.VEHICLEID= "25";
    msg.USERID= "1";
    msg.commandId= "904509";
    msg.commandCode= "8900";
    msg.commandBody= "";
    msg.commandArgs= "13,8D04,1,1,1,1,1,1 ";
    msg.requestID=timestamp;*/
}

function sendWebSocketData(data){
    if(ws == null){
        webSocketConnect();
    }
    if (ws != null && ws.readyState == 1) {
        if(typeof data == "object")
            data = JSON.stringify(data);
        ws.send(data); //查询参数
    } else {
        //console.log("服务器连接失败！请重试");
    }
}  
var ws =null;
//webSocket连接
var  isConnect = false;
var webSocketUrl="ws://47.92.2.45:8195/collector";
function webSocketConnect() {
	try{
		var  url   =  webSocketUrl  + "/command";
	    ws = new WebSocket(url);
	    ws.onopen = function () {
	    	isConnect = true;
	    };
	    ws.onmessage = function (event) { //数据回传

	    	var obj = eval("("+event.data+")");
            if(obj.RETURN_CODE==13 && obj.stepNO == 0){//由前端已发送到后台
                $("#input_text").append("指令发送成功"+"<br>");
            }
            if(obj.RETURN_CODE==13 && obj.stepNO == 1){ //后台发送到指令服务器 收到回执 说明已经下发到终端 格式{"genTime":1432050920321,"userID":1,"requestID":1,"recepitID":112,"RETURN_CODE":"13"}
                $("#input_text").append("终端收到指令"+"<br>");
            }
            if(obj.RETURN_CODE==3) {//通用应答

                if(obj.commandID==3334|| obj.commandID==3335 ||obj.commandID==3336)
                {
                    if(obj.requestID==timestamp)
                    {
                        $("#input_text").append(event.data+"<br>");
                    }

                }
            }


	    	

	    };
	    ws.onclose = function (event) {
	    	isConnect = false;
	    };
	}catch(ex){
		console.error(ex);
	}
}
//关闭连接
function disconnect() {
    if (ws != null) {
        ws.close();
        ws = null;
    }
}
