var requestMap = null;  
var sendCommandHM = null;//存放下发的后台产生指令流水号，
var sendVehicleHM = null;//发送中的车辆
var waitVehicleHm = null;//等待结果中的车辆
var timestamp;
var commandUtil = new CommandUtil();
//公用指令发送
$(function(){
	$("#commandpage").load("command.html")
	requestMap = new HashMap();
	sendCommandHM = new HashMap();
	sendVehicleHM = new HashMap();
	waitVehicleHm = new HashMap();
	webSocketConnect();
	 
});
var vid;
var commandId;
function sendCommand(){ 
	if(typeof checkParam === 'function'){
		//调用各指令页面的方法校验输入参数
		if(!checkParam()){
			return;
		}
	}
	debugger;
	resetInfo();//重置信息
	$("#sendCommand").unbind("click");
	$("#sendImg_go").attr("src",basePath+"/img/command/ico5.png");
	$("#sendImg_wait").attr("src",basePath+"/img/command/ico2.gif");
	//取指令，来源于指令页面
	commandId = $("#commandId").val();

	//调用指令页面的getParams()方法 取指令参数
	var commandParams = getParams();
	//时间戳
    timestamp=Date.parse(new Date());
    $("#vehicleUl li").each(function(){
		vid = $(this).attr("vid");
		sendVehicleHM.put(vid,vid);
		var param = new Object();
		param.Command = commandId;

		param.requestId=timestamp;
		//param.UserID = USERID;
		var bodyData = {VehicleID:vid,Instruction:commandId,Parameter:commandParams};
		//param.Sequence = commandParams.CameraIndex;
		param.Body = bodyData;
		console.log("command:"+JSON.stringify(param));
		sendWebSocketData(JSON.stringify(param));
		$(this).find("img").attr("src",basePath+"/img/command/downing.png").show();
	}); 
	
	$("#sendImg_waitSpan").text($("#vehicleUl li").size());
    
	//将参数区域 收起来
	$("#optSpan2").css("background-image","url("+basePath+"/img/command/hide.png)");
	$("#pDiv").slideUp();
	
}

function SearchOnePic(pic) {
    var params = new Object();
    param.picCode=pic;


    timestamp=Date.parse(new Date());
    var param = new Object();
    param.Command = 4;

    param.requestId=timestamp;
    //param.UserID = USERID;
    var bodyData = {VehicleID:vehicleId,Instruction:4,Parameter:params};
    //param.Sequence = commandParams.CameraIndex;
    param.Body = bodyData;

    sendWebSocketData(JSON.stringify(param));
}

/*function getParamSize(){
	//遍历所有参数框，取参数个数
	var paramSize;
	var len = "param".length;
	$(":input").each(function(index,dom){
		var id = $(dom).attr("id");
		if(typeof(id) != "undefined"){
			var i = id.indexOf("param");
			if(i > -1){
				paramSize = parseInt(id.substring(len));
			}
		}
	});
	return paramSize;
}*/

function sendWebSocketData(data){
	if(ws == null){
		webSocketConnect();
}
if (ws != null&&isConnect==true) {
    isConnect = true;
    //var param = '{"COMMAND_ID":"3","USERID":"1","VEHICLES":["10"],"commandId":"389","commandCode":"0x830","commandArgs":"1,1,0,0,1,1,0,0,0,0","commandBody":""}';
    ws.send(data); //查询参数
} else {

}
}
var ws =null;
//webSocket连接
var  isConnect = false;
function webSocketConnect() {
	try{
		var url = "";
		if ('WebSocket' in window){
			url = webSocketUrl +"/commandorder";
			ws = new WebSocket(url);
		} else{
			var options = {protocols_whitelist: ["websocket", "xhr-streaming", "xdr-streaming", "xhr-polling", "xdr-polling", "iframe-htmlfile", "iframe-eventsource", "iframe-xhr-polling"], debug: true};
			var urls = webSocketUrl.split("ws");
			url = "http" + urls[1] +"/sockjs/commandorder";
			//url = webSocketUrlSockJS + "/sockjs/command";
			//ws = new SockJS(url,undefined,options);
			//console.info("url"+url);
			ws = new SockJS(url);
		}
	    
	    ws.onopen = function () {
	    	isConnect = true;
	    };
	    ws.onmessage = function (event) { //数据回传
            var obj = eval("("+event.data+")");
            if(obj!=null)
			{
                if(obj.result.indexOf("成功")>0)
                {
                    $("#sendCommand").unbind("click");
                    $("#vehicleResultUl").html(obj.result);
                }
                else if(obj.result.indexOf("失败")>0)
                {
                    $("#sendCommand").unbind("click");
                    $("#vehicleResultUl").html(obj.result);
                }
                else
                {
                    if(obj.commandId==3)
                    {
                        //照片查询
                        var picUrl=obj.result;
                        var picurls=picUrl.split(',');
                        for(var i=0;i<picurls.length;i++)
                        {
                            $("#vehicleResultDiv").append("<a id='pic_"+i+"' onclick='SearchOnePic("+picurls[i]+")'>"+picurls[i]+"</a>");
                        }
                    }
                    else if(obj.commandId==4)
                    {
                    	//单个照片查询
                        $("#vehicleResultDiv").append("<img src='"+obj.result+"'>");
                    }
                    else if(obj.commandId==2)
					{
						//上传照片
                        $("#vehicleResultDiv").append("<img src='"+obj.result+"'>");
					}
					else
					{
                        $("#vehicleResultUl").append(obj.result);
					}

                }
                //$("#sendCommand").unbind("click");

                $("#sendVehicleCountSpan").html(0);
                $("#finish_waitSpan").html(1);

                $("#vehicleStateImg"+vehicleId).attr("src",basePath+"/img/command/ok.png").show();//更新车辆的下发状态图片
                $("#sendImg_wait").attr("src",basePath+"/img/command/ico1.png");
                $("#waitResult_go").attr("src",basePath+"/img/command/ico5.png");
                $("#waitResult_wait").attr("src",basePath+"/img/command/ico1.png");
                $("#finish_go").attr("src",basePath+"/img/command/ico5.png");
                $("#finish_wait").attr("src",basePath+"/img/command/ico1.png");
			}


			//}


	    	/*var obj = eval("("+event.data+")");
	    	console.log("obj"+JSON.stringify(obj)+"");
	    	commandUtil.onResult(obj);//用于自定义的回调

            if(obj.RETURN_CODE==13 && obj.stepNO == 0){//由前端已发送到后台
                requestMap.put(obj.requestID,obj.vehicleID);
            }
            if(obj.RETURN_CODE==13 && obj.stepNO == 1){ //后台发送到指令服务器 收到回执 说明已经下发到终端 格式{"genTime":1432050920321,"userID":1,"requestID":1,"recepitID":112,"RETURN_CODE":"13"}
                var vehicleID = requestMap.get(obj.requestID) //取得终端返回的流水号
                if(vehicleID!=null){//是否当前指令下发的回复结果
                    sendVehicleHM.remove(vehicleID);
                    waitVehicleHm.put(vehicleID,vehicleID);
                    $("#sendImg_waitSpan").html(sendVehicleHM.size());
                    $("#waitResult_waitSpan").html(waitVehicleHm.size());
                    $("#vehicleStateImg"+vehicleID).attr("src",basePath+"/img/command/uping.png").show();//更新车辆的下发状态图片
                    $("#vehicleImg").attr("src",basePath+"/img/command/wait.png");
                    $("#sendImg_wait").attr("src",basePath+"/img/command/ico1.png");
                    $("#waitResult_go").attr("src",basePath+"/img/command/ico5.png");
                    $("#waitResult_wait").attr("src",basePath+"/img/command/ico2.gif");
                }
            }


	    	if(obj.Command==3){
	    		//发送指令响应结果，已由前端推到后端，后端推到接入平台
                if(obj.requestID==timestamp)
				{
                    var vid = requestMap.get(obj.requestID);//取得该回执号的对应的 辆车
                    if(vid!=null) {
                        waitVehicleHm.remove(vid);
                        $("#vehicleStateImg"+vid).attr("src",basePath+"/img/command/ok.png").show();//更新车辆的下发状态图片

                        var no = $("#vehicleSpan"+vid).text();
                        var resultli =$("#vehicleResultUl").find("li[id$='vehicleResultli"+vid+"']");
                        if(resultli.length>0){
                            $("#vehicleResultli"+vid).html(no+":"+obj.replyBody+" "+getNowTime() );
                        }else{

                            var tr = "<li id='vehicleResultli"+vid+"'>"+no+":"+obj.replyBody+"</li>";
                            $("#vehicleResultUl").append(tr);

                            $("#waitResult_waitSpan").html(waitVehicleHm.size());

                            var fc = $("#finish_waitSpan").html();
                            $("#finish_waitSpan").html(fc==""?"1":parseInt(fc)+1);

                        }
                        var fcout = $("#finish_waitSpan").html();
                        if(parseInt(fcout)==$("#vehicleUl li").size()){
                            $("#sendCommand").bind("click",sendCommand);
                        }

                        $("#sendImg_wait").attr("src",basePath+"/img/command/ico1.png");
                        $("#waitResult_go").attr("src",basePath+"/img/command/ico5.png");
                        $("#waitResult_wait").attr("src",basePath+"/img/command/ico1.png");
                        $("#finish_go").attr("src",basePath+"/img/command/ico5.png");
                        $("#finish_wait").attr("src",basePath+"/img/command/ico1.png");
                    }
				}

	    	}*/

	    };
	    ws.onclose = function (event) {
	    	isConnect = false;
	    };
	}catch(ex){
		//console.error(ex);
	}
}
//指令完成处理
/*function finish(vehicleID){
	waitVehicleHm.remove(vehicleID);
	$("#vehicleStateImg"+vehicleID).attr("src",basePath+"/img/command/ok.png").show();//更新车辆的下发状态图片
	
	//var no = $("#vehicleSpan"+vehicleID).text();
	var no=vehicleNO;
	var resultli =$("#vehicleResultUl").find("li[id$='vehicleResultli"+vehicleID+"']");
	//从指令页面获取展示的html
	if(typeof getResultHtml!='undefined' ){
		replyBody = getResultHtml();
	}
	//var resultHtml = getResultHtml(replyBody);
	if(resultli.length>0){
		$("#vehicleResultli"+vehicleID).html(no+":"+replyBody+" "+getNowTime() );
	}else{
		var tr = "<li id='vehicleResultli"+vehicleID+"'>"+no+":"+replyBody+"</li>";
		$("#vehicleResultUl").append(tr);
		
	    $("#waitResult_waitSpan").html(waitVehicleHm.size());
	    
		var fc = $("#finish_waitSpan").html();
		$("#finish_waitSpan").html(fc==""?"1":parseInt(fc)+1);
		
	}
	var fcout = $("#finish_waitSpan").html();
	if(parseInt(fcout)==$("#vehicleUl li").size()){
		$("#sendCommand").bind("click",sendCommand);
	}
	
	$("#sendImg_wait").attr("src",basePath+"/img/command/ico1.png");
	$("#waitResult_go").attr("src",basePath+"/img/command/ico5.png");
	$("#waitResult_wait").attr("src",basePath+"/img/command/ico1.png");
	$("#finish_go").attr("src",basePath+"/img/command/ico5.png");
	$("#finish_wait").attr("src",basePath+"/img/command/ico1.png");
}*/
//关闭连接
function disconnect() {
    if (ws != null) {
        ws.close();
        ws = null;
    }
}

function cancleSend(){
	if(sendVehicleHM.size()>0||waitVehicleHm.size()>0){ //判断是否还有正在等待结果的车辆
		 if(!confirm('还有等待结果的车辆, 是否取消')){
			 return;
		 }
		}
	resetInfo();
	$("#sendCommand").bind("click",sendCommand);
}

//重置
function resetInfo(){

	sendCommandHM.clear();
	requestMap.clear();
	sendVehicleHM.clear();
	waitVehicleHm.clear();
	$("#vehicleResultUl li").remove();
	$("#vehicleUl img").hide();
	
	$("#sendVehicleCountSpan").text(0);
	$("#sendImg_waitSpan").text(0);
	$("#waitResult_waitSpan").text(0);
	$("#finish_waitSpan").text(0);
	
	
	$("#sendImg_go").attr("src",basePath+"/img/command/ico6.png");
	$("#sendImg_wait").attr("src",basePath+"/img/command/ico3.png");
	$("#waitResult_go").attr("src",basePath+"/img/command/ico6.png");
	$("#waitResult_wait").attr("src",basePath+"/img/command/ico3.png");
	$("#finish_go").attr("src",basePath+"/img/command/ico6.png");
	$("#finish_wait").attr("src",basePath+"/img/command/ico3.png");
}

//得到当前时间
function getNowTime(){
	try{
		var nowDate = "";
		var d = new Date();
		var hour = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
		var minute = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
		var second = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
		nowDate  = hour +":"+ minute +":"+ second; 
		return nowDate
	}catch(ex){
		//console.error(ex);
	}
	
}
//下拉显示与隐藏
function hideDiv(obj,divid){
	if($(divid).is(":hidden")){
	  $(obj).css("background-image","url("+basePath+"/img/command/show.png)");
	  $(divid).slideDown();
	}else{
	  $(obj).css("background-image","url("+basePath+"/img/command/hide.png)");
	  $(divid).slideUp();
	} 
}



/***
 * 指令发送 方法封装
 * zzf
 */ 
function CommandUtil(){
	
	//var isCustomResult = false;//是否自定义结果返回方法
    /***
     * 发送参数
     */
	this.sendData = function(ws,data) {
	   try{ 
		    ws.send(data); 
		 }catch(ex){
		    //console.log(ex);
	   }
	}
    /***
     * 结果返回
     */
	this.onResult = function(data) {
		 
	}
	
   }
