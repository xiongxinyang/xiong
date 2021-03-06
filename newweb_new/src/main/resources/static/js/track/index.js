/**
 * Created by xiong on 2017/11/15.
 */
var winCloseCount = 0;
var leftPanelShow = true;// 左侧面板是否显示
var MonitorConf = {};
MonitorConf.platerNum = true;
MonitorConf.speed = false;
MonitorConf.state = false;
MonitorConf.autoSubscribe = false;
MonitorConf.gpsTime = false;
MonitorConf.showCluster = false;
var GlobalSubscribeVehicle= new HashMap(); // 订阅的车辆 key:Id value:车辆最后条轨迹 json格式
var GlobalGpsCache=new HashMap();  // Gps轨迹数据本地缓存  key:Id value:dhtmlxgrid的数据行，{id:xx,data:[]}
var _filterArray = [],currentStatus=0;
var GlobalMarkerCache = new HashMap(); //地图车辆缓存  key: Id value:marker
var GlobalTrackingCache = new HashMap(); // 用于订阅列表点击跳转到重点监控 Key:车牌号 value:车辆ID
var GlobalGridField = [];
$(function() {

    bindChangeMap();
    changeMap("baiduGis");

    //reloadGridData();



    initMonitorWS();
    // mapUtil  = new MapUtil("googleGis");//baiduGis
    //mapUtil  = new MapUtil("googleGis");//baiduGis
    //mapUtil.loadMap("mapDiv");

//	try {
    PageResize();//初始大小
    //loadColumns();
    window.onresize = PageResize;

    $(document).keyup(function(e) {
        if (e.keyCode == "13") {
            var _id = $(e.target).attr("id");
            if(_id == "txtVehicleSearch"){
                queryVehicle();
            }/*else if(_id == "smartSearchTxt"){
             smartSearch();
             }*/
        }
    });

    $("#nResizeDiv").bind("mousedown", nResizeMousedown);//拖拽

    $("#rightPanelSpan").bind("click", function(){ //是否打开控制面板
        if ($("#queryPanelDiv").is(":hidden")) {
            $("#queryPanelDiv").show();
        }else{
            $("#queryPanelDiv").hide();
        }
    });


    $("#mapAllLi").bind("click", function(){
        changeMapSize(0);//放大
    });


    //$("#btnVehicle").bind("click", queryVehicleForSenior);

    bindControllerTool();//绑定控制面板功能

    $("#txtVehicleSearch").focus(function(e) {
        if (this.value == "车牌查找") {
            $(this).val("").css("color", "black")
        }
    }).blur(function() {
        if (this.value == "") {
            $(this).val("车牌查找").css("color", "#c0c0c0")
        }
    });

    //$("#txtHighSearch").click(queryVehicleForSenior);


    $("#smartSearchTxt").focus(function(e) {
        if (this.value == "输入 区域/点 ") {
            $(this).val("").css("color", "black")
        }
    }).blur(function() {
        if (this.value == "") {
            $(this).val("输入 区域/点 ").css("color", "#c0c0c0")
        }
    });

    reloadGridData();
});


var mapUtil = null;
var carTree ;
var wsMonitor =null;
var subscribeArray = [];
/*var webSocketUrl="ws://192.168.103.65:8080";
var webSocketUrlSockJS="http://192.168.103.65:8080/";*/
    function initMonitorWS() {
    try{
        var url = "";
        if ('WebSocket' in window){
            url = webSocketUrl +"/track";
            wsMonitor = new ReconnectingWebSocket(url);
        } else{
            url = webSocketUrlSockJS +"/sockjs/track";
            wsMonitor = new SockJS(url);
        }
        wsMonitor.onopen = function(event){

            //wsMonitor.send(wsMonitor.readyState);
        };
        wsMonitor.onmessage = function (event) { //数据回传

            var data = eval("("+event.data+")");
            if(data!=null) {
                //车辆实时轨迹数据
                /* if (data.code == 1) {
                 //轨迹数据
                 var trackItems = data.body.DataLocation;
                 for (var i = 0; i < trackItems.length; i++) {
                 if (i == (trackItems.length - 1)) {
                 handleTraceData(trackItems[i], false);
                 } else {
                 handleTraceData(trackItems[i], true);
                 }
                 }
                 //reloadGridData();
                 }*/


                /*if(data.timestamp==timestamp)
                 {*/


                for (var i = 0; i < data.length; i++) {
                    if (data[i].code == 1) {
                        if (i == (data.length - 1)) {
                            handleTraceData(data[i], false);
                        } else {
                            handleTraceData(data[i], true);
                        }

                        reloadGridData();
                    }
                }


                //}


            }
        };
        wsMonitor.onclose = function (event) {
            //console.log("订阅通道连接失败");
            initMonitorWS();
        };
        wsMonitor.onerror= function(event){
            //alert("WebSocket连接发生错误！");
        }

    }catch(ex){

    }
}


//左侧树vehicleTee.js 调用
function showOperateMenuPanel(_top,left,vehicleID,vehicleNo){
    var panelHeight  = 14; // $("#OperateMenuPanel").height();
    var panelTop = _top;
    var arrowTop  =50;
    var top =  panelHeight + _top;
    if(top>bodyHeight){ //位于底部了
        panelTop  = bodyHeight -(panelHeight + 10);
        arrowTop = (_top - panelTop)+50;//
    }

    $("#operateMenuPanelArrow").css("top",panelHeight);
    $("#OperateMenuPanel").css("top",panelTop).css("left",left).show().find("ul").attr("vid",vehicleID).attr("vno",vehicleNo);
}

//左侧树vehicleTee.js 调用
function hideOperateMenuPanel(){
    $("#OperateMenuPanel").hide();
}

function showBatchVehicleCommand(vids){
    if ($("#batchVehicleCommand").is(":hidden")) {
        $("#batchVehicleCommand").show();
    }else{
        $("#batchVehicleCommand").hide();
    }
}
// WebSocket 消息体
function MsgBody(){
    this.Type = null;
    this.timestamp=null;
    this.Body = null;
    // 如需更多信息，在实例化之后，直接添加进去
    // 发送前，用这个转换为字符串 JSON.stringify(实例名) 即可
}

// 订阅车辆
var timestamp;
function subScribe(vehicleId){
    if(wsMonitor != undefined && wsMonitor.readyState == 1){
        var subscribeArray = [];
        if(typeof vehicleId == "object"){
            for(var i = 0; i< vehicleId.length; i++){
                if(!GlobalSubscribeVehicle.containsKey(vehicleId[i]))
                    GlobalSubscribeVehicle.put(vehicleId[i],{});
            }

            subscribeArray = vehicleId;
        }else{
            if(!GlobalSubscribeVehicle.containsKey(vehicleId[i]))
                GlobalSubscribeVehicle.put(vehicleId,{});
            subscribeArray.push(vehicleId);
        }
        if(subscribeArray.length == 0) return;

        timestamp=new Date().getTime();
        var msg = new MsgBody();

        var body = {VehicleList:subscribeArray};
        msg.Type=1;
        msg.timestamp=timestamp;
        msg.Body = body;
        monitorSender(msg);
    }
}

// 取消订阅，仅提供给树列表调用
function unSubscribe(vehicleId){
    if(typeof vehicleId == "object"){
        for(var j=0; j<vehicleId.length; j++){
            _toUnSubscribe(vehicleId[j]);
        }
    }else{
        _toUnSubscribe(vehicleId);
    }
}


function _toUnSubscribe(vehicleId){
    if(vehicleId==-1)
    {
        GlobalTrackingCache.clear();
        GlobalSubscribeVehicle.clear();
        GlobalGpsCache.clear();

        var keys = GlobalMarkerCache.keys();
        for(var i=0; i < keys.length; i++){
            removeMarker(GlobalMarkerCache.get(keys[i]));
        }
        GlobalMarkerCache.clear();
        $("#cmdStatus li em").text(0);

    }
    else
    {
        var tempData = GlobalSubscribeVehicle.get(vehicleId);
        GlobalTrackingCache.remove(tempData.VehicleNo);
        var marker = GlobalMarkerCache.get(vehicleId);
        GlobalMarkerCache.remove(vehicleId);
        removeMarker(marker);

        var msg = new MsgBody();
        msg.Type= 0;
        var VehicleList = [];
        if(typeof vehicleId == "object"){
            //msg.VEHICLES = vehicleId;
            VehicleList = vehicleId;
        }else{
            //msg.VEHICLES.push(vehicleId.toString());
            VehicleList.push(vehicleId.toString());
        }
        msg.Body = {VehicleList:VehicleList};
        monitorSender(msg);
    }

}

/**
 * 通过WebSocket查询
 */
function monitorSender(data){
    if(wsMonitor == null){
        initMonitorWS();
    }
    if (wsMonitor != null && wsMonitor.readyState == 1) {
        if(typeof data == "object")
            data = JSON.stringify(data);
        wsMonitor.send(data); //查询参数
    } else {
        //console.log("服务器连接失败！请重试");
    }
}


// 处理轨迹数据
var num=0;
function handleTraceData(jsonData,updateLable){
   /* if(jsonData.VehicleID == undefined){
        return;
    }*/
    num++;
    asyncOperateMarker(jsonData);
    var tmpData = [],tmpValue = null;
    tmpData.push(num);
  /*  tmpData.push(jsonData.locations.longitude);
    tmpData.push(jsonData.locations.latitude);
    tmpData.push(jsonData.vehicleNo);*/

    var time = new Date(jsonData.locations.time);
    var times=time.toLocaleString();
    var speed=0;
    if( jsonData.locations.speed != undefined && jsonData.locations.speed!=0) {
        speed = jsonData.locations.speed.toFixed(1);
    }

    tmpData.push(jsonData.vehicleId);
    tmpData.push(jsonData.vehicleNo);
    tmpData.push(jsonData.locations.longitude);
    tmpData.push(jsonData.locations.latitude);

    tmpData.push(speed);
    tmpData.push(times);
   /* for(var i = 0; i < GlobalGridField.length; i++){
        var dataInfo=jsonData.locations;
        if(GlobalGridField[i]=="vehicleId" || GlobalGridField[i]=="vehicleNo")
        {
            dataInfo=jsonData;
        }
        tmpValue = dataInfo[GlobalGridField[i]];
        if(tmpValue != undefined && tmpValue != null)
            tmpData.push(tmpValue);
        else
            tmpData.push("");
    }*/

    GlobalTrackingCache.put(jsonData.vehicleId,jsonData.vehicleId);

    GlobalGpsCache.put(jsonData.vehicleId,{ id:jsonData.vehicleId,data:tmpData});

    GlobalSubscribeVehicle.put(jsonData.vehicleId,jsonData);
}


var GlobalMakerTimer = new HashMap();
function asyncOperateMarker(newData){
    var tmpOldData = GlobalSubscribeVehicle.get(newData.vehicleId);
    if(canOperateMarker(newData,tmpOldData)){
        var markerTimer = setTimeout(function(){
            var keys = GlobalMakerTimer.keys();
            if(keys.length > 0){
                var jsonData = GlobalSubscribeVehicle.get(keys[0]);
                if(jsonData==null){
                    return;
                }
                GlobalMakerTimer.remove(jsonData.vehicleId);
                if(jsonData){
                    addMarker(jsonData.vehicleId,jsonData.locations.longitude,jsonData.locations.latitude,jsonData.vehicleNo,jsonData.locations.direction,1,jsonData.kindID,"vin",jsonData.locations.time,jsonData.locations.speed);
                }
            }
        },10);
        GlobalMakerTimer.put(newData.vehicleId,markerTimer);
    }

    var markerTimer = setTimeout(function(){
        addMarker(newData.vehicleId,newData.locations.longitude,newData.locations.latitude,newData.vehicleNo,newData.locations.direction,1,newData.kindID,"vin",newData.locations.time,newData.locations.speed);
    },10);
}
// 添加 或 更新marker
function addMarker(vehicleId,lon,lat,no,head,statusId,vehicleTypeId,vin,time,speed){
    //var picUrl = getVehicleStatusPicUrl(vehicleTypeId,statusId,head);
    var picUrl = getVehicleStatusPicUrl(1,statusId,head);
    mapUtil.addMarker(vehicleId,lon,lat,no,picUrl,vin,time,speed);
}

//是否有条件操作点
function canOperateMarker(jsonNewData,jsonOldData){
    var flag = false;
    if(jsonOldData == null || jsonOldData == undefined || !jsonOldData.hasOwnProperty("VehicleID")){
        flag = true;
    }else{
        var distance = (jsonNewData.locations.longitude-jsonOldData.locations.longitude)*(jsonNewData.locations.longitude-jsonOldData.locations.longitude) +
            (jsonNewData.locations.latitude-jsonOldData.locations.latitude)*(jsonNewData.locations.latitude-jsonOldData.locations.latitude);
        flag = Math.sqrt(distance) > 50;
        flag = flag ||  !GlobalMakerTimer.containsKey(jsonNewData.vehicleId);
    }
    return flag;
}



//删除marker
function removeMarker(marker){
    mapUtil.removeMarker(marker);
}

function changeMap(mapName){
    if(mapUtil !=null && mapUtil.getMapName()== mapName ){
        return ;
    }
    if(mapUtil != null){
        mapUtil.destroy();
        mapUtil == null;
    }
    if(mapName=="baiduGis"){
        mapUtil  = new MapUtil("baiduGis");//baiduGis
        mapUtil.loadMap("mapDiv");
        $("#mapChoiceSpan").text("百度地图");
    }else if(mapName=="smartEarthGis"){
        mapUtil  = new MapUtil("smartEarthGis");//smartEarthGis
        mapUtil.loadMap("mapDiv");
        $("#mapChoiceSpan").text("泰瑞地图");
    }else if(mapName=="googleGis"){
        mapUtil  = new MapUtil("googleGis");//googleGis
        mapUtil.loadMap("mapDiv");
        $("#mapChoiceSpan").text("谷歌地图");
    }
}

function bindChangeMap(){
    $("#mapChoiceDiv li").each(function(i,n){
        $(n).bind("click", function () {
            var mapType = $(this).attr("mapType");
            changeMap(mapType);
        });
    });
}

function PageResize() {
    try {
        wh = getPageSize();
        var leftWidth = $("#left").width()+2;//左侧宽度
        bodyWidth = $("body").width();
        bodyHeight =  $("body").height();
        $("#setToolWindow").show();
        $("#left").height(wh[3] - (fullScream ? 0 : topNavHeight));
        $("#leftTreeIframe").height(wh[3] - (fullScream ?  0 : topNavHeight)-36);
        $("#leftTreeIframe").width(leftWidth);
        $("#right").width(bodyWidth - (leftPanelShow ? leftWidth : - 4)).height(wh[3] -  topNavHeight -1);
        var h = topNavHeight + listHeight + listTopHeight + mapToolsHeight;//监控列表 工具栏高度

        var _rightHeight = bodyWidth - (leftPanelShow ? leftWidth : - 6);
        $("#map").width(_rightHeight).height(wh[3] - (fullScream ? 36 :h));
        $("#mapDiv").width(_rightHeight).height(wh[3] - (fullScream ? 36 : h + 6));

        //initGrid(ColArrayCache,wh[3]-(wh[3] - (fullScream ? 0 : listHeight + 17)),true);
    } catch (ex) {
    }
};

//车牌号码查询
function queryVehicle(){
    var vs   = $("#txtVehicleSearch").val();
    if(vs==null){
        return ;
    }
    vs = vs!="车牌查找"?vs:"";
    // 查询参数
    var params = [ {
        name : 'RegistrationNO',
        value : vs
    }];
    window.frames["leftTreeIframe"].queryVehicle(params);
}
//关闭批量指令
function closeBatchPanel(){
    $("#batchMenuPanel_a").hide();
}

function nResizeMousedown(event) {
    e = event || window.event;
    var listTopHeight =0;
    closeBatchPanel();//关闭批量指令
    $("#nResizeMoveDiv").css("top", $("#nResizeDiv").offset().top - (fullScream ? 0 : topNavHeight));
    $("#nResizeMoveDiv").height(wh[3] - parseInt($("#nResizeMoveDiv").css("top"))  - listTopHeight + (fullScream ? topNavHeight: 0));
    $("#nResizeMoveDiv").width($("#right").width());
    $("#nResizeMoveDiv").show();
    $("#nResizeDiv").unbind("mousedown");
    $("#right").bind("mousemove", leftMousemove);
    $("#nResizeMoveDiv").bind("mouseup", leftMouseup);
    if($("#importNav2").css("display") !="none"){
        $("#importNav2").slideUp(600,function(){
            $(".left_menu").css("top","48px");
            //$(".yyBox").css("top","78px");
        });
        $("#importNav3").toggleClass("importNav");
    }
}

//地图缩放及全屏
function changeMapSize(type){
    if(type==0){//放大
        $("#left").width(0).hide();
        $("#nResizeDiv").hide();
        $("#tabTopDiv").hide();
        $("#monitorList").hide();
        $("#mapAllLi i").removeClass().addClass("mapQuitAll");
        $("#mapAllLi span").text("缩小");
        fullScream = true;
        PageResize();
        $("#mapAllLi").unbind().bind("click", function(){
            changeMapSize(1);//放大
        });
    }else{
        $("#left").width(219).show();
        $("#nResizeDiv").show();
        $("#tabTopDiv").show();
        $("#monitorList").show();
        $("#mapAllLi i").removeClass().addClass("mapAll");
        $("#mapAllLi span").text("全屏");
        $("#left").css("width","244px");
        fullScream = false;
        PageResize();
        $("#mapAllLi").unbind().bind("click", function(){
            changeMapSize(0);
        });
    }
}

function  bindControllerTool() {
//轨迹回放
    $("#trackplaybackli").bind("click",function(){
        var vehicleId = $(this).parent().attr("vid");
        var vehicleno = $(this).parent().attr("vno");
        var url =basePath + "/trackBack?vehicleId="+vehicleId+"&vehicleno="+encodeURIComponent(vehicleno);
        openWindow(url);
        //把消息框关掉
        $("#closeOperateMenuPanel").trigger("click");
    });

   /* //拍照
    $("#pictureli").bind("click",function(){
        var vehicleID = $(this).parent().attr("vid");
        var url =basePath + "secure/command/commandSend.html?commandID=20&vehicleIDS="+vehicleID;
        openWindow(url);
        //把消息框关掉
        $("#closeOperateMenuPanel").trigger("click");
    });*/

  /*  //文本下发指令
    $("#lcdmessageli").bind("click",function(){
        var vehicleID = $(this).parent().attr("vid");

        var url =basePath + "/commandSendtext.html";
        openWindow(url);
        //把消息框关掉
        $("#closeOperateMenuPanel").trigger("click");
    });

    //随录指令
    $("#videotapeli").bind("click",function(){
        var vehicleID = $(this).parent().attr("vid");

        var url =basePath + "secure/command/commandSend.html?commandID=21&vehicleIDS="+vehicleID;
        openWindow(url);
        //把消息框关掉
        $("#closeOperateMenuPanel").trigger("click");
    });

    //重点监控
    $("#keymonitorli").bind("click",function(){
        var vehicleId = $(this).parent().attr("vid");
        var vehicleno = $(this).parent().attr("vno");
        var url =basePath + "/secure/gis/attention.html?vehicleID="+vehicleId+"&vehicleno="+encodeURIComponent(vehicleno);
        openWindow(url);
        //把消息框关掉
        $("#closeOperateMenuPanel").trigger("click");
    });
*/
    //指令下发
    $("#sendcommandli").bind("click",function(){
        var vids =[];//先做测试用
        var VehicleID = $(this).parent().attr("vid");
        vids.push(VehicleID);
        var url =basePath + "/commandSendtext";
        var paramsName = ["vehicleIDS"];
        postAndOpenWindow(url,paramsName,vids);
        //把消息框关掉
        $("#closeOperateMenuPanel").trigger("click");
    });
}//打开新窗体
function openWindow(url){
    var openLink = $("#txtOpenWindow");
    openLink.attr('href', url);
    openLink[0].click();
}
function postAndOpenWindow(url, paramsName,paramsData) {
    var temp_form = document.createElement("form");
    temp_form.action = url;
    temp_form.target = "_blank";
    temp_form.method = "post";
    temp_form.style.display = "none";
    temp_form.name ="postForm";
    for (var x in paramsName) {
        var opt = document.createElement("textarea");
        opt.name = paramsName[x];
        opt.value = paramsData[x];
        temp_form.appendChild(opt);
    }
    document.body.appendChild(temp_form);
    temp_form.submit();
    document.body.removeChild(temp_form);
}
//关闭控制面板
function closeSearchPanel(panelID,type){
    $(panelID).hide();
    if(type=='mapinfo'){
        mapUtil.clearMarkerAry();
        mapUtil.removeRetOverlay();
    }
}


var myGrid,ColArrayCache,initCompleted=false,lastShowRowIdx=0;
/*
function initGrid(colArray,gridHeight,isDestructor){
    //console.log("cols:"+JSON.stringify(colArray));
    if(isDestructor && myGrid)
        myGrid.destructor();

    var leftWidth = $("#left").width()+2;//左侧宽度
    var bodyWidth = $("body").width();
    _tableWidth = bodyWidth - (leftPanelShow ? leftWidth : -6);

    var _width =  _tableWidth > 100 ? _tableWidth : (bodyWidth>1366?bodyWidth-225:1145);
    gridHeight = gridHeight ? gridHeight : 107;

    $("#gridbox").css({width:_width,height:gridHeight});
    myGrid = new dhtmlXGridObject('gridbox');
    myGrid.setImagePath(basePath+"/img/");
    myGrid.setHeader(colArray[0].join(","));
    myGrid.setColumnIds(colArray[1].join(","));
    myGrid.setInitWidths(colArray[2].join(","));
    myGrid.setColAlign(colArray[3].join(","));
    myGrid.setColTypes(colArray[4].join(","));
    myGrid.setColSorting(colArray[5].join(","));
    //myGrid.setColSorting(",str,str,int,int,str,int,int,int,str,str,date,str,str,int,int,int,str,str");
    myGrid.attachEvent("onScroll",function(sLeft,sTop){

    });
  /!*  /!* lastShowRowIdx = Math.ceil(sTop / 27);
     var idsArray = myGrid.getAllRowIds().split(",");
     var resRowTotal = Math.ceil(($("#gridbox").height()-45)/27);
     resRowTotal = (idsArray.length - lastShowRowIdx) >= resRowTotal ? resRowTotal : (idsArray.length - lastShowRowIdx);
     for(var i = 0; i< resRowTotal; i++){
     var jsonData = GlobalSubscribeVehicle.get(idsArray[lastShowRowIdx+i]);
     if(jsonData != null && jsonData.hasOwnProperty("VehicleID")){
     //&& (jsonData.address == "" || jsonData.address == null || jsonData.address == undefined)){
     getAddress(null,jsonData.VehicleID);
     }
     }*!/!*!/
    myGrid.attachEvent("onRowSelect",function(id,ind){
        jsonData = GlobalSubscribeVehicle.get(id);
        if(jsonData){
            mapUtil.setMapCenter(jsonData.locations.longitude,jsonData.locations.latitude,19);
            addMarker(jsonData.vehicleId,jsonData.locations.longitude,jsonData.locations.latitude,jsonData.vehicleNo,jsonData.locations.direction,1,jsonData.kindID,"vin",jsonData.locations.time,jsonData.locations.speed);

        }
    });
    myGrid.attachEvent("onRowDblClicked",function(id,ind){
        jsonData = GlobalSubscribeVehicle.get(id);
        if(jsonData){
            var openLink = $("#txtOpenWindow");
            openLink.attr('href', basePath + "/secure/gis/attention.html?vehicleID="+jsonData.vehicleId+"&vehicleno="+encodeURIComponent(jsonData.vehicleNo));
            openLink[0].click();
        }

    });
    myGrid.init();
    myGrid.enableSmartRendering(true,50);
    if(initCompleted){
        if(currentStatus != undefined &&  currentStatus != "0" ){
            var gridData={
                rows:_filterArray
            };
            reloadGridData(gridData);
        }else{
            reloadGridData();
        }
    }
    if(!wsMonitor)
        initMonitorWS();
    initCompleted = true;
    $(".hdr").css({"border-collapse":"separate","border-spacing":"0px"});
}
*/

// 车辆状态过滤
function statusClick(){
    if($(this).attr("id")=="batchLi")return;
    $("#cmdStatus li:gt(1)").removeClass("now");
    $(this).addClass("now");
    currentStatus = $(this).attr("key");
    _filterArray = [];
    // 车辆状态：全部 0    运行 1    停车 2    报警 3    异常 4
    if(currentStatus != 0){
        var _vehicleIds = GlobalGpsCache.keys(),jsonData;
        if(_vehicleIds.length > 0){
            for(var i = 0; i < _vehicleIds.length; i++){
                jsonData = GlobalSubscribeVehicle.get(_vehicleIds[i]);
                if(jsonData && jsonData.carStatus == currentStatus){
                    _filterArray.push(GlobalGpsCache.get(_vehicleIds[i]));
                }
            }
        }
    }else{
        _filterArray = GlobalGpsCache.values();
    }
    var myData = {rows:_filterArray};
    reloadGridData(myData);
}

/*function bubbleSort(array,sortindex) {
    var i = 0,
        len = array.length,
        j, d;
    for (; i < len; i++) {
        for (j = 0; j < len; j++) {
            if (array[i].data[sortindex] > array[j].data[sortindex]) {
                d = array[j];
                array[j] = array[i];
                array[i] = d;
            }
        }
    }
    return array;
}*/


function reloadGridData() {
    debugger;


    /* for(var i = 0; i < GlobalGridField.length; i++){
     var dataInfo=jsonData.locations;
     if(GlobalGridField[i]=="vehicleId" || GlobalGridField[i]=="vehicleNo")
     {
     dataInfo=jsonData;
     }
     tmpValue = dataInfo[GlobalGridField[i]];
     if(tmpValue != undefined && tmpValue != null)
     tmpData.push(tmpValue);
     else
     tmpData.push("");
     }*/





    //var data="";
   // var info=JSON.stringify(GlobalGpsCache.values());
    /*if(!data){
         /!* data = {
         rows:[{"id":1005,"data":[34.221497,108.89165,"陕A44693"]}]
         };*!/

        data={
            rows:[
                { id:1, data: ["34.221497", "108.89165", "陕A44693"]}
            ]
        };
    }*/



        //Grid数据

        var mygrid=new dhtmlXGridObject("gridbox");
        mygrid.setImagePath(basePath+"/img/");
        var headAlign=[];//表头对齐
        var colAlign="";//内容列
        for(var i=0;i<3;i++){
            headAlign.push("text-align:center;");//全部居中
            if(i==0){
                colAlign="center";
            }else{
                colAlign=colAlign+",center";
            }
        }
        mygrid.setHeader("序号,车辆ID,车牌号,经度,纬度,速度,时间");

        mygrid.setInitWidths("40,70,100,100,100,100,200");
        mygrid.setColAlign(colAlign);
        mygrid.setSkin("dhx_skyblue");
        mygrid.init();
        mygrid.enablePreRendering(30);
        mygrid.enableSmartRendering(true);
        //选择事件
       mygrid.attachEvent("onRowSelect",function(id,ind){
             var jsonData = GlobalSubscribeVehicle.get(id);
             if(jsonData) {
                 mapUtil.setMapCenter(jsonData.locations.longitude, jsonData.locations.latitude, 19);
                 addMarker(jsonData.vehicleId, jsonData.locations.longitude, jsonData.locations.latitude, jsonData.vehicleNo, jsonData.locations.direction, 1, jsonData.kindID, "vin", jsonData.locations.time, jsonData.locations.speed);

             }
       });
        var data={
            rows:GlobalGpsCache.values()
        };
         mygrid.parse(data,null,"json");
}
/*function reloadGridData(data){

debugger;
    myGrid.clearAll();
    var sortindex=-1;
    if(!data){
        data = {
            rows:GlobalGpsCache.values()
        };
    }

   /!* $(".obj").append("<tr style=\"height: auto;\">" +
    " <th style=\"width: 40px; height: 0px;\">data.vehicleId</th>" +
    "<th style=\"width: 40px; height: 0px;\">data.locations.longitude</th>" +
    "<th style=\"width: 40px; height: 0px;\">data.locations.latitude</th>" +
    "<th style=\"width: 40px; height: 0px;\">data.vehicleNo</th></tr>")*!/
   /!* for(var i = 0; i < GlobalGridField.length; i++){
        tmpValue = GlobalGridField[i];
        if("CurrentSpeed"==tmpValue){
            sortindex=i;
            break;
        }
    }
    if(sortindex>=0){
        data.rows=bubbleSort(data.rows,sortindex);
    }*!/

    myGrid.parse(data,null,"json");
    var idsArray = myGrid.getAllRowIds().split(",");
    var rowId = idsArray[lastShowRowIdx];
    if(rowId != null && rowId != "" && rowId != undefined)
        myGrid.showRow(rowId);


    var resRowTotal = Math.ceil(($("#gridbox").height()-45)/27);
    resRowTotal = idsArray.length > resRowTotal ? resRowTotal : idsArray.length;
    var idx = lastShowRowIdx == 0 ? 0: (lastShowRowIdx <= resRowTotal ? 0 : lastShowRowIdx);




    /!*for(var i = 0; i< resRowTotal; i++){
        var jsonData = GlobalSubscribeVehicle.get(idsArray[idx+i]);
        if(jsonData != null && jsonData.hasOwnProperty("VehicleID")){
            //&& (jsonData.address == "" || jsonData.address == null || jsonData.address == undefined)){
            getAddress(null,jsonData.VehicleID);
        }
    }*!/
}*/

/**
 * 获取自定义列
 * @returns
 */
   /* function loadColumns() {
    /!* $.post(basePath+"secure/gis/loadCustomizeColumns.html",{},function(data){
     if(data != null && data.length > 0){
     var header = [],colWidth = [],colAlign = [],colTypes = [],colSort=[];
     colSort.push("na");
     for(var i = 0; i < data.length; i++){
     if(i == 0){
     header.push("操作");
     GlobalGridField.push("VehicleID");
     colWidth.push(40);
     colAlign.push("center");
     colTypes.push("cancelBtn");
     }
     if(!data[i].Hide){
     header.push(data[i].Name);
     GlobalGridField.push(data[i].Code);
     colWidth.push(data[i].Width);
     colAlign.push(data[i].Align);
     if(data[i].Code == "VehicleNo"){
     colTypes.push("TrackingBtn");
     }else{
     colTypes.push("ro");
     }
     if(data[i].Code=="CurrentSpeed"){
     colSort.push("int");
     }else if(data[i].Code=="GatherTime"){
     colSort.push("date");
     }else{
     colSort.push("na");
     }
     }
     }
     var tmpArray = [];
     tmpArray[0] = header;
     tmpArray[1] = GlobalGridField;
     tmpArray[2] = colWidth;
     tmpArray[3] = colAlign;
     tmpArray[4] = colTypes;
     tmpArray[5] = colSort;
     ColArrayCache = tmpArray;
     initGrid(tmpArray);
     }
     },"JSON");*!/

    var header = [], colWidth = [], colAlign = [], colTypes = [], colSort = [];
    colSort.push("na");
    /!* header.push("操作");
     GlobalGridField.push("vehicleId");
     colWidth.push(40);
     colAlign.push("center");
     colTypes.push("cancelBtn");
*!/
    header.push("序号");
    GlobalGridField.push("no");
    colWidth.push(40);
    colAlign.push(40);

    header.push("经度");
    GlobalGridField.push("longitude");
    colWidth.push(100);
    colAlign.push(40);

    header.push("纬度");
    GlobalGridField.push("latitude");
    colWidth.push(100);
    colAlign.push(40);

    header.push("车牌号");
    GlobalGridField.push("vehicleNo");
    colWidth.push(100);
    colAlign.push(40);


    var tmpArray = [];
    tmpArray[0] = header;
    tmpArray[1] = GlobalGridField;
    tmpArray[2] = colWidth;
    tmpArray[3] = colAlign;
    tmpArray[4] = colTypes;
    tmpArray[5] = colSort;
    ColArrayCache = tmpArray;
    initGrid(tmpArray);


}*/
