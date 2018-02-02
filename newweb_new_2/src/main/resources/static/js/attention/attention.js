var leftPanelShow = false;// 左侧面板是否显示
var fullScream = false;// 地图是否全屏
var topNavHeight = 0;// 导航栏高度
var maplet = null;
var listTopHeight = 32;
var mapToolsHeight = 36;
var nResizeHeight = 5 + 1;
var listHeight = 50 ;// 表格高度
var currentCar1 = null;//车辆数据


var GlobalMinTimeCache=new HashMap();
var GlobalGpsCache=new HashMap();


var speedOilChart = null;
var mileOilChart=null;
var dashboardChart=null;
var timeTicket;
var vehicleId;
var vehicleNo;

var MonitorConf = {};
MonitorConf.platerNum = true;
MonitorConf.speed = false;
MonitorConf.state = false;
MonitorConf.autoSubscribe = false;


var mapUtil = null;
$(function() {
    //点击小图切换大图
    $("#thumbnail li").click(function(){
        $(".zoompic img").show().attr({ "src": $(this).find("img").attr("src")});
        $("#thumbnail li.current").removeClass("current");
        $(this).addClass("current");
        return false;
    });


//小图片左右滚动
    var $slider = $('.slider ul');
    var $slider_child_l = $('.slider ul li').length;
    var $slider_width = $('.slider ul li').width();
    $slider.width($slider_child_l * $slider_width);

    var slider_count = 0;

    if ($slider_child_l < 6) {
        $('#btn-right').css({cursor: 'auto'});
        $('#btn-right').removeClass("dasabled");
    }

    $('#btn-right').click(function() {
        if ($slider_child_l < 6 || slider_count >= $slider_child_l - 6) {
            return false;
        }

        slider_count++;
        $slider.animate({left: '-=' + $slider_width + 'px'}, 'fast');
        slider_pic();
    });

    $('#btn-left').click(function() {
        if (slider_count <= 0) {
            return false;
        }
        slider_count--;
        $slider.animate({left: '+=' + $slider_width + 'px'}, 'fast');
        slider_pic();
    });

    $('#picBox').height($(window).height());
    try {
        $('#dashboardPanel').hide();
        PageResize();// 初始大小
        window.onresize = PageResize;
        $("#nResizeDiv").bind("mousedown", nResizeMousedown);// 拖拽


        //bindCtrPanel();
        //loadChart();

        //initConfig();
        $("#mapAllLi").unbind().bind("click", function(){
            changeMapSize(0);
        });

       /* if(isMulti=="true"){ //是否是多车跟踪
         $("#mapTools").hide();
         $("#map").css("padding-top","0");
         //isShowPanel(false);
         }*/
        bindChangeMap();
        changeMap("baiduGis");
        // mapUtil  = new MapUtil("googleGis");//baiduGis
        //mapUtil  = new MapUtil("baiduGis");//baiduGis
        //mapUtil.loadMap("mapDiv");

        webSocketConnect();
        //initTrackData();
        bindControllerTool();

        reloadGridData();
        reloadMinTimeData();


    } catch (ex) {
        //console.log(ex);
    }
});

function bindControllerTool(){
    /*$("#batchLi").bind("click", function(){
        if($("#batchMenuPanel_a").is(":hidden")) {
            $("#batchMenuPanel_a").css("display","block");
        }else{
            $("#batchMenuPanel_a").hide();
        }
    });//控制批量指令面板*/
    $("#openOilSpeedPanel").bind("click",function(){
        $(this).hide();
        $("#dashboardPanel").show();
    });
    $("#setToolWindow").bind("click",function(){ //窗口化
        $(this).hide();
        $("#setToolMin").show();
        $("#setToolMax").show();
        $("#mapTools").show();
        $("#map").height(wh[3] -320 ).show();
        $("#mapDiv").height(wh[3] -320).show();
        $("#dashboardPanel").hide();
        $("#speedOilDiv").height(250);
        $("#mileageOilDiv").height(250);
    });
    $("#setToolMin").bind("click",function(){ //最小化
        $(this).hide();
        $("#mapTools").show();
        $("#setToolWindow").show();
        $("#map").height(wh[3] - (fullScream ? 0 : topNavHeight) - listHeight - listTopHeight - mapToolsHeight).show();
        $("#mapDiv").height(wh[3] - (fullScream ? 0 : topNavHeight) - listHeight - listTopHeight - mapToolsHeight).show();
        $("#setToolMax").show();
        $("#dashboardPanel").hide();
    });
    $("#setToolMax").bind("click",function(){ //最大化
        $(this).hide();
        $("#setToolWindow").show();
        $("#setToolMin").show();
        $("#mapTools").hide();
        $("#mapDiv").hide();
        $("#map").hide();
        $("#dashboardPanel").hide();
        $("#speedOilDiv").height(700);
        $("#mileageOilDiv").height(700);
    });


   /* $("#batchLi a").eq(1).bind("click",function(){
        if(!vehicleId||!vehicleNo){
            alert("请选择车辆!");
            return;
        }
        var url =basePath + "secure/gis/track.html?vehicleId="+vehicleId+"&vehicleno="+encodeURIComponent(vehicleNo);
        openWindow(url);
    });

    //拍照
    $("#batchLi a").eq(2).bind("click",function(){
        if(!vehicleId||!vehicleNo){
            alert("请选择车辆!");
            return;
        }
        var url =basePath + "secure/command/commandSend.html";
        openWindow(url+"?commandID=20&vehicleIDS="+vehicleId);
    });

    //下发文本
    $("#batchLi a").eq(3).bind("click",function(){
        if(!vehicleId||!vehicleNo){
            alert("请选择车辆!");
            return;
        }
        var url =basePath + "secure/command/commandSend.html";
        openWindow(url+"?commandID=3&vehicleIDS="+vehicleId);
    });

    $("#batchLi a").eq(4).bind("click",function(){
        if(!vehicleId||!vehicleNo){
            alert("请选择车辆!");
            return;
        }
        var url =basePath + "secure/command/commandSend.html";
        openWindow(url+"?vehicleIDS="+vehicleId);
    });*/

}

//地图缩放及全屏
function changeMapSize(type){
    if(type==0){//放大

        $("#mapAllLi i").removeClass().addClass("mapQuitAll");
        $("#mapAllLi span").text("缩小");
        fullScream = true;
        PageResize();
        $("#nResizeDiv").hide();
        //$("#tabTopDiv").hide();
        $("#monitorList,#tabTopDiv").hide();
        $('#map,#mapDiv').height($(window).height());
        $("#mapAllLi").unbind().bind("click", function(){
            changeMapSize(1);//放大
        });
    }else{
        $("#nResizeDiv").show();
        //$("#tabTopDiv").show();
        $("#monitorList,#tabTopDiv").show();
        $("#mapAllLi i").removeClass().addClass("mapAll");
        $("#mapAllLi span").text("全屏");
        fullScream = false;
        PageResize();
        $("#mapAllLi").unbind().bind("click", function(){
            changeMapSize(0);
        });
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

    //var vehicleId = getQueryString("vehicleID");
    if(vehicleId !=null&&!vehicleId){
        //ws.send("{\"COMMAND_ID\":\"1\",\"VEHICLES\":[\""+vehicleId+"\"],\"USERID\":\""+userID+"\",\"mapType\":"+mapUtil.getMapType()"}");
    }
    if(mapUtil!=null && carTrack!=null){
        mapUtil.drawMarker(carTrack);
    }
}

/*function initConfig(){
    $.post(basePath+"secure/gis/loadDisplayConf.html",{},function(data){
        if(data != null && data != undefined && typeof data == "object"){
            try{
                MonitorConf.platerNum = data.IsDisplayVehicleRegistration;
                MonitorConf.speed = data.IsDisplaySpeed;
                MonitorConf.state = data.IsDisplayDriveState;
                MonitorConf.autoSubscribe = data.autoSubscribe;
            }catch(ex){}
        }
    },"JSON");
}*/


// 页面发生变化时
function PageResize() {
    wh = getPageSize();
    var leftWidth = $("#left").width()+2;// 左侧宽度
    var bodyWidth = $("body").width();
    var h = listHeight + listTopHeight + mapToolsHeight + nResizeHeight+50;//列表 工具栏高度
     var winH=$(window).height();
    $("#right").width(bodyWidth).height(winH);
    $("#map").width(bodyWidth).height(winH*0.7);
    $("#mapDiv").width(bodyWidth).height(winH*0.7);
    $('#monitorList,#monitorList>div').height(winH*0.3-40);
};

function nResizeMousedown(event) {
    e = event || window.event;
    var listTopHeight =0;
    $("#nResizeMoveDiv").css("top", $("#nResizeDiv").offset().top - (fullScream ? 0 : topNavHeight));
    $("#nResizeMoveDiv").height(wh[3] - parseInt($("#nResizeMoveDiv").css("top")+20)  );
    $("#nResizeMoveDiv").width($("#right").width());
    $("#nResizeMoveDiv").show();
    $("#nResizeDiv").unbind("mousedown");
    $("#right").bind("mousemove", leftMousemove);
    // $("#nResizeDiv").delegate

    $(document).bind("mouseup", leftMouseup)
}

// 鼠标离开
function leftMousemove(event) {
    e = event || window.event;
    var eTop = e.pageY - (fullScream ? 0 : topNavHeight) - nResizeHeight;
    if (e.pageY - (fullScream ? 0 : topNavHeight) < 0 || wh[3] - e.pageY <= listTopHeight) {
        return
    }
    $("#nResizeMoveDiv").css("top", e.pageY - (fullScream ? 0 : topNavHeight) - nResizeHeight);
    $("#nResizeMoveDiv").height(wh[3] - parseInt($("#nResizeMoveDiv").css("top")) +20);
};

// 鼠标左键松开
function leftMouseup(event) {
    IsDragList = true;
    $("#right").unbind("mousemove");
    // $(document).unbind("mouseup");
    $("#nResizeMoveDiv").hide();
    var nResizeTop = parseInt($("#nResizeMoveDiv").css("top"));
    var bottomHeight = (wh[3] - (nResizeTop - mapToolsHeight) - (fullScream ? 0 : topNavHeight) - mapToolsHeight);
    if (nResizeTop <= mapToolsHeight) {
        nResizeTop = mapToolsHeight;
        $("#map").hide();
        $("#mapDiv").hide();
        //$("#mapTools").hide();
        // setTableWin("max");
        $("#nResizeDiv").bind("mousedown", nResizeMousedown);
        return
    } else if (bottomHeight <= (listTopHeight + 1 + nResizeHeight)) {
        // setTableWin("min");
        $("#nResizeDiv").bind("mousedown", nResizeMousedown);
        return
    } else {
        $("#map").show();
        $("#mapDiv").show();
        //$("#mapTools").height(36).show()
    }
    $("#map").height(nResizeTop - mapToolsHeight);
    $("#mapDiv").height(nResizeTop - mapToolsHeight);
    listHeight = wh[3] - nResizeHeight - $("#map").height() - listTopHeight - (fullScream ? 0 : topNavHeight) - mapToolsHeight;
    $("#monitorList").height(listHeight);
    //var top = wh[3]-listHeight -350;
    //$("#dashboardPanel").css("top",top<0?0:top);

    if (typeof map != "undefined" && map != null) {
        // map.mapResize($("#mapImg").width(), $("#mapImg").height())
    }
    $("#nResizeDiv").bind("mousedown", nResizeMousedown)
}

// WebSocket 消息体
function MsgBody(){
    this.Type = null;
    this.timestamp=null;
    this.Body = null;
    // 如需更多信息，在实例化之后，直接添加进去
    // 发送前，用这个转换为字符串 JSON.stringify(实例名) 即可
}

var num=0;
var lastPoint = null;
var winCloseCount = 0;
var ws =null;
//webSocket连接
var carTrack = null;//缓存最后一条轨迹
function webSocketConnect() {
    //var webSocketUrl ="ws://127.0.0.1:8080/etrans-web/WebSocketListener";
//	var url = webSocketUrl + "/track";
//    ws = new WebSocket(url);
    var url = "";
    if ('WebSocket' in window){
        url = webSocketUrl +"/track";
        ws = new ReconnectingWebSocket(url);
    } else{
        //var options = {protocols_whitelist: ["websocket", "xhr-streaming", "xdr-streaming", "xhr-polling", "xdr-polling", "iframe-htmlfile", "iframe-eventsource", "iframe-xhr-polling"], debug: true};
        url = webSocketUrlSockJS +"/sockjs/track";
        //ws = new SockJS(url,undefined,options);
        ws = new SockJS(url);
    }
    ws.onopen = function () {
        GlobalGpsCache.clear();
        GlobalMinTimeCache.clear();
        var vehicleId = getQueryString("vehicleID");
        if(vehicleId !=null){

            var msg = new MsgBody();
            msg.Type=1;
            var body = {VehicleList:[vehicleId]};
            msg.Body = body;

            ws.send(JSON.stringify(msg));
        }
    };
    ws.onmessage = function (event) {//数据回传
        var data = eval("("+event.data+")");


        if (data[0].code == 1) {
            //实时轨迹
            carTrack = data;
            if(!data[0].vehicleNo||!data[0].vehicleId)
                return;
            $("#dashboardPanelVrn").text(data[0].vehicleNo);
            $("#dashboardPanelTime").text(data[0].locations.time);
            mapUtil.drawMarker(data);//打点

            vehicleId=data[0].vehicleId;
            vehicleNo=data[0].vehicleNo;


            num++;
            var tmpData = [];
            //tmpData.push(num);


            var time = new Date(data[0].locations.time);
            var times=time.toLocaleString();
            var speed=0;
            if( data[0].locations.speed != undefined && data[0].locations.speed!=0) {
                speed = data[0].locations.speed.toFixed(1);
            }

            tmpData.push(data[0].vehicleId);
            tmpData.push(data[0].vehicleNo);
            tmpData.push(data[0].locations.longitude);
            tmpData.push(data[0].locations.latitude);

            tmpData.push(speed);
            tmpData.push(times);

            tmpData.push(getHeadDesZS(data[0].locations.direction));
            tmpData.push(0);
            tmpData.push(data[0].simCardNo);

            tmpData.push("正常");

            tmpData.push("正常");




            GlobalGpsCache.put(data[0].vehicleId,{ id:num,data:tmpData});
            reloadGridData();
        }
        if (data[0].code == 2)
        {
            //分钟学时 记录时间,终端编号,学员编号,教练编号,最大速度,里程,转速
            var tmpMiData = [];

            tmpMiData.push(data[0].minutes.studyMinutes.substr(0,2)+":"+data[0].minutes.studyMinutes.substr(2,2)+":"+data[0].minutes.studyMinutes.substr(4,2));
            tmpMiData.push(data[0].simCardNo);
            tmpMiData.push(data[0].minutes.stuNum);
            tmpMiData.push(data[0].minutes.coachNum);
            var speeds=data[0].minutes.speed;
            if(speeds!=undefined || speeds!=0)
            {
                speeds=speeds.toFixed(1);
            }
            tmpMiData.push(speeds);
            tmpMiData.push(0);
            tmpMiData.push(data[0].minutes.maybeAM);
            GlobalMinTimeCache.put(num,{ id:num,data:tmpMiData});
            reloadMinTimeData();
        }



        //教练ID、学员ID
        reloadInfoData(data);
    };
    ws.onclose = function (event) {
        //console.log("连接失败");
        webSocketConnect();
    };
}

function reloadGridData() {

    //Grid数据

    var mygrid=new dhtmlXGridObject("gridboxs");
    mygrid.setImagePath(basePath+"/img/");
    var headAlign=[];//表头对齐
    var colAlign="";//内容列
    for(var i=0;i<11;i++){
        headAlign.push("text-align:center;");//全部居中
        if(i==0){
            colAlign="center";
        }else{
            colAlign=colAlign+",center";
        }
    }
    mygrid.setHeader("车辆ID,车牌号,经度,纬度,速度,时间,方向,里程,SIM卡号,SIM卡状态,摄像头");

    mygrid.setInitWidths("70,100,100,100,100,200,100,100,100,100,100");
    mygrid.setColAlign(colAlign);
    mygrid.setSkin("dhx_skyblue");
    mygrid.init();
    mygrid.enablePreRendering(30);
    //mygrid.enableSmartRendering(true);

    var data={
        rows:GlobalGpsCache.values()
    };
    mygrid.parse(data,null,"json");

}
function reloadMinTimeData() {

    //Grid数据

    var mygrid=new dhtmlXGridObject("TimeInfo");
    mygrid.setImagePath(basePath+"/img/");
    var headAlign=[];//表头对齐
    var colAlign="";//内容列
    for(var i=0;i<7;i++){
        headAlign.push("text-align:center;");//全部居中
        if(i==0){
            colAlign="center";
        }else{
            colAlign=colAlign+",center";
        }
    }
    mygrid.setHeader("记录时间,终端编号,学员编号,教练编号,最大速度,里程,转速");

    mygrid.setInitWidths("100,200,200,200,100,100,100");
    mygrid.setColAlign(colAlign);
    mygrid.setSkin("dhx_skyblue");
    mygrid.init();
    mygrid.enablePreRendering(30);
    //mygrid.enableSmartRendering(true);

    var data={
        rows:GlobalMinTimeCache.values()
    };
    mygrid.parse(data,null,"json");

}

//教练、学员信息查询
function reloadInfoData(data)
{
    if(data!=null)
    {
        //教练
        $("#tea_img").attr("src",basePath+data[0].teacherInfo.teaPic);
        $("#id_teaName")[0].innerText=data[0].teacherInfo.teacherName;
        $("#id_teaSex")[0].innerText=data[0].teacherInfo.teaSex;
        $("#id_teaCard")[0].innerText=data[0].teacherInfo.teaCard;
        $("#id_teaNo")[0].innerText=data[0].teacherInfo.coachNum;
        $("#id_teaTel")[0].innerText=data[0].teacherInfo.teaTel;

        //学员
        $("#stu_img").attr("src",basePath+data[0].studentInfo.stuPic);
        $("#id_stuName")[0].innerText=data[0].studentInfo.stuName;
        $("#id_stuSex")[0].innerText=data[0].studentInfo.stuSex;
        $("#id_stuCard")[0].innerText=data[0].studentInfo.stuCard;
        $("#id_stuNo")[0].innerText=data[0].studentInfo.studentNum;
        $("#id_stuTel")[0].innerText=data[0].studentInfo.stuTel;
        $("#id_stuTotalAmt")[0].innerText=data[0].studentInfo.subject3TotalAmt;
    }
}

//关闭连接
function disconnect() {
    if (ws != null) {
        ws.close();
        ws = null;
    }
}

function getMarkerLabel(car){
    var dispLabel = "";

    var time = new Date(car.locations.time);
    var times=time.toLocaleString();
    var speeds=car.locations.speed;
    if( speeds != undefined && speeds!=0) {
        speeds = speeds.toFixed(1);
    }
    try{

        dispLabel = "车牌：" + car.vehicleNo;


        dispLabel += (dispLabel == "" ? "时间：":"<br/>时间：") + (times != null ? times : "");


        dispLabel += (dispLabel == "" ? "速度：":"<br/>速度：") + speeds+ " KM/h";


        //dispLabel += (dispLabel == "" ? "":"<br/>") + (car.Status == 1 ? "开车：" : "停车：");


        dispLabel  = dispLabel==""?car.vehicleNo:dispLabel;
    }catch(ex){
        //console.log("getMarkerLabel:"+ex);
    }
    return dispLabel;
}




/*//弹出窗口,取中文地址
function getLocationInfo2(sim,lon,lat) {
    //百度取中文地址
    $("#locationInfo").html('<img src="imgs/load.gif" />正在加载数据......');
    var geocoder = new qq.maps.Geocoder({
        complete : function(result){

            var lng1 = result.detail.location.lng;
            var lat1 = result.detail.location.lat;
            var str ="";
            var distname="";
            if(result.detail.nearPois.length>0){
                var lng2 = result.detail.nearPois[0].latLng.lng;
                var lat2 = result.detail.nearPois[0].latLng.lat;
                var dist = result.detail.nearPois[0].dist;
                distname=result.detail.nearPois[0].name;
                if (distname!="")
                {
                    distname=","+distname;
                }
                str = getDirection(lat2,lng2,lat1,lng1,dist);
                if (str!="")
                {
                    str=","+str;
                }
            }
            var adc = result.detail.addressComponents;
            var address = adc.country+adc.province+adc.city+adc.district+adc.town+adc.village+adc.street+adc.streetNumber+distname+str;
            $("#message").html(address);
        }
    });
    //若未取得腾迅地址成功则取百度地址 zzf
    geocoder.setError(function() {
        var gc = new BMap.Geocoder();
        var pt= new BMap.Point(lon,lat);
        gc.getLocation(pt, function(rs){
            var addComp = rs.addressComponents;
            $("#message").html(addComp.province + "  " + addComp.city + "  " + addComp.district + "  " + addComp.street + "  " + addComp.streetNumber);
        });
    });

    qq.maps.convertor.translate(new qq.maps.LatLng(lat,lon), 1, function(res){
        geocoder.getAddress(res[0]);
    });
}*/

//增加地址解析方向
function getDirection(lat1, lng1, lat2, lng2,dist){
    k1 = lng2-lng1;
    k2 = lat2-lat1;
    if( 0 == k1){
        if(k2>0){
            str="正北方 ";
        }else if( k2<0){
            str ="正南方 ";
        }else if( k2 == 0){
            str="";
        }
    }else if( 0 == k2){
        if(k1>0){
            str="正东方 ";
        }else if( k1<0){
            str="正西方 ";
        }
    }else{
        $k=k2/k1;
        if(k2>0){
            if(k1>0){
                str="东偏北 "+dist+"米";
            }else if(k1<0){
                str= "西偏北 "+dist+"米";
            }
        }else if(k2<0){
            if(k1<0){
                str = "西偏南 "+dist+"米";
            }else if(k1>0){
                str="东偏南"+dist+"米";
            }
        }
    }
    return str;
}
//点击查看图片
function honorShow(index){
    $(".mask").css("display","block");
    $(".zoombox").css("display","block");
    var $cur=$("#thumbnail li").eq(index);
    $(".zoompic img").show().attr({ "src": $cur.find("img").attr("src")});
    $("#thumbnail li.current").removeClass("current");
    $cur.addClass("current");
}



function slider_pic() {
    if (slider_count >= $slider_child_l - 6) {
        $('#btn-right').css({cursor: 'auto'});
        $('#btn-right').addClass("dasabled");
    }
    else if (slider_count > 0 && slider_count <= $slider_child_l - 6) {
        $('#btn-left').css({cursor: 'pointer'});
        $('#btn-left').removeClass("dasabled");
        $('#btn-right').css({cursor: 'pointer'});
        $('#btn-right').removeClass("dasabled");
    }
    else if (slider_count <= 0) {
        $('#btn-left').css({cursor: 'auto'});
        $('#btn-left').addClass("dasabled");
    }
}

// 关闭
function closeMask(){
    $(".mask").css("display","none");
    $(".zoombox").css("display","none");
}


/*
speedOption = {

    tooltip : {
        trigger: 'axis',
        formatter: function(params) {
            return params[0].name + '<br/>'
                + params[0].seriesName + ' : ' + params[0].value + ' (km/h)<br/>'
                + params[1].seriesName + ' : ' + -params[1].value + ' (L)';
        }
    },
    legend: {
        data:['速度','油位'],
        x: 'left'
    },
    toolbox: {
        show : true,
        feature : {
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            axisLine: {onZero: false},
            data : (function (){
                var now = new Date();
                var res = [];
                var len = 10;
                while (len--) {
                    res.unshift(now.toLocaleTimeString().replace(/^\D*!/,''));
                    now = new Date(now - 2000);
                }
                return res;
            })()
        }
    ],
    yAxis : [
        {
            name : '速度(km/h)',
            type : 'value',
            max : 300,
            axisLabel : {
                formatter: '{value} km/h'
            }
        },
        {
            name : '油位(L)',
            type : 'value'
        }
    ],
    series : [
        {
            name:'速度',
            type:'line',
            data:(function (){
                var res = [];
                var len = 10;
                while (len--) {
                    res.push(0);
                }
                return res;
            })()
        },
        {
            name:'油位',
            type:'line',
            yAxisIndex:1,
            data:(function (){
                var res = [];
                var len = 10;
                while (len--) {
                    res.push(0);
                }
                return res;
            })()
        }
    ]
};*/
/*mileOption = {

    tooltip : {
        trigger: 'axis',
        formatter: function(params) {
            return params[0].name + '<br/>'
                + params[0].seriesName + ':' + params[0].value + '(km)<br/>'
                + params[1].seriesName + ':' + -params[1].value + '(L)';
        }
    },
    legend: {
        data:['里程','油位'],
        x: 'left'
    },
    toolbox: {
        show : true,
        feature : {
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            axisLine: {onZero: false},
            data : (function (){
                var now = new Date();
                var res = [];
                var len = 10;
                while (len--) {
                    res.unshift(now.toLocaleTimeString().replace(/^\D*!/,''));
                    now = new Date(now - 2000);
                }
                return res;
            })()
        }
    ],
    yAxis : [
        {
            name : '里程(km)',
            type : 'value',
            max : 300,
            axisLabel : {
                formatter: '{value} km'
            }
        },
        {
            name : '油位(L)',
            type : 'value'
        }
    ],
    series : [
        {
            name:'里程',
            type:'line',
            data:(function (){
                var res = [];
                var len = 10;
                while (len--) {
                    res.push(0);
                }
                return res;
            })()
        },
        {
            name:'油位',
            type:'line',
            yAxisIndex:1,
            data:(function (){
                var res = [];
                var len = 10;
                while (len--) {
                    res.push(0);
                }
                return res;
            })()
        }
    ]
};*/

/*dashOption = {
    tooltip : {
        formatter: "{a} <br/>{c} {b}"
    },
    toolbox: {
        show : true,
        feature : {
            restore : {show: false},
            saveAsImage : {show: false}
        }
    },
    series : [
        {
            name:'速度',
            type:'gauge',
            min:0,
            max:220,
            splitNumber:11,
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    width: 10
                }
            },
            axisTick: {            // 坐标轴小标记
                length :15,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            splitLine: {           // 分隔线
                length :20,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            title : {
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder',
                    fontSize: 20,
                    fontStyle: 'italic'
                }
            },
            detail : {
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder'
                }
            },
            data:[{value: 0, name: 'km/h'}]
        },
        {
            name:'转速',
            type:'gauge',
            center : ['25%', '55%'],    // 默认全局居中
            radius : '50%',
            min:0,
            max:7,
            endAngle:45,
            splitNumber:7,
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    width: 8
                }
            },
            axisTick: {            // 坐标轴小标记
                length :12,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            splitLine: {           // 分隔线
                length :20,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            pointer: {
                width:5
            },
            title : {
                offsetCenter: [0, '-30%']       // x, y，单位px
            },
            detail : {
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder'
                }
            },
            data:[{value: 0, name: ''}]
        },
        {
            name:'油表',
            type:'gauge',
            center : ['75%', '50%'],    // 默认全局居中
            radius : '50%',
            min:0,
            max:2,
            startAngle:135,
            endAngle:45,
            splitNumber:2,
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: [[0.2, '#ff4500'],[0.8, '#48b'],[1, '#228b22']],
                    width: 8
                }
            },
            axisTick: {            // 坐标轴小标记
                splitNumber:10,
                length :10,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            axisLabel: {
                formatter:function(v){
                    switch (v + '') {
                        case '0' : return 'E';
                        case '1' : return 'Gas';
                        case '2' : return 'F';
                    }
                }
            },
            splitLine: {           // 分隔线
                length :15,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            pointer: {
                width:2
            },
            title : {
                show: false
            },
            detail : {
                show: false
            },
            data:[{value: 0, name: 'L'}]
        }
    ]
};*/
/*var echarts;
function loadChart()
{
    require.config({
        paths: {
            echarts: basePath+'resources/js/echarts/build/dist'
        }
    });
    require(
        [
            'echarts',
            'echarts/chart/line', // 使用柱状图就加载bar模块，按需加载
            'echarts/chart/gauge'
        ],
        function (ec) {
            echarts = ec;
            speedOilChart = echarts.init(document.getElementById('speedOil'));
            speedOilChart.setOption(speedOption);

            mileOilChart = echarts.init(document.getElementById('mileOil'));
            mileOilChart.setOption(mileOption,true);
            dashboardChart = echarts.init(document.getElementById('dashboard'));
            dashboardChart.setOption(dashOption,true);

        }
    );
}*/


//关闭控制面板
function closeSpeedOilPanel(panelID){
    $(panelID).hide();
    $("#openOilSpeedPanel").show();

}

//是否显示控制面板
function isShowPanel(type){
    if(type){ //最大化
        changeMapSize(1);
        $('#dashboardPanel').show();
    }else{
        $('#dashboardPanel').hide();
        changeMapSize(0);

    }
}
var baiduTrafficLayer,hasShowTracffic=false;
function smartTraffic(){
    if(!hasShowTracffic){
        baiduTrafficLayer =new BMap.TrafficLayer();
        maplet.addTileLayer(baiduTrafficLayer);
        $("#trafficTipsDiv").show();
        hasShowTracffic = true;
    }else{
        hasShowTracffic =false;
        closeSmartTraffic();
    }
}
function smartReflashTraffic(){
    maplet.removeTileLayer(baiduTrafficLayer);
    baiduTrafficLayer =new BMap.TrafficLayer();
    maplet.addTileLayer(baiduTrafficLayer);
}
function closeSmartTraffic(){
    maplet.removeTileLayer(baiduTrafficLayer);
    $("#trafficTipsDiv").hide();
}
/**  拖拽控制 div 只能在某个div下区域显示 **/
function onDrag(e){
    var d = e.data;
    if (d.left < 0){d.left = 0}
    if (d.top < 0){d.top = 0}
    if (d.left + 65 + $(d.target).outerWidth() > $(d.parent).width()){
        d.left = $(d.parent).width() - $(d.target).outerWidth();
    }
    if (d.top + $(d.target).outerHeight() > $(d.parent).height()){
        d.top = $(d.parent).height() - $(d.target).outerHeight();
    }
}

