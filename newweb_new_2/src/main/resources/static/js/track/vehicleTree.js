var  wh;
var carTree ;

var workUnitMap = new HashMap();//用于存储企业的key值 元素的tid
var vehicleTreeMap = new HashMap();//用于存储车辆ID 元素的tid   树
var vehicleListMap = new HashMap();//用于存储车辆ID 元素的tid  列表
var vehicleCheckMap = new HashMap();//用于列表中的复选框
//var subscribeMap = new HashMap();//订阅车辆ID
var subscribeCount = 500;//最大订阅数
var isCheckedAll = false;
var GridDataCache = null;
var SubVehicleData = null;
var vehicleDataType = -1; // 当前数据类型 1 所有车， 2 在线车
var currentShowType = 1; // 当前显示类型 1 所有车， 2 在线车

$(function() {
	try {
		PageResize();
		window.onresize = PageResize; 
		initTreeAllList();
		initSeachTable();
 
		$("#carTreeList").bind("scroll", function(){ //车辆树滚动后，将操作菜单隐藏
			parent.hideOperateMenuPanel();//调用父窗口关闭
		});
		$(".bDiv").bind("scroll", function(){ //车辆列表滚动后，将操作菜单隐藏
			parent.hideOperateMenuPanel();//调用父窗口关闭
		});
		
		$("#vehicleCountDiv").bind("click", function(){ //显示所有车辆数
			currentShowType = 1;
			parent.unSubscribe(-1);
			$("#loadingDiv").show();
			workUnitMap.clear();
			initTreeAllList();
		});
		
		
		$("#vehicleOnLineCountDiv").bind("click", function(){ //只显示在线数
			currentShowType = 2;
			parent.unSubscribe(-1);
			$("#loadingDiv").show();
			workUnitMap.clear();
			initTreeOnlineList();
		});
		
		
		$("#vehicleLi").bind("click", function(){ //切换至 车辆树
			parent.hideOperateMenuPanel();//调用父窗口关闭
			$("#seachLi").removeClass("now");
			$(this).addClass("now");
			$("#ck_treeAll").show();
			$("#vehicleSeachList").hide();
			$("#vehicleTreeList").show(); 
		});
		
		$("#seachLi").bind("click", function(){ //切换至 车辆列表
			parent.hideOperateMenuPanel();//调用父窗口关闭
			$("#vehicleLi").removeClass("now");
			$(this).addClass("now");
			$("#ck_treeAll").hide();
			$("#vehicleTreeList").hide();
			$("#vehicleSeachList").show(); 
		});
		 
		 $("#commandSpan").bind("click", function(){ //是否打开控制面板
			var vids ="1,2,3";
			parent.showBatchVehicleCommand(vids);
		});
		 
		$(".flexigrid div.pDiv div.pDiv2").width(210);//宽度
		$(".pReload").parent().hide();//隐藏 车列列表中的 图片加载
		webSocketConnect();//webSocket连接 
	} catch (ex) {

	}
});

var _treeType = 1;
// 所有车辆缓存
var AllVehicleDataCache = null,autoSubscribed = false,AllVehicleIdsArray=[];
var BusinessVehicleDataCache = null,BusinessIdsArray=[];
//初始化所有车辆列表
function initTreeAllList(treeType){
	$("#ck_treeAll").removeAttr("checked");
	_treeType = treeType;
	if(!_treeType)
		_treeType = 1;
/*	if(AllVehicleDataCache != null&&!treeType){
		createTree(AllVehicleDataCache);
	}else{*/
		
		$.ajax({
			type : 'post',
			async : true,
			url : "/CreateTree",
			cache : false,
			dataType : "JSON",
			success : function (data) {
                debugger;
                vehicleTreeMap.clear();
                SubVehicleData = data;
                var setting = {
                    check: {
                        enable: true,
                        chkboxType:  { "Y" : "ps", "N" : "ps" }
                    },
                    data: {
                        key:{
                            name:"NAME"
                        },
                        simpleData: {
                            enable: true,
                            idKey: "ID",
                            pIdKey: "PID",
                            rootPId: 0
                        }
                    },callback: {
                        onClick: onTreeClick,
                        onCheck: onTreeCheck,
                        onExpand:onTreeExpand
                    }
                };
                //if(AllVehicleDataCache == null)
                AllVehicleDataCache = data;
                $("#carTreeList").html("");
                $.fn.zTree.init($("#carTreeList"), setting, []);//加载树
                $.fn.zTree.init($("#carTreeList"), setting, data);//加载树
                carTree = null;
                carTree = $.fn.zTree.getZTreeObj("carTreeList");//全局使用
                initWorkUnitOnlineCount();
                $("#loadingDiv").hide();
                if(!autoSubscribed && parent.MonitorConf.autoSubscribe){
                    $("#ck_treeAll").attr("checked","checked");
                    autoSubscribed = true;
                    onTreeAllCheck();
                }
				/*if(isCheckedAll && !($("#ck_treeAll").attr("checked") == "checked")){
				 $("#ck_treeAll").attr("checked","checked");
				 onTreeAllCheck();
				 }*/
            }
		});

}


//初始化所有在线车辆列表
function initTreeOnlineList(){
	isCheckedAll = $("#ck_treeAll").attr("checked") == "checked";
	$("#ck_treeAll").removeAttr("checked");
	vehicleTreeMap.clear();
	$.ajax({
		type : 'post',
		async : true,
		url : basePath+"secure/gis/getOnlineVehicleTree.html",
		cache : false,
		dataType : "JSON",
		success : function(data) {
			var setting = {
					check: {
						enable: true,
						chkboxType:  { "Y" : "p", "N" : "ps" }
					},
					data: {
						key:{
							name:"NAME"
						},
						simpleData: {
							enable: true,
							idKey: "ID",
							pIdKey: "PID",
							rootPId: 0
						}
					},callback: {
						onClick: onTreeClick,
						onCheck: onTreeCheck,
						onExpand:onTreeExpand
					}
				};
			$.fn.zTree.init($("#carTreeList"), setting, data);//加载树
			carTree = $.fn.zTree.getZTreeObj("carTreeList");//全局使用
			initWorkUnitOnlineCount();
			$("#loadingDiv").hide();
			SubVehicleData = data;
		}
	});
}


//树加载完成后 取第一级在线树
function initWorkUnitOnlineCount(){ 
	var treeNode = carTree.getNodesByParam("level", 0);//取第一级
	for(var i=0;i<treeNode.length;i++){
		if(treeNode[i].TYPE==1 && treeNode[i].VehicleQty>0){
			workUnitMap.put(treeNode[i].ID,treeNode[i].tId);
		}
	}
	var  param = new Object();
	param.Command = 5;
	param.Sequence = 5;
	//param.UserID =parent.window.userId.toString();
	//param.IDS= workUnitMap.keys().join(",");
	//sendWebSocketData($.toJSON(param));  //取车辆在线数量
}
  



function onTreeClick(event, treeId, treeNode, clickFlag) {
	debugger;
	if(treeNode.TYPE==2){
		//判断操作菜单 是否已经打开
		var obj = $("#"+treeNode.tId).find("a");
		var top  = $(obj).offset().top+20;
		var left = $(obj).offset().left+$(obj).width()+30;
		//调用mapControoler.js 中的 showOperateMenuPanel
		 var vehicleID = treeNode.ID.split("_")[0];
		 parent.showOperateMenuPanel(top,left,vehicleID,treeNode.NAME);
	}else{
		parent.hideOperateMenuPanel();
	}
}

function onTreeExpand(event, treeId, treeNode, clickFlag) {
	for(var i=0;i<treeNode.children.length;i++){
		var childrenNode = treeNode.children[i];
		/*if(childrenNode.TYPE==1){//企业
			if(!workUnitMap.containsKey(childrenNode.ID)){//判断是否已加入到的hashMap中
				workUnitMap.put(childrenNode.ID,childrenNode.tId);
			}			 
		}else{//车辆
			if(!vehicleTreeMap.containsKey(childrenNode.ID)){
				var key = childrenNode.ID.split("_")[0];
				vehicleTreeMap.put(key,childrenNode.tId);
			}	
		}*/
        if(!vehicleTreeMap.containsKey(childrenNode.ID)){
            var key = childrenNode.ID.split("_")[0];
            vehicleTreeMap.put(key,childrenNode.tId);
        }
    }
   //重新请求 在线数
	/*if(workUnitMap.size()>0){
		var param = new Object();
		param.Command ="5";
		param.Sequence = 5;
		param.UserID =parent.window.userId.toString();
		//param.IDS= workUnitMap.keys().join(",");
		sendWebSocketData($.toJSON(param));//发送企业在线数
	}*/
	if(vehicleTreeMap.size()>0){ 
		sendVehicleOnlineData();
	}
}	


/**
 * 发送车辆上下线状态请求
 */
function sendVehicleOnlineData(){
	var vehicleAry =[];
	vehicleAry.push.apply(vehicleAry,vehicleTreeMap.keys());// 合并
	vehicleAry.push.apply(vehicleAry,vehicleListMap.keys());// 合并
	var param = new Object();
	param.Command ="4";
	param.Sequence = "4";

	var body = {VehicleList:vehicleAry};
	param.Body = body;
	sendWebSocketData($.toJSON(param));//发送车辆在线数
}

/**
 * 发送车辆上下线通知的响应请求
 */
function sendResponse4OnlineMsg(){
	var param = new Object();
	param.Command ="27";
	param.Sequence = "27";
	param.UserID =parent.window.userId.toString();
	param.Body = {Status:0};
	sendWebSocketData($.toJSON(param));
}
 
var pSize=10;
//初始化搜索树
function initSeachTable(){
	
	$("#vehicleSeachTable").flexigrid({
		dataType : 'json',
		colModel : [ {
			display : 'ID',
			name : 'ID',
			width : 10,
			sortable : false,
			hide:true,
			align : 'center'
			},{
				display : 'device',
				name : 'device',
				width : 10,
				sortable : false,
				hide:true,
				align : 'center'
		   },
		   {
			display : '车牌号',
			name : 'Handler',
			width : 210,
			sortable : false,
			align : 'center',
			paramcolnames:["ID","RegistrationNO","device"],
			handlefunction:"formmatAction" 
		}],
		resizable : true,
		sortname : "ID",// 第一次加载数据时排序列
		sortorder : "desc",// 第一次加载数据时排序类型
		usepager : true,// 是否分页，默认为true。
		showToggleBtn : false,
		showTableToggleBtn : false,// 是否显示收起/打开按钮,默认不显示。
		//useRp : true,// 是否可以动态设置每页显示的结果数，默认为false。
		rp : pSize,// 每页记录数，默认为10
		//rpOptions: [1,100,300,500], //每页结果数
		checkbox : true,// 是否要多选框,默认为false。
		rowId : 'ID',// 多选框绑定行的id,只有checkbox : true时才有效。
		singleSelect : true,
		width : 220,// 表格宽度
		height : wh[3]-170, // 表格高度
		flag : false,
		onChangePage:function(newp){
			
			if(tempCache){
				var index=(newp-1)*pSize;
				var length=index+pSize;
				var vehicleNoCache = new Array();
				for(var i=index;i<length&&i<tempCache.length;i++){
						vehicleNoCache.push(tempCache[i]);		
				}
				var data={"rows":vehicleNoCache,"page":newp,"total":tempCache.length};
				$("#vehicleSeachTable").flexAddData(data);
			}else{
				$("#vehicleSeachTable").flexOptions({
					url: basePath+"secure/gis/queryVehicleListForSenior.html",
					newp : newp// 设置起始页
				// 设置查询参数
				}).flexReload();// 重新加载
			}
			
		},   
		onSuccess:function(data){
			if(!data)return;
			GridDataCache = data.rows;
			sendVehicleOnlineData();//加载完成后 重新取得在线数
			$("#vehicleSeachTable").find("input[type=checkbox]").each(function(){
				 $(this).attr("id","ck_"+$(this).val()).css({"margin-top":"11px"});
				 $(this).bind("click",function(){
					 onGridCheck("#ck_"+$(this).val());
				 });
			});
			var headCheckBox = $(".hDivBox table thead tr input");
			if(headCheckBox.attr("checked")=="checked"){
				headCheckBox.removeAttr("checked");
			}
			if(!headCheckBox.onclick){
				headCheckBox.bind("click",onGridCheckAll);
			}
		}
	});
}

function getSeachVids(){
	var vids   =  "";
	$("#vehicleSeachTable tr").each(function(){
		vids += $(this).children().eq(1).text()+",";   
	 });
	var vids = vids.substr(0,vids.length-1);
	return vids;
	 
}

function onGridCheckAll(event){
	if(GridDataCache && GridDataCache.length > 0){		
		var checkFlag = $(".hDivBox table thead tr input").attr("checked")=="checked";
		var tempSubscribeArray = [];
		for(var i = 0; i < GridDataCache.length; i++){
			var _id = GridDataCache[i].ID.toString();
			tempSubscribeArray.push(_id);
			var vehileNode = carTree.getNodesByParam("ID",_id+"_", null);
			if(checkFlag){
				carTree.checkNode(vehileNode.length > 0 ? vehileNode[0] : vehileNode, true, true);//同步到树
			}else{
				carTree.checkNode(vehileNode.length > 0 ? vehileNode[0] : vehileNode, false, true);//同步到树				
			}
		}
		if(tempSubscribeArray.length > 0){
			if(checkFlag){
				parent.subScribe(tempSubscribeArray);
			}else{
				parent.unSubscribe(tempSubscribeArray);
			}
		}
	}
}
 

function formmatAction(ID,RegistrationNO,device){
	vehicleListMap.put(ID,ID);
 	var colname = "<div vehicleID='"+ID+"' style='cursor:pointer;float:left;height:17px;width:180px;' onclick='showMenuPanel(this)'>"
 	colname +="<span style='float:left'><img id='vehicleImg_"+ID+"' src=\"resources/gis/images/unonline.gif\" />"+RegistrationNO+"</span>";
 	
 	if(device!=""){
 		var devList =  device.split(",");
 		for(var i=0;i<devList.length;i++){
 			if("1" == devList[i]){ //是否有拍照
 				colname +="<span class='cameraSpan' title='拍照' onclick='camera("+ID+")'></span>"
 			}
 			if("2" == devList[i]){ //是否有摄像头
 				colname +="<span class='videoSpan' title='视频监控'></span>"
 			}
 		}
 	}
 	colname +="</div>";
	return colname;
}

function camera(vehicleID){
	var url =basePath + "/secure/command/commandSend.html";
	openWindow(url+"?commandID=389&vehicleIDS="+vehicleID);
}
//打开新窗体
function openWindow(url){
	var openLink = $("#txtOpenWindow");
	openLink.attr('href', url);
	openLink[0].click();
}

//树 全选  反选


function onTreeAllCheck(){
	if(vehicleDataType != currentShowType){
		AllVehicleIdsArray=[];
		var count = 0;
		for(var i=0; i < SubVehicleData.length; i++){
				if (SubVehicleData[i].TYPE==2) {
					AllVehicleIdsArray.push(SubVehicleData[i].ID.replace("_",""));
					count++;
				}
				if (count==subscribeCount) {
					break;
				}
		}
		vehicleDataType = currentShowType;
	}
	if($("#ck_treeAll").attr('checked')==undefined){
		carTree.checkAllNodes(false);
		parent.unSubscribe(-1);
		$(".hDivBox table thead tr input").removeAttr("checked");
	}else{
		if( SubVehicleData.length>= subscribeCount) {
			window.parent.doAlert('您订阅车辆数超过了'+subscribeCount+',默认选取前'+subscribeCount+'条');
		}
		$(".hDivBox table thead tr input").attr("checked","checked");
		$("#vehicleSeachTable :checkbox").attr("checked","checked");
		for (index in AllVehicleIdsArray) {
			var checkedNode = carTree.getNodeByParam("ID",AllVehicleIdsArray[index]+"_",null);
			carTree.checkNode(checkedNode, true, true);
		}
		setTimeout(function(){
			var tempSubscribeArray = AllVehicleIdsArray;
			var offsetNum = tempSubscribeArray.length / 100;
			var hasFlag = tempSubscribeArray.length % 100;
			for(var i = 0; i <= offsetNum; i++){
				if(i == offsetNum && hasFlag == 0) break;
				var start = i * 100,end = (i == offsetNum) ? tempSubscribeArray.length : (i+1)*100;
				parent.subScribe(tempSubscribeArray.slice(start,end));			
			}
		},100);
		//AllVehicleIdsArray.length > 500 && console.log("车辆订阅上限为500辆，超出部分无法订阅！\r\n如需订阅更多，请取消部分已订阅车辆后，再订阅。");			
	} 
	
}

//表格全选  反选
function onTableAllCheck(){
	if($("#ck_tableAll").attr('checked')==undefined){
		$("#vehicleSeachTable :checkbox").removeAttr("checked");
	}else{
		$("#vehicleSeachTable :checkbox").attr("checked", true);  
	}
}

function showMenuPanel(obj){
	var top  = $(obj).offset().top-10;
	var left = $(obj).offset().left+$(obj).width();
	//调用mapControoler.js 中的 showOperateMenuPanel
	 var vehicleID =  $(obj).attr("vehicleID");
	 parent.showOperateMenuPanel(top,left,vehicleID,obj.innerText);
}

       
//勾选树
function onTreeCheck(e, treeId, treeNode) {
	debugger;
	if(treeNode.TYPE==1){//企业
		var vehicleList=[]; // 用于存放下线车辆ID
		var childrenNode =	carTree.transformToArray(treeNode);//取得所有下级
		for(var i=0;i<childrenNode.length;i++){
			if(childrenNode[i].TYPE==2){
				var vehicleID = childrenNode[i].ID.split("_")[0].toString();
				if(treeNode.checked){
					if (vehicleList.length == subscribeCount) {
						window.parent.doAlert('您订阅车辆数超过了'+subscribeCount+',默认选取前'+subscribeCount+'条');
						break;
					}
					//parent.subScribe(vehicleID);//订阅 
					$("#ck_"+vehicleID).attr("checked","checked");//同步到列表
					carTree.checkNode(childrenNode[i], true, true);
					
				}else{
					//parent.unSubscribe(vehicleID);
					$("#ck_"+vehicleID).removeAttr("checked");//同步到列表
					
				}
				vehicleList.push(vehicleID);
			}
			
			
		}
		if(vehicleList.length > 0){
			if(treeNode.checked){
				parent.subScribe(vehicleList);//订阅
			}else{
				parent.unSubscribe(vehicleList);
			}
		}
	}else{//车辆
		 var vehicleID = treeNode.ID.split("_")[0].toString();
		 if(treeNode.checked){
			var scribedCount = carTree.getNodesByFilter(filter).length;
			if (subscribeCount < scribedCount) {
				window.parent.doAlert('您订阅车辆数超过了'+subscribeCount+',默认选取前'+subscribeCount+'条');
				carTree.checkNode(treeNode, false, false);
				return;
			}
			 parent.subScribe(vehicleID);
			 $("#ck_"+vehicleID).attr("checked","checked");//同步到列表
		 }else{
			 parent.unSubscribe(vehicleID);
			 $("#ck_"+vehicleID).removeAttr("checked");//同步到列表
		 }
	} 

}

function filter(node) {
	return (node.TYPE==2 && node.checked == true);
}

function onGridCheck(gcid){
	var checked =$(gcid).attr("checked");
    var vehicleID = $(gcid).val().toString();
    var vehileNode = carTree.getNodesByParam("ID",vehicleID+"_", null);
	if(typeof(checked)!="undefined"){
		parent.subScribe(vehicleID); 
		carTree.checkNode(vehileNode, true, true);
		if(vehileNode!=null&& vehileNode.length>0){
			carTree.checkNode(vehileNode[0], true, true);
		}
	}else{
		parent.unSubscribe(vehicleID);
		if(vehileNode!=null&& vehileNode.length>0){
	    	carTree.checkNode(vehileNode[0], false, true);//同步到树
		}
	} 
	event.stopPropagation();    //  阻止事件冒泡
}


function checkTreeAndGrid(vehicleID){
	 var vehileNode = carTree.getNodesByParam("ID",vehicleID+"_", null);
	  if(vehileNode!=null){
			carTree.checkNode(vehileNode[0], true, true);
	  }
	$("#ck_"+vehicleID).attr("checked","checked");//同步到列表
}





//查询车辆信息
function queryVehicleForSenior(param){
	tempCache=null;
	vehicleListMap.clear();
	vehicleCheckMap.clear();
	//切换到搜索集
	parent.hideOperateMenuPanel();//调用父窗口关闭
	$("#seachLi").addClass("now").siblings().removeClass("now");
	$("#treeList").children("div").hide();
	$("#vehicleSeachList").show();
	$("#vehicleSeachTable").flexOptions({
		url: basePath+"secure/gis/queryVehicleListForSenior.html",
		newp : 1,// 设置起始页
		params : param,
		rp : pSize// 每页记录数，默认为10
	// 设置查询参数
	}).flexReload();// 重新加载
}
var tempCache = new Array();
//重组数据
function changeCache(param){
	
	tempCache=new Array();
	for(var i=0;i<AllVehicleDataCache.length;i++){
		if(AllVehicleDataCache[i].NAME.indexOf(param[0].value)>-1&&AllVehicleDataCache[i].TYPE=="2"){
			AllVehicleDataCache[i].RegistrationNO=AllVehicleDataCache[i].NAME;
			AllVehicleDataCache[i].ID=AllVehicleDataCache[i].ID.split("_")[0];
			tempCache.push(AllVehicleDataCache[i]);			
		}			
	}	
}

//取得用户车辆拥有的车辆数 
function getUserVehicleCount(){
	/*$.ajax({
		type : 'post',
		async : true,
		data:{},
		url : basePath+"secure/gis/getUserVehicleCount.html",
		cache : false,
		dataType : "JSON",
		success : function(data) {
			$("#vehicleCountDiv span").eq(0).text(data);
		}
	});*/
    $("#vehicleCountDiv span").eq(0).text(10)
}

//更新企业在线数
function updateWorkUnitOnline(data,data4Business,data4Charge){
	if(typeof(carTree)=="undefined")return;
	var _unitOnlineData = data;
	
	if(_treeType==2)
		_unitOnlineData = data4Business;
	else if(_treeType==3)
		_unitOnlineData = data4Charge;
	 for(var i=0;i<_unitOnlineData.length;i++){
		 if(_unitOnlineData[i].ID == "")
			 continue;
		 var key =  _unitOnlineData[i].ID;
		 var workUnitNode = carTree.getNodeByTId(workUnitMap.get(key));
		 if(workUnitNode == null || workUnitNode.TYPE != "1" || _unitOnlineData[i].Total == undefined || workUnitNode.NAME.match(/\(\d+/)[0].match(/\d+/)[0] == _unitOnlineData[i].Total) continue;
		 try{
			workUnitNode.NAME = workUnitNode.WorkUnitName+"("+_unitOnlineData[i].Total+"/"+workUnitNode.VehicleQty+")"; 
			carTree.updateNode(workUnitNode);//更新节点
		 }catch(ex){
			 continue;
		 }
	 }
}

var _total = 0,_onlineCount = 0;
/**
 * 更新车辆状态数量
 * @param OnlineTotal 在线车辆总数
 * @param Total 车辆总数
 */
function updateVehicleCount(OnlineTotal,Total){
	/*if(parent.viewType==1){
		_total = Total;
		_onlineCount = OnlineTotal;
	}else if(parent.viewType==2){
		_total = OperationTotal;
		_onlineCount = OnlineOperationTotal;
	}else if(parent.viewType==3){
		_total = ServiceTotal;
		_onlineCount = OnlineServiceTotal;
	}*/
	//更新左上角的车辆总数
	$("#vehicleCountDiv span").eq(0).text(Total);
	//更新左上角的在线车辆总数
	$("#vehicleOnLineCountDiv span").eq(0).text(OnlineTotal);
	//调用monitorController.js的方法更新车辆状态数
	//window.parent.updateNavCount(Total,OperationTotal,ServiceTotal,RunningOperationTotal,StopOperationTotal,ChargingoOperationTotal,RunningServiceTotal,StopServiceTotal);
}

//更新车辆在线图标
function updateVehicleOnline(data){
	try{
		var onVehicleAry = data.OnlineItems;//上线
		var offVehicleAry = data.OfflineItems;//下线
		 for(var i=0;i<onVehicleAry.length;i++){
			 var key =  onVehicleAry[i];
			 var vehileNode = carTree.getNodeByTId(vehicleTreeMap.get(key));//树
			 if(vehileNode!=null && vehileNode.TYPE == "2" && vehileNode.icon != undefined && vehileNode.icon.toLowerCase().indexOf("/unonline.gif") > 0){
				  vehileNode.icon = "../../img/online.gif";
				  carTree.updateNode(vehileNode);//更新节点
			 }
			 var vehicleOnGrid = $("#vehicleImg_"+key);
			 if(vehicleOnGrid != null && vehicleOnGrid.attr("src") != undefined && vehicleOnGrid.attr("src").toLowerCase().indexOf("/unonline.gif") > 0){
				vehicleOnGrid.attr("src","../../img/online.gif");//更新列表
			 }
		 }
		
		 for(var i=0;i<offVehicleAry.length;i++){
			 var key =  offVehicleAry[i];
			 var vehileNode = carTree.getNodeByTId(vehicleTreeMap.get(key));//树
			 if(vehileNode!=null && vehileNode.TYPE == "2" && vehileNode.icon != undefined && vehileNode.icon.toLowerCase().indexOf("/online.gif") > 0){
				  vehileNode.icon = "../../img/unonline.gif";
				  carTree.updateNode(vehileNode);//更新节点
			 }
			 var vehicleOnGrid = $("#vehicleImg_"+key);
			 if(vehicleOnGrid != null && vehicleOnGrid.attr("src") != undefined && vehicleOnGrid.attr("src").toLowerCase().indexOf("/online.gif") > 0){
				vehicleOnGrid.attr("src","../../img/unonline.gif");
			 }
		 }
		 
	}catch(ex){
		//console.error(ex);
	}
	 
}
 

/**
 * 通过WebSocket查询
 */
function sendWebSocketData(data){
	if(ws == null){
		webSocketConnect();
	} 
	 if (ws != null && ws.readyState ==1) {
		 if(typeof data == 'object')
			 data = JSON.stringify(data);
	     ws.send(data); //查询参数
	 } else {
		 
	 }
}  
var ws =null;
//webSocket连接
function webSocketConnect() {
	var url = "";
	if ('WebSocket' in window){
		url =webSocketUrl +"/online";
		ws = new WebSocket(url);
	} else{
		url = webSocketUrlSockJS +"/sockjs/online";
		ws = new SockJS(url);
	}
    ws.onopen = function () {
        if(ws!=null && ws.readyState == 1){
            var param = new Object();//取车辆总数 在线数
            param.Command = "5";
            param.Sequence = 5;
            //ws.send($.toJSON(param)); //取企业车辆总数
            ws.send(JSON.stringify(param));
        }
    };
    ws.onmessage = function (event) { //数据回传

    	if(event.data!=null){
    	 var obj = $.parseJSON(event.data);
    	 if(obj.RETURN_CODE==4) {
    			var onlineData = obj;
				//更新车辆上下线状态
				updateVehicleOnline(onlineData);
             //updateVehicleCount(obj.OnlineItems.length,obj.Total);
			}
            if(obj.RETURN_CODE==5) {

                updateVehicleCount(obj.ONLINECOUNT,obj.ALLCOUNT);
            }
    	/* if(obj.Command==23){
    		 if(obj.Body.Status==0){
    			 var chargePileItems = obj.Body.ChargePileItems;
    			 var ChargePileCount = chargePileItems.length;
    			 var ChargeGunCount = 0;
    			 var IdleGunCount = 0;
    			 $.each(chargePileItems,function(i,d){
    				 ChargeGunCount += d.GunTotal;
    				 IdleGunCount += d.IdleTotal;
    			 });
    			 //更新
    			 window.parent.updateChargePile(ChargePileCount,ChargeGunCount,IdleGunCount);
    		 }
    	 }else if(obj.Command==27){//收到车辆上下线消息
    		 var onlineData = obj.Body;
    		 //更新车辆上下线状态
    		 updateVehicleOnline(onlineData);
    		 //发送响应消息
    		 //sendResponse4OnlineMsg();
    	 }else if(obj.Command==32){//收到企业车辆在线总数通知
    		 var Data = obj.Body;
    		 //更新车辆树的车辆状态数量
    		 updateWorkUnitOnline(Data.OnlineTotalList,Data.OnlineOperationTotalList,Data.OnlineServiceTotalList);
    		 //更新车辆总数
    		 updateVehicleCount(Data.OnlineTotal,Data.Total,
    				 			Data.OperationTotal,Data.OnlineOperationTotal,
    				 			Data.ServiceTotal,Data.OnlineServiceTotal,
    				 			Data.RunningOperationTotal,Data.StopOperationTotal,Data.ChargingoOperationTotal,
    				 			Data.RunningServiceTotal,Data.StopServiceTotal);
    	 }   */


    	}
    };
    ws.onclose = function (event) {
    	//console.log("连接失败");
    };
}
//关闭连接
function disconnect() {
    if (ws != null) {
        ws.close();
        ws = null;
    }
}


//初始页面大小
function PageResize() {
	try {
		wh = getPageSize();
		$("#treeList").height(wh[3]);
		
		var panelHeight = wh[3] -  $("#infoPanelUl").height();
		$("#vehicleTreeList").height(panelHeight);
		$("#carTreeList").height(panelHeight-60);
		$("#vehicleSeachList").height(panelHeight);
		$(".bDiv").height(panelHeight-118);
        //$("#vehicleSeachList").children("div").height(panelHeight);
		$("#loadingDiv").height(panelHeight);
	} catch (ex) {
	}
};

//获取页面的高度、宽度
function getPageSize() {
    var xScroll, yScroll;
    if (window.innerHeight && window.scrollMaxY) {
        xScroll = window.innerWidth + window.scrollMaxX;
        yScroll = window.innerHeight + window.scrollMaxY;
    } else {
        if (document.body.scrollHeight > document.body.offsetHeight) { // all but Explorer Mac    
            xScroll = document.body.scrollWidth;
            yScroll = document.body.scrollHeight;
        } else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari    
            xScroll = document.body.offsetWidth;
            yScroll = document.body.offsetHeight;
        }
    }
    var windowWidth, windowHeight;
    if (self.innerHeight) { // all except Explorer    
        if (document.documentElement.clientWidth) {
            windowWidth = document.documentElement.clientWidth;
        } else {
            windowWidth = self.innerWidth;
        }
        windowHeight = self.innerHeight;
    } else {
        if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode    
            windowWidth = document.documentElement.clientWidth;
            windowHeight = document.documentElement.clientHeight;
        } else {
            if (document.body) { // other Explorers    
                windowWidth = document.body.clientWidth;
                windowHeight = document.body.clientHeight;
            }
        }
    }       
    // for small pages with total height less then height of the viewport    
    if (yScroll < windowHeight) {
        pageHeight = windowHeight;
    } else {
        pageHeight = yScroll;
    }    
    // for small pages with total width less then width of the viewport    
    if (xScroll < windowWidth) {
        pageWidth = xScroll;
    } else {
        pageWidth = windowWidth;
    }
    arrayPageSize = new Array(pageWidth, pageHeight, windowWidth, windowHeight);
    return arrayPageSize;
} 

//去除数组重复
function unique(arr) {
    var result = [], hash = {};
    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
        if (!hash[elem]) {
            result.push(elem);
            hash[elem] = true;
        }
    }
    return result;
}
