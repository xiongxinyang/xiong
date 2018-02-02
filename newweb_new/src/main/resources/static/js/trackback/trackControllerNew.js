/*
//查询事件
function searchTrack() {
    var msg = new MsgBody();


    msg.Vehicle="";
    msg.BeginTime = "";
    msg.EndTime="";

    wsMonitor.send(msg);
}*/

/*var mapUtil = null;
var carTree ;
var wsMonitor =null;
var subscribeArray = [];
var webSocketUrl="ws://127.0.0.1:8080";
var webSocketUrlSockJS="http://127.0.0.1:8080/";
function initMonitorWS() {
    try{
        debugger;
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
                //车辆历史轨迹数据

            }
        };
        wsMonitor.onclose = function (event) {
            //console.log("订阅通道连接失败");
            initMonitorWS();
        };
    }catch(ex){

    }
}*/

var leftPanelShow = true;// 左侧面板是否显示
var fullScream = false;// 地图是否全屏
var topNavHeight = 0;// 导航栏高度
var mapflag = "track";
var maplet = null;
var listTopHeight = 50;
var mapToolsHeight = 36;
var nResizeHeight = 5 + 1;
var listHeight = 50 ;// 表格高度
var wh = [];// 用于存放浏览器的宽、高度
var  bodyWidth = 0;
var ws = null; // webSock

var trackList =[];// 轨迹列表
var trackPointList =[];// 地图轨迹标注点列表
//var trackLine = null;// 线路
var carMarker = null;// 车辆Marker
var startMarker = null;// 起点
var endMarker = null;// 结点
var queryCountIndex = 0;// 查询次数
var playSpeed =990;// 默认播放速度
var playIndex =0;

//tracklineColor:个性化设置的颜色值
var strokeColor = tracklineColor;//线条颜色
var strokeWeight = 4;//线条粗细
var zoom = 11;
var timer = null;//定时器;
var firstTrack = null;//第一个轨迹点
var isQuery = false;//是否正在查询标记
var mapType =0;//地图类型 0百度 1泰瑞
var queryMarkerAry =[];//用于存储 查找结果 显示在地图上的标记
var drawingManagerType=null;//查找类型
var queryContent =["区域查车","加油站","停车场","高速路出入口","收费站"];//0  1找加油站 2找停车场 3找高速路出入口 4找收费站
var markerClusterer = null;
var dashboardChart=null;//速度与油位仪表盘

var trackPlayStatus = 0;//播放状态;0:初始化;1:播放;2:暂停;3:停止

var ck_trackInputChecked = false;
var ck_alarmInputChecked = true;
var ck_imgInputChecked = true;
var winCloseCount = 0;
var trackButtonStatus = {play:false,pause:false,stop:false};
var isShowDashboardChart = true;
var queryAddressList = [];
var currentQueryAddressIndex = 0;

var runTrackDataList=null;
var hisAlarmDataList=null;
var blindDataTrackList=[];
var stopDataTrackList=[];

var gridboxData="";
var runTrackTable2Data="";
var stopTrackTable2Data="";
var blindAreaTable2Data="";
var imagesTable2Data="";
var alarmTable2Data="";
var areaCarTable2Data="";

var flag1=false;
var flag2=false;
var flag3=false;

var gridboxAddressCache = new HashMap();
var runTrackTable2AddressCache1 = new HashMap();
var runTrackTable2AddressCache2 = new HashMap();
var runTrackTable2AddressCache3= new HashMap();
var stopTrackTable2AddressCache = new HashMap();
var blindAreaTable2AddressCache = new HashMap();
var alarmTable2AddressCache = new HashMap();

var GlobalAddreeCache = new HashMap(); // 解析好的地址缓存 key:lng_lat  value:中文地址
var  mapUtil = null;
$(function() {
    initQueryTime();
    //点击关闭查询对话框
    $(".closd_icon").click(function(){
        cancleQueryTrack();
    });
    iniTable("",120);

    PageResize();// 初始大小
    window.onresize = PageResize;

    //加载地图
    bindChangeMap();
    changeMap("baiduGis");
    //mapUtil  = new MapUtil("baiduGis"); //googleGis
    //mapUtil.loadMap("mapDiv");


    $("#dashboardPanel").hide();
    isShowDashboardChart = false;


    $("#nResizeDiv").bind("mousedown", nResizeMousedown);// 拖拽


    $("#openOilSpeedPanel").bind("click", function(){
        $(this).hide();
        //	$("#dashboardPanel").show();
        isShowDashboardChart = true;
    });// 控制油位面板

    $("#showQueryPanel").bind("click", function(){
        $(this).hide();
        $("#dashboardPanel").hide();
        isShowDashboardChart = false;
        $("#queryPanel").show();
    });// 查询控制面板

    bindCtrPanel();
    $("#txtSearch").bind("click", findPlayBackTrack);// 绑定查询
    $("#txtPlaySpeed").slider({onChange:function(value){
        playSpeed =(99-value)*10;
    }});// 绑定播放速度 value 为0 到100 0对应的是2秒 100对应的是0.01秒

    $("#mapAllLi").bind("click", function(){
        changeMapSize(0);//放大
    });
    /*var beginTime1 = (new Date(decodeURIComponent(encodeURIComponent("2017/03/27 20:10:10")))).getTime();
     var endTime1 = (new Date(decodeURIComponent(encodeURIComponent("2017/03/28 20:10:10")))).getTime();*/
    var beginTime = (new Date(decodeURIComponent(getQueryString("beginTime")))).getTime();
    var endTime = (new Date(decodeURIComponent(getQueryString("endTime")))).getTime();
    var vehicleId = getQueryString("vehicleId");
    debugger;
    /*var beginTime = getQueryString("beginTime");
     var endTime = getQueryString("endTime");*/
//	vehicleId=149205;
    var vehicleUrl = basePath+'secure/gis/queryTrackVehicleList.html';
    /*if(vehicleId==null){
     vehicleUrl +="?vehicleId="+vehicleId;
     }*/
    $('#txtVehicle').combogrid({
        panelWidth:155,
        url: "/VehicleList",
        idField:'ID',
        textField:'RegistrationNO',
        mode:'remote',
        fitColumns:true,
        columns:[[
            {field:'ID',title:'ID',width:60,hidden:true},
            {field:'RegistrationNO',title:'车辆号码',align:'left',width:120},
            {field:'WorkUnitName',title:'所属企业',align:'right',width:80,hidden:true}
        ]],
        onSelect:function(index,row){
            var g = $('#txtVehicle').combogrid('grid');
            var r = g.datagrid('getSelected');	// get the selected row
            $('#txtVehicle').val(r.RegistrationNO);  //下拉显示的值
            $('#txtVehicleId').val(r.ID);   //向后台传的值
        },
    });

    if(vehicleId!=null)
    {

        $('#txtVehicle').combogrid({ readonly: true });
        $('#txtVehicle').combogrid('setValue',vehicleNO);
        $('#txtVehicleId').val(vehicleId);
    }
    if(beginTime!=null)
    {

        $('#txtStartTime').datetimebox({
            disabled:false,
            value: (new Date(beginTime)).format("yyyy-MM-dd hh:mm:ss"),
            required: true
        });

    }
    if(endTime!=null)
    {
        $('#txtEndTime').datetimebox({
            disabled:false,
            value: (new Date(endTime)).format("yyyy-MM-dd hh:mm:ss"),
            required: true
        });

    }


    bindControllerTool();

    $("#smartSearchTxt").focus(function(e) {
        if (this.value == "输入 区域/点") {
            $(this).val("").css("color", "black");
        }
    }).blur(function() {
        if (this.value == "") {
            $(this).val("输入 区域/点").css("color", "#c0c0c0")
        }
    })/*.keyup(function(e) {
     if (e.keyCode == "13") {
     queryVehicle()
     }
     })*/;

    //初始化 拉框查找车  查找其他信息
   // initAreaQueryTable();

    // loaDashboardChart();//初始化速度与油位仪表盘

    $('#exportTableInfo').bind("click", exportExcel);
    $('#clearLines').bind("click", clearLines);

    // 播放工具栏吸附列表上边缘
    var _ctrlTop = $("#mapDiv").height() + $("#mapTools").height() - 5;
    wh = getPageSize();
    var _ctrlLeft = wh[2]/2 - $("#playControlBox").width()/2 + 10;
    var _pnlWidth = $("#dashboardPanel").width();
    _ctrlLeft = _ctrlLeft > _pnlWidth ? _ctrlLeft : _pnlWidth+10;
    $("#playControlBox").css({"top":_ctrlTop - $("#playControlBox").height(),"left":_ctrlLeft});
    $("#queryPanel").css("top",_ctrlTop - $("#queryPanel").height() - 10);
    $("#dashboardPanel").css("top",_ctrlTop - $("#dashboardPanel").height());

    initTrackWs();

});


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
}

//是否显示过图标
var hadShowChart = false,hadShowDriveSeg=false,hadShowStop=false,hadShowBlindArea=false;

// 绑定控制面板
function bindCtrPanel(){
    $("#ctrlPanelUl li").each(function(i,n){
        $(n).bind("click", function () {
            $("#ctrlPanelUl li").removeClass("now");
            $(n).addClass("now");

            $("#monitorList").children("div").hide();

            var   panelId = $(this).attr("panelId");
            $("#" + panelId).fadeIn();
            if('chartCarDiv' == panelId){
                $('#exportTableInfo').hide();
                if(!hadShowChart && typeof(TrackList4Chart) != "undefined"){
                   // loadChart(TrackList4Chart);
                    hadShowChart = true;
                }
            }else{
                $('#exportTableInfo').show();
            }
            if(typeof(trackResult) == "undefined") return;
            // 行驶段
            if("drivingCarDiv" == panelId && !hadShowDriveSeg){
                //runTrackAnalysis(trackResult.listDriveInfos);
                runTrackAnalysis(trackResult);
                hadShowDriveSeg = true;
            }

            // 停车
            /*if("stopCarLiDiv" == panelId && !hadShowStop){
                //stopTrackAnalysis(trackResult.listTrackInfos);
                stopTrackAnalysis(trackResult);
                hadShowStop = true;
            }*/

            // 盲区
          /*  if("deadZoneCarDiv" == panelId && !hadShowBlindArea){
                //blindAreaAnalysis(trackResult.listTrackInfos);
                blindAreaAnalysis(trackResult);
                hadShowBlindArea = true;
            }*/

        });
    });

}


function bindControllerTool(){
    $("#setToolWindow").bind("click",function(){ //窗口化
        $(this).hide();
        $("#setToolMin").show();
        $("#setToolMax").show();
        $("#mapTools").show();
        $("#map").height(wh[3] -360 ).show();
        $("#mapDiv").height(wh[3] -340).show();
        $("#monitorList").height(320);

      /*  $.reInitGridById('gridbox',0,280,gridboxData);
        $.reInitGridById('runTrackTable2',1,280,runTrackTable2Data);
        $.reInitGridById('stopTrackTable2',2,280,stopTrackTable2Data);
        $.reInitGridById('blindAreaTable2',3,280,blindAreaTable2Data);
        $.reInitGridById('imagesTable2',4,280,imagesTable2Data);
        $.reInitGridById('alarmTable2',5,280,alarmTable2Data);
        $.reInitGridById('areaCarTable2',6,280,areaCarTable2Data);*/

    });
    $("#setToolMin").bind("click",function(){ //最小化
        $(this).hide();
        $("#mapTools").show();
        $("#setToolWindow").show();
        $("#map").height(wh[3] - (fullScream ? 0 : topNavHeight) - 220).show();
        $("#mapDiv").height(wh[3] - (fullScream ? 0 : topNavHeight) - 220).show();
        $("#setToolMax").show();
        $("#monitorList").height(180);

//		$.reInitGrid(150);
      /*  $.reInitGridById('gridbox',0,140,gridboxData);
        $.reInitGridById('runTrackTable2',1,140,runTrackTable2Data);
        $.reInitGridById('stopTrackTable2',2,140,stopTrackTable2Data);
        $.reInitGridById('blindAreaTable2',3,140,blindAreaTable2Data);
        $.reInitGridById('imagesTable2',4,140,imagesTable2Data);
        $.reInitGridById('alarmTable2',5,140,alarmTable2Data);
        $.reInitGridById('areaCarTable2',6,140,areaCarTable2Data);*/
    });
    $("#setToolMax").bind("click",function(){ //最大化
        $(this).hide();
        $("#setToolWindow").show();
        $("#setToolMin").show();
        $("#mapTools").hide();
        $("#mapDiv").hide();
        $("#map").hide();
        $("#monitorList").height(wh[3]-40);

     /*   $.reInitGridById('gridbox',0,(wh[3]-50),gridboxData);
        $.reInitGridById('runTrackTable2',1,(wh[3]-50),runTrackTable2Data);
        $.reInitGridById('stopTrackTable2',2,(wh[3]-50),stopTrackTable2Data);
        $.reInitGridById('blindAreaTable2',3,(wh[3]-50),blindAreaTable2Data);
        $.reInitGridById('imagesTable2',4,(wh[3]-50),imagesTable2Data);
        $.reInitGridById('alarmTable2',5,(wh[3]-50),alarmTable2Data);
        $.reInitGridById('areaCarTable2',6,(wh[3]-50),areaCarTable2Data);*/
    });
}
// WebSocket 消息体
function MsgBody(){
    this.Vehicle = null;
    this.BeginTime=null;
    this.EndTime = null;


    // 如需更多信息，在实例化之后，直接添加进去
    // 发送前，用这个转换为字符串 JSON.stringify(实例名) 即可
}
//地图缩放及全屏
function changeMapSize(type){
    if(type==0){//放大
        $("#nResizeDiv").hide();
        $("#tabTopDiv").hide();
        $("#monitorList").hide();
        $("#mapAllLi i").removeClass().addClass("mapQuitAll");
        $("#mapAllLi span").text("缩小");
        $("#openOilSpeedPanel").hide();
        fullScream = true;
        PageResize();
        $("#mapAllLi").unbind().bind("click", function(){
            changeMapSize(1);//放大
        });
    }else{
        $("#nResizeDiv").show();
        $("#tabTopDiv").show();
        $("#monitorList").show();
        $("#mapAllLi i").removeClass().addClass("mapAll");
        $("#mapAllLi span").text("全屏");
        $("#openOilSpeedPanel").show();
        fullScream = false;
        PageResize();
        $("#mapAllLi").unbind().bind("click", function(){
            changeMapSize(0);
        });
    }
}


/*function loadChart(trackDatas)
{
    var trackTimeList=[];
    var trackSpeedList=[];
    var trackOilList=[];
    var trackMileList=[];
    $.each(trackDatas, function(i, item){
        trackSpeedList.push(item.currentSpeed);
        trackTimeList.push(item.getherTime);
        trackMileList.push(item.currentMileage);
        //trackOilList.push(item.remainOil);
    });
    require.config({
        paths: {
            echarts: basePath+'resources/js/echarts/build/dist'
        }
    });

    // Step:4 require echarts and use it in the callback.
    // Step:4 动态加载echarts然后在回调函数中开始使用，注意保持按需加载结构定义图表路径
    require(
        [
            'echarts',
            'echarts/chart/line' // 使用柱状图就加载bar模块，按需加载
        ],
        function (ec) {
            // 基于准备好的dom，初始化echarts图表
            var speedChart = ec.init(document.getElementById('speed'));
            var mileChart = ec.init(document.getElementById('mile'));
            speedoption = {
                title : {
                    text: '速度油位曲线图',
                    subtext: '',
                    x: 'center'
                },
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
                dataZoom : {
                    show : true,
                    realtime : true,
                    start : 0,
                    end : 100
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        axisLine: {onZero: false},
                        data : trackTimeList
                    }
                ],
                yAxis : [
                    {
                        name : '速度(km/h)',
                        type : 'value',
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
                        data:trackSpeedList
                    },
                    {
                        name:'油位',
                        type:'line',
                        yAxisIndex:1,
                        data:trackOilList
                    }
                ]
            };
            mileoption = {
                title : {
                    text: '里程油位曲线图',
                    subtext: '',
                    x: 'center'
                },
                tooltip : {
                    trigger: 'axis',
                    formatter: function(params) {
                        return params[0].name + '<br/>'
                            + params[0].seriesName + ' : ' + params[0].value + ' (km)<br/>'
                            + params[1].seriesName + ' : ' + -params[1].value + ' (L)';
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
                dataZoom : {
                    show : true,
                    realtime : true,
                    start : 0,
                    end : 100
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        axisLine: {onZero: false},
                        data : trackTimeList
                    }
                ],
                yAxis : [
                    {
                        name : '里程(km)',
                        type : 'value',
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
                        data:trackMileList
                    },
                    {
                        name:'油位',
                        type:'line',
                        yAxisIndex:1,
                        data:trackOilList
                    }
                ]
            };
            // 为echarts对象加载数据
            speedChart.setOption(speedoption);
            mileChart.setOption(mileoption);
        }
    );
}*/

////初始化表格
//function initGrid(){
//}



// 页面发生变化时
function PageResize() {
    try {
        wh = getPageSize();
        bodyWidth = $("body").width();
        $("#setToolWindow").show();
        $("#right").width(bodyWidth).height(wh[3] - topNavHeight);

        var h = listHeight + listTopHeight + mapToolsHeight + nResizeHeight+100;//列表 工具栏高度
        $("#mapDiv").width(bodyWidth).height(wh[3] - (fullScream ? 36 :h));
        $("#map").width(bodyWidth).height(wh[3] - (fullScream ? 36 :h));

        $.reInitGridById('gridbox',0,(h-80),gridboxAddressCache);


    } catch (ex) {
        console.error(ex);
    }
};


function nResizeMousedown(event) {
    e = event || window.event;
    var listTopHeight =0;
    $("#nResizeMoveDiv").css("top", $("#nResizeDiv").offset().top - (fullScream ? 0 : topNavHeight));
    $("#nResizeMoveDiv").height(wh[3] - parseInt($("#nResizeMoveDiv").css("top")+20)  );
    $("#nResizeMoveDiv").width($("#right").width());
    $("#nResizeMoveDiv").show();
    $("#nResizeDiv").unbind("mousedown");
    $("#right").bind("mousemove", leftMousemove).bind("mouseup", leftMouseup);
    // $("#nResizeDiv").delegate
    //$(document).bind("mouseup", leftMouseup);
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
    $("#right").unbind("mousemove").unbind("mouseup");

    // $(document).unbind("mouseup");
    $("#nResizeMoveDiv").hide();
    var nResizeTop = parseInt($("#nResizeMoveDiv").css("top"));
    var bottomHeight = (wh[3] - (nResizeTop - mapToolsHeight) - (fullScream ? 0 : topNavHeight) - mapToolsHeight);
    if (nResizeTop <= mapToolsHeight) {
        nResizeTop = mapToolsHeight;
        $("#map").hide();
        $("#mapDiv").hide();
        $("#mapTools").hide();
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
        $("#mapTools").height(36).show()
    }
    $("#map").height(nResizeTop - mapToolsHeight);
    $("#mapDiv").height(nResizeTop - mapToolsHeight);
    var lh = wh[3] - nResizeHeight - $("#map").height() - listTopHeight - (fullScream ? 0 : topNavHeight) - mapToolsHeight;
    $("#monitorList").height(lh);
    //$("#playControlBox").css("bottom",(lh +18));
    $("#queryControlBox").css("bottom",(lh +48));

    //列表高度
   /* $.reInitGridById('gridbox',0,lh,gridboxData);
    $.reInitGridById('runTrackTable2',1,lh,runTrackTable2Data);
    $.reInitGridById('stopTrackTable2',2,lh,stopTrackTable2Data);
    $.reInitGridById('blindAreaTable2',3,lh,blindAreaTable2Data);
    $.reInitGridById('imagesTable2',4,lh,imagesTable2Data);
    $.reInitGridById('alarmTable2',5,lh,alarmTable2Data);
    $.reInitGridById('areaCarTable2',6,lh,areaCarTable2Data);*/

    if (typeof map != "undefined" && map != null) {
        // map.mapResize($("#mapImg").width(), $("#mapImg").height())
    }
    $("#nResizeDiv").bind("mousedown", nResizeMousedown)
    //$(document).unbind("mouseup");
}

/** 查询回放轨迹数据 */
function findPlayBackTrack() {
    loading = true;
    hadShowChart = false;
    hadShowDriveSeg = false;
    hadShowStop = false;
    hadShowBlindArea = false;
    GlobalTrackPointData = [];

    stopTrack();
    clearData();
    queryCountIndex = 0;
    var vehicle = $('#txtVehicleId').val();
    if(vehicle==""){
        alert("请先选择车辆");
        return ;
    }
    var startTime = $('#txtStartTime').datetimebox("getValue");
    if(startTime==''){alert('必须填写开始时间');return;}
    var endTime = $('#txtEndTime').datetimebox("getValue");
    if(endTime==''){alert('必须填写结束时间');return;}
    var endTime_t= new Date(endTime).getTime();//将字符串转化为时间
    var startTime_t=new Date(startTime).getTime();//将字符串转化为时间
    if(startTime_t>endTime_t){alert("结束时间必须开始时间！");return;};
    if((endTime_t-startTime_t)/(1000*60*60*1)>8){alert('选择的查询时间范围过大，时间范围必须在8小时内!');return;}
    $("#txtSearch").unbind("click");
    $("#msgLoadImg").show();
    $("#msgSpan").text("正在查询数据,请稍候!");
    $("#queryControlBox").show();
    $("#playControlBox").hide();
    searchDatas();
}

function clearData(){
    playIndex  =0;
    startMarker = null;// 起点
    endMarker = null;// 结点

    trackList.length =0;
    trackList = [];
    trackPointList.length =0;
    trackPointList =[];// 地图轨迹标注点列表

    //mapUtil.clearOverlays();
    queryCountIndex = 0;

    var gridboxData="";
    var runTrackTable2Data="";
    var stopTrackTable2Data="";
    var blindAreaTable2Data="";
    var imagesTable2Data="";
    var alarmTable2Data="";
    var areaCarTable2Data="";
    $.clearAllGridData('gridbox');
    //$.clearAllGridData('gridbox');
    /*$.clearAllGridData('stopTrackTable2');
     $.clearAllGridData('blindAreaTable2');
     $.clearAllGridData('runTrackTable2');
     $.clearAllGridData('alarmTable2');
     $.clearAllGridData('imagesTable2');
     $.clearAllGridData('areaCarTable2');*/

    //$("#txtSearch").bind("click", findPlayBackTrack);// 绑定查询

    queryAddressList = [];
    currentQueryAddressIndex = 0;
}


var trackArgs;

//取消轨迹查询
function cancleQueryTrack(){
    if(confirm("正在请求数据,是否取消?")){
        isQuery = false;
        $("#queryControlBox").hide();
        clearData();//清除现有数据 列表及地图上的信息
    }
}

var GlobalTrackPointData = [];
function asyncAddTrackPoint(){
    setTimeout(function(){
        if(GlobalTrackPointData.length > 0){
            var obj = GlobalTrackPointData.shift();
            getVehicleTrackPoint(obj);
        }
    },5);
}

//加载轨迹数据
function loadTrackData(trackData,vehicleName,vehicleid){
    try{
        if(trackData==null){
            return ;
        }
        gridboxAddressCache.clear();
        var tl =[];
        for(var i=0;i<trackData.length;i++){
            var obj = trackData[i];
            var point=new BMap.Point(obj.latitude,obj.longitude);
            //var point = mapUtil.getPoint(obj.longitude,obj.latitude);
            trackPointList.push(point);

            var time = new Date(obj.time);
            var times=time.toLocaleString();
            var speed=obj.speed;
            if( obj.speed != undefined && obj.speed!=0) {
                speed = obj.speed.toFixed(1);
            }

            var val=[];
            val.push((i+1));
            val.push(vehicleName);
           /* val.push(obj.VehicleNo);
            val.push(obj.VehicleNoColor);*/
            //val.push(obj.UnitName);
            val.push(obj.latitude);
            val.push(obj.longitude);
            val.push(speed);
            val.push(getHeadDesZS(obj.direction));
            //val.push(obj.CurrentMileage);
            val.push(times);
            gridboxAddressCache.put(i,{ id:i,data:val});

            if(ck_trackInputChecked && val[6]>5){
                GlobalTrackPointData.push(obj);
                asyncAddTrackPoint();
            }
            //if(i == 0 || i == trackData.length - 1 || val[6] > 5){
                obj.rowId = i;
                tl.push(obj);
            //}
        }

        if(gridboxAddressCache.size() > 0){
            $.addGridData('gridbox',gridboxAddressCache);
        }
        trackList.push.apply(trackList,tl);// 合并
        drawTrackLine(tl,vehicleName,vehicleid);
        tl = null;
    }catch(ex){
        console.error(ex);
        return null;
    }
}

// 数据转为Json
function strToJson(jsonStr) {
    try{
        return  $.parseJSON(jsonStr);
    }catch(ex){
        console.log(ex);
        return null;
    }
}


//画轨迹线
/***
 *  如果有报警，则需将报警的画线
 */
function drawTrackLine(trackAry,vehicleName,vehicleid){
    if(strokeColor ==""){
        strokeColor="#FF0000";
    }
    strokeColor = strokeColor =="#FFFFFF"?"#330099":strokeColor;
    var temp =[];
    var isAlarm=null;
    // 添加到轨迹数组中 画轨迹
    for(var i=0;i<trackAry.length;i++){
        var obj = trackAry[i];
        var point=new BMap.Point(obj.latitude,obj.longitude);
        /*var point =  mapUtil.getPoint(obj.longitude,obj.latitude);*/
        temp.push(point);
    }
    if(temp.length>0){
        mapUtil.drawPolyline(temp,strokeColor,strokeWeight,0.5);
    }

    if(trackAry.length>0){
        mapUtil.setcenter(obj.longitude,obj.latitude);
        drawCarMarker(trackAry[trackAry.length-1],vehicleName,vehicleid);//添加车在每段轨迹的最后的位置
    }
}

//画车辆标记
function drawCarMarker(obj,vehicleName,vehicleid){
    debugger;
    var iconUrl = getCarImage(obj);
    mapUtil.drawCarMarker(iconUrl,obj,vehicleName,vehicleid);
}

// 添加起始点
function addStartMarker(point){
    var startIconUrl = basePath + "/img/qd.png";
    mapUtil.addStartMarker(startIconUrl,point.lng,point.lat);
}

// 添加终点
function addEndMarker(point){
    var endIconUrl = basePath + "/img/zd.png";
    mapUtil.addEndMarker(endIconUrl,point.lng,point.lat);
}

// 播放轨迹
function playTrack(){
    trackPlayStatus = 1;
    bindTrackButtonClickFunction('play',false);
    $("#playTrack").hide();
    bindTrackButtonClickFunction('stop',true);
    bindTrackButtonClickFunction('pause',true);
    $("#pauseTrack").show();

    setTimeout(function() {
        moveCarMarker();
    }, 500);
}

function trackPointScrollTop(){
    var div = $('#trackTable').closest('.ui-jqgrid-bdiv')[0];
    div.scrollTop = playIndex * 23;
}

function trackPointScrollTopBackground(){
    var ri = playIndex;
    if(ri == 0){
        ri = trackList.length - 1;
    }else{
        ri --;
    }
    $('#tTable' + ri).removeClass("ui-state-hover");
    $('#tTable' + playIndex).addClass('ui-state-hover');
}

// 移动车辆标记
function moveCarMarker(){
    playIndex = playIndex +1;
    var pVal =  (playIndex/trackList.length)*100;
    $('#progressBox').progressbar('setValue', pVal.toFixed(1));// 进度条
    if(playIndex >= trackList.length-1){
        $('#progressBox').progressbar('setValue', 100);// 进度条
    }

    if(playIndex<trackList.length){
        var  poit = trackList[playIndex];
        drawCarMarker(poit,poit.vehicleNo,poit.vehicleId);
        updateDashboardChart(poit);

        /**
         * 滚动grid
         */
        //trackPointScrollTop();
        $.selectGridRow('gridbox',trackList[playIndex].rowId);
        //trackPointScrollTopBackground();
        if(trackPlayStatus == 1){
            timer = setTimeout(function() {
                moveCarMarker();
            }, playSpeed);
        }
    }else{
        bindTrackButtonClickFunction('play',true);
        $("#playTrack").show();
        bindTrackButtonClickFunction('pause',false);
        $("#pauseTrack").hide();
        clearTimeout(timer);//停止播放
        trackPlayStatus = 0;
        playIndex = 0;
    }
}

function pauseTrack(){//暂停播放
    trackPlayStatus = 2;
    clearTimeout(timer);//停止播放
    bindTrackButtonClickFunction('play',true);
    $("#playTrack").show();
    bindTrackButtonClickFunction('pause',false);
    $("#pauseTrack").hide();
}

function stopTrack()
{
    trackPlayStatus = 3;
    clearTimeout(timer);//停止播放
    var pVal = 0;
    $('#progressBox').progressbar('setValue', pVal.toFixed(1));// 进度条恢复
    if(trackList.length>0){
        var poit = trackList[0];
        drawCarMarker(poit,poit.vehicleNo,poit.vehicleId);//车辆地图复位
        $('#tTable' + playIndex).removeClass('ui-state-hover');
        playIndex = 0;
        //resetDashboardChart();
    }
    bindTrackButtonClickFunction('play',true);
    $("#playTrack").show();
    bindTrackButtonClickFunction('stop',false);
    bindTrackButtonClickFunction('pause',false);
    $("#pauseTrack").hide();
}


function onPlayTimeSpaceChg(){
    var val = parseInt($('#playTimeSpace').val(), 10);
    if(val==-1)
    {
        $('#txtEndTime').datetimebox({
            disabled:false,
            required: true
        });
        $('#txtStartTime').datetimebox({
            disabled:false,
            required: true
        });
    }else{
        var end = new Date();
        var sEnd = end.format("yyyy-MM-dd hh:mm:ss");
        var begin = addHours(end,val);
        var sBegin = begin.format("yyyy-MM-dd hh:mm:ss");
        $('#txtEndTime').datetimebox({
            disabled:true,
            value: sEnd,
            required: true
        });
        $('#txtStartTime').datetimebox({
            disabled:true,
            value: sBegin,
            required: true
        });
    }
}

function exportpanShow()
{
    var args = trackArgs.split(',');
    post(basePath+'secure/gis/exportTrack.html?time='+ new Date(), {vehicleId:args[0],startTime:args[1],endTime:args[2],mergeSeconds:args[3],stopSeconds:args[4]});
}



// 加时间
function addHours(date, value) {
    date.setHours(date.getHours() + value);
    return date;
}

//post提交
function post(URL, PARAMS) {
    var temp = document.createElement("form");
    temp.action = URL;
    temp.method = "post";
    temp.style.display = "none";
    for (var x in PARAMS) {
        var opt = document.createElement("input");
        opt.name = x;
        opt.value = PARAMS[x];
        temp.appendChild(opt);
    }
    document.body.appendChild(temp);
    temp.submit();
    return temp;
}

function exportExc(URL, PARAMS) {
    var temp = document.createElement("form");
    temp.action = URL;
    temp.method = "post";
    temp.style.display = "none";
    //添加标题
    var opt = document.createElement("input");
    opt.name = "titles";
    opt.value = PARAMS.titles;
    opt.type="hidden";
    temp.appendChild(opt);

    var opt1 = document.createElement("input");
    opt1.name = "name";
    opt1.value = PARAMS.name;
    opt1.type = "hidden";
    temp.appendChild(opt1);


    var subLocationArrays = getSubParams(PARAMS.data);
    for (var i = 0; i < subLocationArrays.length; i++) {
        var opt = document.createElement("input");
        opt.name = "subData"+i;
        opt.value = (subLocationArrays[i]).join("&");
        temp.appendChild(opt);
    }

    document.body.appendChild(temp);
    temp.submit();
}

function getSubParams(data) {
    var locationRows = data.split("&");
    var i = locationRows.length / 100;
    var subLocationRows = new Array();
    for (var j = 0;j < i ; j++) {
        subLocationRows.push(locationRows.slice(j*100,(j+1)*100));
    }
    return subLocationRows;
}

/*//停车轨迹数据分析
function stopTrackAnalysis(trackDatas)
{
    var firstStop=null;//第一次停车轨迹点
    var firstStart=null;//第一次启动轨迹点
    var stopTrackList=[];
    if(trackDatas==null){
        return ;
    }

    for(var i = 0; i < trackDatas.length; i++){
        if(trackDatas[i].currentSpeed==0&&firstStop==null){
            firstStop = trackDatas[i];//找到第一次停车点
            continue;
        }
        if(trackDatas[i].currentSpeed>0&&firstStop!=null&&firstStart==null){
            firstStart = trackDatas[i];//找到第一次启动点
            //序号、车牌号、车牌颜色、停车开始时间、停车结束时间、停车时长、里程(km)、位置
            var stopTrack={name:firstStart.VehicleNo,
                noColor:firstStart.VehicleNoColor,
                startTime:firstStop.getherTime,
                endTime:firstStart.getherTime,
                //pulseSpeed:firstStart.pulseSpeed,
                gpsSpeed:firstStart.currentSpeed,
                correctedLng:firstStart.longitude,
                correctedLat:firstStart.latitude,
                timeSpan:dateDiff(firstStop.getherTime,firstStart.getherTime),
                mileage:firstStart.currentMileage-firstStop.currentMileage,
                location:firstStop.locationInfo};
            stopTrackList.push(stopTrack);
            firstStop = null;
            firstStart = null;
        }
    }

    if(firstStop!=null&&firstStart==null)//一直处于停车情况下的处理
    {
        firstStart = trackDatas[trackDatas.length-1];
        var stopTrack={name:firstStart.VehicleNo,
            noColor:firstStart.VehicleNoColor,
            startTime:firstStop.getherTime,
            endTime:firstStart.getherTime,
            //pulseSpeed:firstStart.pulseSpeed,
            gpsSpeed:firstStart.currentSpeed,
            correctedLat:firstStart.longitude,
            correctedLng:firstStart.latitude,
            timeSpan:dateDiff(firstStop.getherTime,firstStart.getherTime),
            mileage:firstStart.currentMileage-firstStop.currentMileage,
            location:firstStop.locationInfo};
        stopTrackList.push(stopTrack);
        firstStop = null;
        firstStart = null;
    }
    var tmpHashMap = new HashMap();
    for(var i = 0; i < stopTrackList.length; i++){
        var tmpArray = [];
        tmpArray.push(i+1);
        tmpArray.push(stopTrackList[i].name);
        tmpArray.push(stopTrackList[i].noColor);
        tmpArray.push(stopTrackList[i].startTime);
        tmpArray.push(stopTrackList[i].endTime);
        tmpArray.push(stopTrackList[i].timeSpan);
        tmpArray.push(stopTrackList[i].mileage);
        tmpArray.push("");
        tmpArray.push(stopTrackList[i].correctedLng);
        tmpArray.push(stopTrackList[i].correctedLat);
        //tmpArray.push((stopTrackList[i].pulseSpeed==0 ? stopTrackList[i].gpsSpeed : stopTrackList[i].pulseSpeed)
        tmpArray.push((stopTrackList[i].gpsSpeed));
        tmpHashMap.put(i,{id:i,data:tmpArray});

    }

    if(tmpHashMap.size() > 0){
        $.addGridData('stopTrackTable2',tmpHashMap);
    }
    tmpHashMap=null;
}*/



/*//盲区轨迹数据分析
function blindAreaAnalysis(trackDatas)
{
    var firstBlind=null;//第一次盲区轨迹点
    var firstUnBlind=null;//第一次恢复轨迹点
    var blindTrackList=[];
    if(trackDatas==null){
        return ;
    }
    for(var i = 0; i < trackDatas.length; i++){
        if(/!*trackDatas[i].valid==false&&*!/firstBlind==null){
            firstBlind = trackDatas[i];//找到第一次盲点
            continue;
        }
        if(/!*trackDatas[i].valid==true&&*!/firstBlind!=null&&firstUnBlind==null){
            firstUnBlind = trackDatas[i];//找到第一次可视点
            //序号、开始时间、结束时间、盲时分钟、盲时经度、盲时纬度、盲时位置
            var blindTrack={startTime:firstBlind.getherTime,
                endTime:firstUnBlind.getherTime,
                timeSpan:dateDiff(firstBlind.getherTime,firstUnBlind.getherTime),
                longitude:firstBlind.longitude,
                latitude:firstBlind.latitude,
                location:firstBlind.locationInfo,
                correctedLng:firstBlind.longitude,
                correctedLat:firstBlind.latitude};
            blindTrackList.push(blindTrack);
            firstBlind = null;
            firstUnBlind = null;
        }
    }

    if(firstBlind!=null&&firstUnBlind==null){//一直处于盲区情况下的处理
        firstStart = trackDatas[trackDatas.length-1];
        var endTime = $('#txtEndTime').datetimebox("getValue");
        var blindTrack={startTime:firstBlind.getherTime,
            endTime:endTime,
            timeSpan:dateDiff(firstBlind.getherTime,endTime),
            longitude:firstBlind.longitude,
            latitude:firstBlind.latitude,
            location:firstBlind.locationInfo,
            correctedLng:firstBlind.longitude,
            correctedLat:firstBlind.latitude};
        blindTrackList.push(blindTrack);
        firstBlind = null;
        firstUnBlind = null;
    }

    var tmpHashMap = new HashMap();
    for(var i = 0; i < blindTrackList.length; i++){
        var tmpArray = [];
        tmpArray.push(i+1);
        tmpArray.push(blindTrackList[i].startTime);
        tmpArray.push(blindTrackList[i].endTime);
        tmpArray.push(blindTrackList[i].timeSpan);
        tmpArray.push(blindTrackList[i].longitude);
        tmpArray.push(blindTrackList[i].latitude);
        tmpArray.push("");
        tmpArray.push(blindTrackList[i].correctedLng);
        tmpArray.push(blindTrackList[i].correctedLat);
        //tmpArray.push((blindTrackList[i].pulseSpeed==0 ? blindTrackList[i].gpsSpeed : blindTrackList[i].pulseSpeed));
        tmpArray.push((blindTrackList[i].currentSpeed));
        tmpHashMap.put(i,{id:i,data:tmpArray});
    }

    if(tmpHashMap.size() > 0){
        $.addGridData('blindAreaTable2',tmpHashMap);
    }
    tmpHashMap=null;
}*/


//行驶段轨迹数据分析
function runTrackAnalysis(runTrackList)
{
    var tmpHashMap = new HashMap();
    for(var i = 0; i < runTrackList.length; i++){
        var obj = [];
        obj.push(i+1);
        obj.push(runTrackList[i].startDate);
        obj.push(runTrackList[i].stopDate);
        obj.push(runTrackList[i].startMileage);
        obj.push(runTrackList[i].stopMileage);
        obj.push(runTrackList[i].sumMileage);
        obj.push(runTrackList[i].driveTime);
        obj.push(runTrackList[i].driveMileage);
        //obj.push(runTrackList[i].changeOil);
        obj.push(runTrackList[i].startLng);
        obj.push(runTrackList[i].startLat);
        obj.push(runTrackList[i].stopLng);
        obj.push(runTrackList[i].stopLat);
        obj.push("");
        obj.push("");
        obj.push("");
        obj.push(runTrackList[i].startCorrectLng);
        obj.push(runTrackList[i].startCorrectLat);
        obj.push(runTrackList[i].endCorrectLng);
        obj.push(runTrackList[i].endCorrectLat);
        obj.push((runTrackList[i].pulseSpeed==0 ? runTrackList[i].gpsSpeed : runTrackList[i].pulseSpeed));
        tmpHashMap.put(i,{id:i,data:obj});
    }
    if(tmpHashMap.size() > 0){
        $.addGridData('runTrackTable2',tmpHashMap);
    }
    tmpHashMap=null;
}

//关闭控制面板
function closePanel(panelID){
    $(panelID).hide();
    if(panelID=="#dashboardPanel"){
        $("#openOilSpeedPanel").show();
        isShowDashboardChart = false;
    }
    if(panelID=="#queryPanel"){
        $("#showQueryPanel").show();
    }
}

//1找加油站 2找停车场 3找高速路出入口 4找收费站
function findAreaInfo(title,type){
    $("#areaQueryPanel").hide();
    $("#areaQueryVehiclePanel").hide();
    $("#areaQueryTable").clearGridData();
    if(mapType==0){
        baiduPaintingMap(type);
    }else{
        smartPaintingMap(type);
    }
}
//关闭控制面板
function closeSearchPanel(panelID,type){
    $(panelID).hide();
    if(type=='mapinfo'){
        clearBaiduMarkerAry();
        removeBaiduRetOverlay();
    }
}

/*//初始化拉框查找表格
function initAreaQueryTable(){
    $("#areaQueryTable").jqGrid({
        colModel:[    {name:'name', label:'名称',width:120,index:'2',align:'center',sortable:false},
            {name:'address', label:'地址',width:250,index:'4',align:'center',sortable:false},
            {name:'phoneNumber', label:'联系电话',width:100,index:'5',align:'center',sortable:false}
        ],
        data:[],
        datatype:'local',
        shrinkToFit:false,
        pager:"#areaQueryPager",
        recordpos:'left',
        rownumbers:true,//添加左侧行号
        scroll:10,
        autoScroll: true,
        viewrecords:true,
        width:"100%",
        height:200,
        onSelectRow:  function(rowid,stat)
        {
            var jsonData = $("#areaQueryTable").getRowData(rowid);
            showInMap(5,jsonData.index);
        }
    });
}*/
//查找相关信息回调
function queryAreaInfoCallBack(data){
    $("#loading").hide();
    $("#areaQueryPanel").show();
    $("#areaQueryTable").clearGridData();
    smartSearchResult[5] = data;
    for(var i=0;i<data.length;i++){
        $("#areaQueryTable").addRowData(i, data[i], "first");
    }
}

//测面、线工具0、为面1为线
function measure() {
    mapUtil.measure();
}

/**  拖拽控制 div 只能在某个div下区域显示 **/
function onDrag(e){
    var d = e.data;
    if (d.left < 0){d.left = 0}
    if (d.top < 0){d.top = 0}
    if (d.left + $(d.target).outerWidth() > $(d.parent).width()){
        d.left = $(d.parent).width() - $(d.target).outerWidth();
    }
    if (d.top + $(d.target).outerHeight() > $(d.parent).height()){
        d.top = $(d.parent).height() - $(d.target).outerHeight();
    }
}


/** 接口方法 ***/
function setMapCenter(lon,lat,level){
    if(mapType==0){
        setBaiduMapCenter(lon,lat,level);
    }else{
        setSmartEarthCenter(lon,lat,level);
    }
}

function getCarImage(obj){
    var head = getHead(obj.Head)?getHead(obj.Head):"1";
    var imgSrc = basePath + "/img/car/";
    return imgSrc+"car"+head+".gif";
}


//显示图片
function getVehicleHisImg(imgList){
    imgTarget=[];
    $("#imgShowDiv").html("");//清空大图
    $("#thumbs").find("li[ref='thumbImg']").remove();//清空略缩图
    var data  = imgList;
    var isNotAddMarker = true;

    for(var i=0;i<data.length;i++){
        imgTarget.push(i);
        var imgDiv = "<div id='image_"+i+"' class=image>"
            + "<a href='javascript:void(0)'>"
            + "<img    src='"+data[i].imgUrl+"' width=772 height=415></a>"
            + "<div class='word' style='margin-top: -10px;'>GPS时间:"+data[i].gpsTime+" 摄像头编号:"+data[i].cameraNo+"</div>"
            + "</div>";
        $("#imgShowDiv").append(imgDiv);//添加大图

        var thumbsLi = "<li ref='thumbImg' class='slideshowitem'>"
            +"<a id='thumb_"+i+"' href='#'><img src='"+data[i].imgUrl+"' width=90 height=60></a>"
            +" </li>	"
        $("#thumbs li:last").before(thumbsLi);//添加略缩图
        var imgUrl ="img/hisImg.png";
        if(ck_imgInputChecked && isNotAddMarker){
            isNotAddMarker = false;
            var  iconUrl = basePath + imgUrl;
            mapUtil.addImgMarker(iconUrl,data[i].lng, data[i].lat);
        }
    }
    if(data.length > 0){
        $("#thumbUl").css("width",data.length * 104);
    }
    var tmpHashMap = new HashMap();
    for(var i = 0; i < data.length; i++){
        var tmpArray = [];
        tmpArray.push(i+1);
        tmpArray.push(data[i].vehicleId);
        tmpArray.push(data[i].name);
        tmpArray.push(data[i].noColor);
        tmpArray.push(data[i].gpsTime);
        tmpArray.push(data[i].lng);
        tmpArray.push(data[i].lat);
        tmpArray.push('<a href="javascript:;" onclick="showImg(\'' + i + '\')" style="color:blue;">' + data[i].imgUrl + '</a>');
        tmpHashMap.put(i,{id:i,data:tmpArray});
    }
    if(tmpHashMap.size() > 0){
        $.addGridData('imagesTable2',tmpHashMap);
    }
    tmpHashMap=null;
    imgSlide();//播放图片
}

/** 点击图片列表 **/
function showImg(idx){
    index = parseInt(idx);
    /** 选中图片 **/
    rechange(idx);
    slideImage(idx);
    /** 显示头部 **/
    if($("#importNav2").css("display") =="none"){
        $("#importNav2").slideDown();
        $("#importNav3").toggleClass("importNav");
    }
    $("#commandImg").show();
}


/**显示历史报警**/
var almDatas;
function getVehicleHisAlarm(alarmList){
    almDatas = alarmList.listAlarmInfosZip;
    if(ck_alarmInputChecked){
        var data = null;
        for(var i=0;i<almDatas.length;i++){
            var iconUrl = basePath +"img/hisAlarm.png";
            data = almDatas[i];
            mapUtil.addAlarmMarker(i,iconUrl,data[0].correctedLng, data[0].correctedLat);
        }
    }

    hisAlarmDataList=alarmList.listAlarmInfos;
    var tmpHashMap = new HashMap();
    for(var i = 0; i < hisAlarmDataList.length; i++){
        var tmpArray = [];
        tmpArray.push(i+1);
        tmpArray.push(hisAlarmDataList[i].alarmTime);
        tmpArray.push(hisAlarmDataList[i].alarmType);
        tmpArray.push(hisAlarmDataList[i].sourceID);
        tmpArray.push(hisAlarmDataList[i].longitude);
        tmpArray.push(hisAlarmDataList[i].latitude);
        tmpArray.push("");
        tmpArray.push(hisAlarmDataList[i].height);
        tmpArray.push(hisAlarmDataList[i].gpsSpeed);
        tmpArray.push(hisAlarmDataList[i].pulseSpeed);
        tmpArray.push(hisAlarmDataList[i].gpsMileage);
        tmpArray.push(hisAlarmDataList[i].pulseMileage);
        tmpArray.push(hisAlarmDataList[i].alarmCount);
        tmpArray.push(hisAlarmDataList[i].gdLng);
        tmpArray.push(hisAlarmDataList[i].gdLat);
        tmpHashMap.put(i,{id:i,data:tmpArray});
    }
    if(tmpHashMap.size() > 0){
        $.addGridData('alarmTable2',tmpHashMap);
    }
    tmpHashMap=null;
}

function createTrackInfoWindow(obCar) {
//	alert(obCar.gs);
    var div = '<div style="border-top:1px solid black;"><table width="370" border="0" cellspacing="0" cellpadding="0"><tr bgcolor="#e6eaea">';
    div +=  '<tr><td colspan="3" height="20">报警状态：'+obCar.alarmState+'</td></tr>';
    //过检方向用：getHeadDes(obCar.hd)   正式用：getHeadDesZS(obCar.hd)
    div +=  '<tr bgcolor="#e6eaea"><td width="130" height="18"  >高度：' + (obCar.height!=""?obCar.height:'0') + 'm</td><td width="110">方向：' + getHeadDesZS(obCar.head) + '</td><td width="110"></td></tr>';
    div += '<tr bgcolor="#e6eaea"><td width="130" height="18">经度：' + obCar.longitude.toFixed(6)+ '</td><td width="130" >纬度：' + obCar.latitude.toFixed(6) + '</td><td width="110" height="18">速度：' + obCar.gpsSpeed + 'km/h</td></tr>' ;
    div +=  '<tr><td height="18" colspan="3"> <table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td>所属业户：' + obCar.workUnitName + '</td></tr> </table></td></tr>' ;
    //过检开放-电子运单
    //+ '<tr bgcolor="#e6eaea"><td width="105" height="18" colspan="3" >电子运单：' + obCar.bill+ '</td></tr>'
    div +=  '<tr><td  colspan="3" ><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td class="infoWindow"><a href="javascript:void(0)" onclick=getDriverInfoById("' + obCar.id + '","' + obCar.did + '")>查看司机信息</a></td><td class="infoWindow"><a href="javascript:void(0)" onclick=doReverse("' + obCar.longitude + '","' + obCar.latitude + '","' + obCar.id + '")>显示位置</a></td><td>定位时间:' + obCar.gpsTime + '</td></tr></table></td></tr>';
    div +=  '<tr bgcolor="#e6eaea"><td colspan="3"  height="40" id="message' + obCar.id +'">&nbsp;</td></tr></table></div>';
    return div;
}

function doReverse(longitude,latitude,id) {
    $("#message" + id).html('正在加载数据......');
    getAddressNew(false,0,0,longitude,latitude,'#message' + id);
}

//显示轨迹点
function getVehicleTrackPoint(obCar) {
    var iconUrl = basePath +"img/car/";
    if(obCar.alarmState.length > 0&&obCar.alarmState!="当前没有报警"){
        iconUrl += 'point3.gif';
    }else{
        iconUrl += 'point1.gif';
    }
    mapUtil.addTrackPointMarker(0,iconUrl,obCar);
}

//创建弹出窗口布局
function createAlarmInfoWindow(alarmInfo,order) {
    var len = alarmInfo.length;
    var div = '';
    if(len > 5){
        div = '<div id="openAlarmWindowId'+order+'" class="alarmInfoWindowDiv" style="height:150px;">';
    }else{
        div = '<div id="openAlarmWindowId'+order+'" class="alarmInfoWindowDiv">';
    }
    div += '<table>'
        + '<tr><td width="150">开始时间</td><td width="200">报警类型</td><td width="80">报警来源</td><td width="80">报警次数</td></tr></table><table>';
    var data = null;
    for(var i=0;i<len;i++){
        data = alarmInfo[i];
        div += '<tr><td width="150">';
        div += data.alarmTime + '</td><td width="200">';
        div +=(data.alarmType!="null"?data.alarmType:"") + '</td><td width="80">';
        div += (data.sourceID!="undefined"?data.sourceID:"") + '</td><td width="80">';
        div += data.alarmCount + '</td></tr>';
    }
    div += '</table></div>';

    return div;
}

//日期时间差 需封装公用
function dateDiff(strDateBegin,strDateEnd)
{
    var date1=Date.parse(new Date(strDateBegin.replace(/-/g, "/")));  //开始时间
    var date2=Date.parse(new Date(strDateEnd.replace(/-/g, "/")));    //结束时间
    var date3=date2-date1;  //时间差的毫秒数

    //计算出相差天数
    var days=Math.floor(date3/(24*3600*1000));
    //计算出小时数
    var leave1=date3%(24*3600*1000);    //计算天数后剩余的毫秒数
    var hours=Math.floor(leave1/(3600*1000));
    //计算相差分钟数
    var leave2=leave1%(3600*1000);        //计算小时数后剩余的毫秒数
    var minutes=Math.floor(leave2/(60*1000));
    //计算相差秒数
    var leave3=leave2%(60*1000);      //计算分钟数后剩余的毫秒数
    var seconds=Math.round(leave3/1000);
    var strD = days>0?days+"天":"";
    var strH = hours>0?hours+"小时":"";
    var strm = minutes>0?minutes+"分钟":"";
    var strs = seconds>0?seconds+"秒":"";
    return strD+strH+strm+strs;
}



dashOption = {
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
            center : ['52%', '50%'],    // 默认全局居中
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
            center : ['20%', '55%'],    // 默认全局居中
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
                offsetCenter: [0, '-30%'],       // x, y，单位px
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
            center : ['82%', '50%'],    // 默认全局居中
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
                splitNumber:5,
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
            data:[{value: 0, name: '油位'}]
        }
    ]
};

var echarts;

function loaDashboardChart()
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
            dashboardChart = echarts.init(document.getElementById('dashboard'));
            dashboardChart.setOption(dashOption,true);

        }
    );
}

function checkNullData(data){
    var result = null;
    if(!(data == undefined || '' == data)){
        result = data;
    }
    return result;
}

function resetDashboardChart(){
    try{
        dashOption.series[0].data[0].value =  0;
        dashOption.series[2].data[0].value =  0;
        dashboardChart.setOption(dashOption,true);
        $('#dashboardPanelVrn').html('');
        $('#dashboardPanelTime').html('');
    }catch(ex){
        console.error(ex);
    }
}

function updateDashboardChart(data){
    try{
        var speed = data.speed;
        if(null == checkNullData(speed)){
            speed = data.speed;
            if(null == checkNullData(speed)){
                speed = 0;
            }
        }
        var oil = data.oil;
        if(null == oil){
            oil = 0;
        }
        dashOption.series[0].data[0].value =  speed;
        dashOption.series[2].data[0].value =  oil;
       // dashboardChart.setOption(dashOption,true);
        $('#dashboardPanelVrn').html(data.vehicleNo);
        $('#dashboardPanelTime').html(data.time);
    }catch(ex){
        console.error(ex);
    }
}

//---------------速度与油位仪表盘-------------------

//订阅列表中,取中文地址
function getAddress(longitude,latitude,gridboxId,rowIndex,colIndex,isStartWithCountry,isAppend) {
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
                if (distname!=""){
                    distname=","+distname;
                }
                str = getDirection(lat2,lng2,lat1,lng1,dist);
                if (str!=""){
                    str=","+str;
                }
            }
            var adc = result.detail.addressComponents;
            var address = adc.city+adc.district+adc.town+adc.village+adc.street+adc.streetNumber+distname+str;
            if(isStartWithCountry){
                address = adc.country + adc.province + address;
            }
            if(isAppend){
                var tmpStr = address.replace(/\s/g,'');
                if(tmpStr.length > 0){
//					$(addressid).append(';' + address);
//					$(addressid).parent().attr('title',$(addressid).html());

                    $.setGridCellValue(gridboxId,rowIndex,colIndex,address);

                }
            }else{
//				$(addressid).html(address);
//
//				$(addressid).parent().attr('title',$(addressid).html());

                $.setGridCellValue(gridboxId,rowIndex,colIndex,address);
            }
            setTimeout(queryAddress,100);
        }
    });

    //若未取得腾迅地址成功则取百度地址
    geocoder.setError(function() {
        var gc = new BMap.Geocoder();
        var pt= new BMap.Point(latitude,longitude);
        gc.getLocation(pt, function(rs){
            var addComp = rs.addressComponents;
            var address = addComp.city + " " + addComp.district + " " + addComp.street + " " + addComp.streetNumber;
            if(isStartWithCountry){
                address = addComp.province + " " + address;
            }
            if(isAppend){
                var tmpStr = address.replace(/\s/g,'');
                if(tmpStr.length > 0){
//					$(addressid).append(';' + address);
//					$(addressid).parent().attr('title',$(addressid).html());
                    $.setGridCellValue(gridboxId,rowIndex,colIndex,address);
                }
            }else{
//				$(addressid).html(address);
//				$(addressid).parent().attr('title',$(addressid).html());
                $.setGridCellValue(gridboxId,rowIndex,colIndex,address);

            }
            setTimeout(queryAddress,100);
        });
    });

    qq.maps.convertor.translate(new qq.maps.LatLng(latitude,longitude), 1, function(res){
        try{
            geocoder.getAddress(res[0]);
        }catch(e){
            setTimeout(queryAddress,100);
        }
    });
}

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

function formatterIsHistory(isHistory){
    var result = '否';
    if(isHistory){
        result = '是';
    }
    return result;
}

var jqgridAddressObject = {'trackTable13Lng':'longitude','trackTable13Lat':'latitude','runTrackTable13Lng':'startLng','runTrackTable13Lat':'startLat','runTrackTable15Lng':'stopLng','runTrackTable15Lat':'stopLat','alarmTable6Lng':'longitude','alarmTable6Lat':'latitude'};
function formatterAddress(cellvalue,options,rowdata){
    var addressid = options.gid + '_' + 'a_' + options.rowId + '_' + options.pos;
    var lng = jqgridAddressObject[options.gid + options.pos + 'Lng'];
    var lat = jqgridAddressObject[options.gid + options.pos + 'Lat'];
    var obj = {lng:rowdata[lng],lat:rowdata[lat],cellId:'#' + addressid,type:1};
    queryAddressList.push(obj);
    return '<span id="' + addressid + '">正在获取地址....</span>';
}

function formatterWaypointsAddress(cellvalue,options,rowdata){
    var result = '';
    var points = rowdata.waypoints;
    if(points.length > 0){
        var addressid = options.gid + '_' + 'a_' + options.rowId + '_' + options.pos;
        var latLng = points[0].split(",");
        var obj = {lng:latLng[1],lat:latLng[0],cellId:'#' + addressid,type:2};
        queryAddressList.push(obj);
        for(var i=1;i<points.length;i++){
            latLng = points[i].split(",");
            obj = {lng:latLng[1],lat:latLng[0],cellId:'#' + addressid,type:3};
            queryAddressList.push(obj);
        }
        return '<span id="' + addressid + '">正在获取地址....</span>';
    }
    return result;
}

function queryAddress(){
    if(isQuery || currentIndex < queryAddressList.length){
        if(currentQueryAddressIndex < queryAddressList.length){
            var obj = queryAddressList[currentQueryAddressIndex];
            currentQueryAddressIndex ++;
            if(obj.type == 1){
                getAddress(obj.lng,obj.lat, obj.cellId,true,false);
            }else if(obj.type == 2){
                getAddress(obj.lng,obj.lat, obj.cellId,false,false);
            }else{
                getAddress(obj.lng,obj.lat, obj.cellId,false,true);
            }
        }else{
            setTimeout(queryAddress,100);
        }
    }else{
        queryAddressList = [];
        currentQueryAddressIndex = 0;
    }
}

/*--------------------导出Excel----------------------*/
function getCurrentCheckedTable(){
    var result = null;
    $("#ctrlPanelUl li").each(function(i,n){
        if($(n).hasClass('now')){
            result = $(n).attr("panelId");
        }
    });
    return result
}

function formatSpanField(data){
    var result = '';
    var s,e = null;
    s = data.indexOf(">");
    e = data.lastIndexOf("<");
    if(s > 0){
        result = data.substring(s+1,e);
        result = result.replace(/\s/g,'');
    }
    return result;
}
var loading = true;
function exportExcel(){
    if(loading){
        alert('该表不支持导出!');
        return;
    }
    var divId = getCurrentCheckedTable();
    if(divId != null){
        var tableObj = {'trackPanelDiv':{id:'gridbox',name:'track',field:{'name':'车牌号','noColor':'车牌颜色','workUnitName':'机构名称','latitude':'纬度','longitude':'经度','oil':'油位','gpsSpeed':'GPS速度(km/h)','head':'方向','gpsMileage':'里程(KM)','gpsTime':'时间','locationInfo':'位置','isHistory':'补偿数据'},sField:['locationInfo']},
            'stopCarLiDiv':{id:'stopTrackTable2',name:'stopCar',field:{'name':'车牌号','noColor':'车牌颜色','startTime':'停车开始时间','endTime':'停车结束时间','timeSpan':'停车时长','mileage':'里程(KM)','location':'位置'},sField:[]},
            'areaCarDiv':{id:'areaCarTable',name:'areaCar',field:{'name':'车牌号','noColor':'区域名称'},sField:[]},
            'deadZoneCarDiv':{id:'blindAreaTable2',name:'blindArea',field:{'startTime':'开始时间','endTime':'结束时间','timeSpan':'盲时时长','longitude':'盲时经度','latitude':'盲时纬度','location':'位置'},sField:[]},
            'drivingCarDiv':{id:'runTrackTable2',name:'drivingCar',field:{'startDate':'启动时间','stopDate':'停止时间','startMileage':'开车里程数(km)','stopMileage':'停车里程数(km)','sumMileage':'累计里程数(km)','driveTime':'行驶时长','driveMileage':'行驶里程数(km)','changeOil':'油位变化','startLng':'启动经度','startLat':'启动纬度','stopLng':'停止经度','stopLat':'停止纬度','startLocation':'启动地点','waypoints':'途经地点','stopLocation':'停止地点'},sField:['startLocation','waypoints','stopLocation']},
            'alarmDiv':{id:'alarmTable2',name:'alarm',field:{'alarmTime':'报警时间','alarmType':'报警类型','sourceID':'报警来源','longitude':'经度','latitude':'纬度','location':'位置','height':'海拔(米)','gpsSpeed':'GPS速度(km/h)','pulseSpeed':'电子速度 (km/h)','gpsMileage':'GPS里程','pulseMileage':'脉冲里程','alarmCount':'报警次数'},sField:['location']},
            'imagesDiv':{id:'imagesTable2',name:'images',field:{'vehicleId':'车辆序号','name':'车牌号码','noColor':'车牌颜色','gpsTime':'定位时间','lng':'经度','lat':'纬度','imgUrl':'图片路径'},sField:[]}};
        var tableInfo = tableObj[divId];
        if(tableInfo == undefined){
            alert('该表不支持导出!');
        }else{
            var obj =$.getGridDatas(tableInfo.id);
            if(obj.length > 0){
                exportExc(basePath +'/secure/gis/exportTrackTables.html?time='+ new Date(), {titles:$.getGridTitles(tableInfo.id),data:$.getGridDatas(tableInfo.id),name:tableInfo.name});
            }else{
                alert('没有数据!');
            }
        }
    }else{
        alert('未知表ID!');
    }
}
/*--------------------导出Excel----------------------*/

/*--------------------初始化查询时间--------------------*/
function initQueryTime(){
    var end = new Date();
    var sEnd = end.format("yyyy-MM-dd hh:mm:ss");
    var begin = addHours(end,-8);
    var sBegin = begin.format("yyyy-MM-dd hh:mm:ss");
    $('#txtEndTime').datetimebox({
        disabled:false,
        value: sEnd,
        required: true
    });
    $('#txtStartTime').datetimebox({
        disabled:false,
        value: sBegin,
        required: true
    });
}
/*--------------------初始化查询时间--------------------*/

function clearLines(){
    stopTrack();
    clearData();
}

function getLinePointData(){
    var result = {sl:'',data:'',el:''};
    var lastIndex=$.getLastIndex('gridbox');
    if(lastIndex > 1){
        var row = null;
        result.sl = $.getCellValue('gridbox',0,13);
        result.el =$.getCellValue('gridbox',lastIndex,13);
        var data = '';
        for(var i=0;i<lastIndex;i++){
            var gpsSpeed = parseInt($.getCellValue('gridbox',i,7)) ;//gps速度
            var eSpeed = parseInt($.getCellValue('gridbox',i,8)) ;//电子速度
            if(i == 0 || gpsSpeed > 5 || eSpeed > 5){
                data += $.getCellValue('gridbox',i,5) + '#' + $.getCellValue('gridbox',i,4)  + '&';
            }
        }
        data += $.getCellValue('gridbox',lastIndex,5)+ '#' +$.getCellValue('gridbox',lastIndex,4);
        result.data = data;
    }
    return result;
}

function bindTrackButtonClickFunction(type,status){
    if('play' == type){
        if(trackButtonStatus[type] != status){
            trackButtonStatus[type] = status;
            if(status){
                $("#playTrack").bind("click", playTrack);// 播放
            }else{
                $("#playTrack").unbind("click", playTrack);// 禁止再次点击
            }
        }
    }else if('pause' == type){
        if(trackButtonStatus[type] != status){
            trackButtonStatus[type] = status;
            if(status){
                $("#pauseTrack").bind("click", pauseTrack);//禁用停止
            }else{
                $("#pauseTrack").unbind("click", pauseTrack);//禁用暂停
            }
        }
    }else if('stop' == type){
        if(trackButtonStatus[type] != status){
            trackButtonStatus[type] = status;
            if(status){
                $("#stopTrack").bind("click", stopTrack);//停止
            }else{
                $("#stopTrack").unbind("click", stopTrack);//禁用停止
            }
        }
    }
}

function getDriverInfoById(id,driverId) {
    var tdId = 'message' + id;
    if(driverId != undefined && driverId != null && driverId.length > 0){
        $.ajax({
            type: 'POST',
            url: basePath+'secure/gis/getDriverInfoById.html?time='+ new Date(),
            data: {driverId:driverId},
            dataType : "JSON",
            success: function(data){

                if (data.code == "0") {
                    var driverInfo = data.data;
                    if (driverInfo != '' && driverInfo != 'null' && driverInfo != null) {
                        driverInfo = strToJson(driverInfo);
                        var name = driverInfo.name;//司机姓名
                        var driverIC = driverInfo.icNo;//司机IC卡号
                        var drivingLicence = driverInfo.id;//身份证号码
                        var organization = driverInfo.o;//发证机构名称
                        var workCertificate = driverInfo.wc;//从业资格证号
                        var message="姓名:"+(!name?"":name);
                        if(drivingLicence!=''){
                            message+="&nbsp;身份证号码:"+(!drivingLicence?"":drivingLicence);
                        }

                        if(driverIC!=''){
                            message+="&nbsp;IC卡号:"+(!driverIC?"":driverIC);
                        }

                        if(organization!=''){
                            message+="&nbsp;发证机构名称:"+(!organization?"":organization);
                        }

                        if(workCertificate!=''){
                            message+="&nbsp;从业资格证号:"+(!workCertificate?"":workCertificate);
                        }

                        $("#" + tdId).html(message);
                    }else{
                        $("#" + tdId).html("当前没有司机信息");
                    }
                }
            }
        });
    }else{
        $("#" + tdId).html("当前没有司机信息");
    }

}

/** 地图缩放 **/
function bMapScaling(type){
    mapUtil.zoom(type);
}


//把从数据库查询数据改成从接入平台上获取查询数据
function searchDatas(){
    var vehicle = $('#txtVehicleId').val();
    var startTime = $('#txtStartTime').datetimebox("getValue");
    var endTime = $('#txtEndTime').datetimebox("getValue");

    //startTime = startTime.replace(/-/g,"/");
    //endTime = endTime.replace(/-/g,"/");

    var timeSel = $('#timeSel').val();
    if(timeSel==-1){
        timeSel=10;
    }

    if(ws ==null){
        initTrackWs();
    }
    isQuery = true;
    //queryAddress();
    var startTime_d=null;
    var endTime_d=null;
    var i=0;

    var endTime_t= new Date(endTime).getTime();//将字符串转化为时间
    /*alert(endTime);
     alert("endTime_t="+new Date(endTime));
     return;*/
    var startTime_t=new Date(startTime).getTime();//将字符串转化为时间


    /*startTime=startTime.format("yyyy-MM-dd hh:mm:ss");
    endTime=endTime.format("yyyy-MM-dd hh:mm:ss");*/



    //在选定时间段内，从开始时间起，间隔一小时发送一次报文，最后一次不到一小时发送一次报文
    /*while((startTime_t+1000*60*60)<endTime_t){
     startTime_d=new Date(startTime_t);
     startTime_d=startTime_d.format("yyyy-MM-dd hh:mm:ss");
     endTime_d=new Date(startTime_t+1000*60*60);
     endTime_d=endTime_d.format("yyyy-MM-dd hh:mm:ss");
     trackArgs = {VehicleID:vehicle,StartTime:startTime_d,EndTime:endTime_d,Interval:timeSel};
     var param = new Object();
     param.Command = 22;
     param.Sequence = i;
     param.UserID = userId;
     param.Body = trackArgs;
     ws.send(JSON.stringify(param));
     i++;
     startTime_t=startTime_t+1000*60*60;
     }*/
    //startTime=startTime.format("yyyy-MM-dd hh:mm:ss");
    //endTime=endTime.format("yyyy-MM-dd hh:mm:ss");
    /*trackArgs = {VehicleID:vehicle,StartTime:startTime,EndTime:endTime,Interval:timeSel};
    var param = new Object();
    param.Command = 22;
    param.Sequence = i;
    param.UserID = userId;
    param.Body = trackArgs;
    ws.send(JSON.stringify(param));*/

    var msg = new MsgBody();


    msg.Vehicle=vehicle;
    msg.BeginTime = startTime;
    msg.EndTime=endTime;

    ws.send(JSON.stringify(msg));
}
//建立webSocket连接
function initTrackWs() {
    var url = "";

    if ('WebSocket' in window) {
        url = webSocketUrl + "/trackback";
        ws = new ReconnectingWebSocket(url);
    } else {
        url = webSocketUrlSockJS + "/sockjs/trackback";
        ws = new SockJS(url);
    }

    ws.onopen = function(event) {
    };

    ws.onmessage = function(event) {
        /*if(!isQuery){
            return ;//如果取消了查询，则后面来的数据都扔掉
        }*/
        receiveMsg(event.data);
    };

    ws.onclose = function(event) {
        // console.log("服务器连接失败，正在重连...");
    };

}

var trackResult; // 查询轨迹返回的结果集
//接收从接入平台获取的数据并进行处理
function receiveMsg(_data) {
    debugger;
    _data = JSON.parse(_data);

        var listTrackInfos=_data[0].location_back;
        if(listTrackInfos&&listTrackInfos!=null&&listTrackInfos.length>0){
            trackResult=listTrackInfos;
            if(listTrackInfos.length>0){
                firstTrack = listTrackInfos[0];
            }
            loadTrackData(listTrackInfos,_data[0].vehicleNo,_data[0].vehicleId);

            isQuery = false;
            $("#txtSearch").bind("click", findPlayBackTrack);// 绑定查询
            if(trackPointList.length>0){
                $("#playControlBox").show();
                $("#queryControlBox").hide();
                bindTrackButtonClickFunction('play',true);
                addStartMarker(trackPointList[0]);//添加开始点
                addEndMarker(trackPointList[trackPointList.length-1]);// 添加结束点
            }
            $("#showQueryPanel").show();
            $("#queryPanel").hide();
            isShowDashboardChart = true;
            flag1=true;
        }else{
            $("#queryControlBox").hide();
            $("#dashboardPanel").hide();
            isShowDashboardChart = false;
            $("#txtSearch").bind("click", findPlayBackTrack);// 绑定查询
            alert("该时间段无轨迹数据!");
        }

    loading = false;
}


