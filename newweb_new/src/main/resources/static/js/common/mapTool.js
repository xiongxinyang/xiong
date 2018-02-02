//地图通用工具类


/**
 * 得到标题快捷按钮
 * no 车牌号码
 * vehicleId 车辆id
 * type 1表示要单车跟踪按钮，2标示不要单车跟踪按钮
 * **/
function getTitleDiv(no,noColor,vehicleId,type,vin){
	var div='<tr><td><span style="font-weight:bold;">'+(no == undefined ? " " : no)+'&nbsp;&nbsp;VIN:'+vin+'</span></td><td><span style="margin-left:30px;">车牌颜色：'+noColor+'</span></td><td><div style="float:right;padding-right:30px;">';
		if(type==1){//要单车跟踪快捷按钮
			div+='&nbsp;&nbsp;&nbsp;<a target="_blank" title="重点跟踪" href="'+basePath+'secure/gis/attention.html?vehicleID='+vehicleId+"&vehicleno="+encodeURIComponent(no)+'"><span class="span3"></span></a>';
		}
		div+='&nbsp;&nbsp;&nbsp;<a target="_blank" title="轨迹回放" href="'+basePath+'secure/gis/track.html?vehicleId='+vehicleId+"&vehicleno="+encodeURIComponent(no)+'"><span class="span8"></span></a>';
		div+='&nbsp;&nbsp;&nbsp;<a target="_blank" title="指令发送" href="'+basePath+'secure/command/commandSend.html?vehicleIDS='+vehicleId+'"><span class="span2"></span></a>';
		//div+='&nbsp;&nbsp;&nbsp;<a href="javascript:void(0);" title="车辆信息" onclick="javascript:openVehicleInfo('+vehicleId+')"><span class="span14"></span></a>';
		div+='&nbsp;&nbsp;&nbsp;<a target="_blank" title="拍照" href="'+basePath+'secure/command/commandSend.html?commandID=20&vehicleIDS='+vehicleId+'"><span class="span4"></span></a>';
		div+='&nbsp;&nbsp;&nbsp;<a target="_blank" title="文本下发" href="'+basePath+'secure/command/commandSend.html?commandID=3&vehicleIDS='+vehicleId+'"><span class="span5"></span></a>';
		div+='</div></td></tr>';
	return div;
}

//var dataType = 0;//0是车辆监控  1是单车跟踪
//创建弹出窗口布局
function createInfoWindow(obCar) {
	var _contentHeight = 250;
	try{
		var _mapHeight = maplet.getSize().height;
		if(_mapHeight < 400 ){
			_contentHeight = 100;
		}
	}catch(e){
		
	}
	var div = '<div id="openWindowId'+obCar.VehicleID+'" style="border-top:1px solid black;height:'+_contentHeight+'px;overflow-y:scroll;">';
	div += '<table width="100%" border="0">';
	
	div += '	<tr >';
	div += '		<td width="70" align="right">车辆状态：</td>';
	div += '		<td width="160" align="left">'+ (obCar.StatusCN == undefined ? " " : obCar.StatusCN) +'</td>';
	/*div += '		<td width="70" align="right">运行状态：</td>';
	div += '		<td width="120" align="left">'+ (obCar.RunStatus == undefined ? " " : obCar.RunStatus) +'</td>';*/
	div += '		<td width="70" align="right">充电状态：</td>';
	div += '		<td width="160" align="left">'+ (obCar.RunStatus == undefined ? " " : obCar.RunStatus) +'</td>';
	div += '		<td width="90" align="right">运行模式：</td>';
	div += '		<td width="160" align="left">'+ (obCar.FuelStatus == undefined ? " " : obCar.FuelStatus) +'</td>';
	div += '	</tr>';
	div += '	<tr class="popTr">';
	div += '		<td width="70" align="right">车速：</td>';
	div += '		<td width="160" align="left">'+ (obCar.CurrentSpeed == undefined ? " " : obCar.CurrentSpeed+" km/h") +'</td>';
	div += '		<td width="70" align="right">累计里程：</td>';
	div += '		<td width="120" align="left">'+ (obCar.CurrentMileage == undefined ? " " : obCar.CurrentMileage +" km") +'</td>';
	div += '		<td width="70" align="right">剩余电量：</td>';
	div += '		<td width="120" align="left">'+ (obCar.SocStatus == undefined ? " " : obCar.SocStatus+"%") +'</td>';
	div += '	</tr>';
	div += '	<tr >';
	div += '		<td width="70" align="right">总电压：</td>';
	div += '		<td width="160" align="left">'+ (obCar.Totalvoltage == undefined ? " " : obCar.Totalvoltage +"V") +'</td>';
	div += '		<td width="70" align="right">总电流：</td>';
	div += '		<td width="120" align="left">'+ (obCar.TotalCurrent == undefined ? " " : obCar.TotalCurrent + "A") +'</td>';
	div += '		<td width="70" align="right">DC-DC状态：</td>';
	div += '		<td width="120" align="left">'+ (obCar.DcStatus == undefined ? " " : obCar.DcStatus) +'</td>';
	div += '	</tr>';
	div += '	<tr class="popTr">';
	div += '		<td width="70" align="right">档位：</td>';
	div += '		<td width="160" align="left">'+ (obCar.GearStatus == undefined ? " " : obCar.GearStatus) +'</td>';
	div += '		<td width="70" align="right">绝缘电阻：</td>';
	div += '		<td width="120" align="left">'+ (obCar.Resistance == undefined ? " " : obCar.Resistance + " kΩ") +'</td>';
	div += '		<td width="70" align="right"></td>';
	div += '		<td width="120" align="left"></td>';
	div += '	</tr>';
	div += '	<tr >';
	div += '		<td width="70" align="right">定位状态：</td>';
	div += '		<td width="160" align="left">'+ (obCar.PosType == undefined ? " " : obCar.PosType) +'</td>';
	div += '		<td width="70" align="right">经度：</td>';
	div += '		<td width="120" align="left">'+ (obCar.Longitude == undefined ? " " : obCar.Longitude) +'</td>';
	div += '		<td width="70" align="right">纬度：</td>';
	div += '		<td width="120" align="left">'+ (obCar.Latitude == undefined ? " " : obCar.Latitude) +'</td>';
	div += '	</tr>';
	div += '	<tr class="popTr">';
	div += '		<td width="70" align="right">定位时间：</td>';
	div += '		<td width="160" align="left">'+(obCar.GatherTime == undefined ? " " : obCar.GatherTime)+'</td>';
	div += '		<td width="70" align="right">方向：</td>';
	div += '		<td width="120" align="left">'+ getHeadDesZS(obCar.Head) +'(' + obCar.Head + '°)</td>';
	div += '		<td width="70" align="right">高度：</td>';
	div += '		<td width="120" align="left">' + (obCar.Height == undefined ? " " : obCar.Height+" m") + '</td>';
	div += '	</tr>';
	div += '	<tr >';
	div += '		<td width="160" align="right">发动机状态：</td>';
	div += '		<td width="80" align="left">'+(obCar.Parameters&&obCar.Parameters.Motor&&obCar.Parameters.Motor.MotorStatus?obCar.Parameters.Motor.MotorStatus:"")+'</td>';
	div += '		<td width="160" align="right">曲轴转速：</td>';
	div += '		<td width="80" align="left">'+(obCar.Parameters&&obCar.Parameters.Motor&&obCar.Parameters.Motor.MotorSpeed?obCar.Parameters.Motor.MotorSpeed+" rpm":"")+'</td>';
	div += '		<td width="160" align="right">燃料消耗：</td>';
	div += '		<td width="80" align="left">'+(obCar.Parameters&&obCar.Parameters.Motor&&obCar.Parameters.Motor.UseRate?obCar.Parameters.Motor.UseRate+" L/100km":"")+'</td>';
	div += '	</tr>';
	
	var posHtml = "";
	if(dataType==1){ //单车跟踪
		 posHtml = '<span style="width:500px;" id="lblAddress_'+obCar.VehicleID+'"><a href="javascript:void(0);" onclick="javascript:getAddressTool(\'#lblAddress_'+obCar.VehicleID+'\','+obCar.Latitude+','+obCar.Longitude+')">查看地址信息</a></span>';
	}else{
		if(obCar.address != undefined && obCar.Address != ""){
			posHtml = obCar.Address;
		}else{					
			posHtml = '<span style="width:500px;" id="lblAddress_'+obCar.VehicleID+'"><a href="javascript:void(0);" onclick="javascript:getAddressTool(\'#lblAddress_'+obCar.VehicleID+'\','+obCar.Latitude+','+obCar.Longitude+')">查看地址信息</a></span>';
		}				
	} 
	div += '	<tr class="popTr">';
	div += '		<td width="70" align="right">位置信息：</td>';
	div += '		<td colspan="5" align="left">'+posHtml+'</td>';
	div += '	</tr>';
	div += '	<tr >';
	div += '		<td width="70" align="right">终端报警(总数)：</td>';
	div += '		<td width="160" align="left">'+ (obCar.TerminalAlarmStatus>0?'<a href="'+appCtx+'secure/alarm/index.html?s=1&pn='+encodeURI(obCar.VehicleNo)+'" target="_blank" style="color:red">'+obCar.TerminalAlarmStatus+'</a>':obCar.TerminalAlarmStatus)+'</td>';
	div += '		<td width="70" align="right">平台报警(总数)：</td>';
	div += '		<td width="160" align="left">'+ (obCar.ServerAlarmStatus>0?'<a href="'+appCtx+'secure/alarm/index.html?s=10&pn='+encodeURI(obCar.VehicleNo)+'" target="_blank" style="color:red">'+obCar.ServerAlarmStatus+'</a>':obCar.ServerAlarmStatus) +'</a></td>';
	div += '	</tr>';
	div += '	<tr class="popTr">';
	div += '		<td width="70" align="right">司机姓名：</td>';
	div += '		<td width="150" align="left">'+ (obCar.DriverName == undefined ? "" : obCar.DriverName) +'</td>';
	div += '		<td width="100" align="right">司机联系电话：</td>';
	div += '		<td width="120" align="left">'+ (obCar.DriverMobile == undefined ? "" : obCar.DriverMobile) +'</td>';
	div += '		<td width="70" align="right"></td>';
	div += '		<td width="120" align="left"></td>';
	div += '	</tr>';
	div += '	<tr>';
	div += '		<td width="70" align="right">所属机构：</td>';
	div += '		<td width="160" align="left">'+(obCar.UnitName == undefined ? " " : obCar.UnitName)+'</td>';
	/*div += '		<td width="70" align="right">T-BOX：</td>';
	div += '		<td width="160" align="left">'+(obCar.TBoxDeviceID == undefined ? " " : obCar.TBoxDeviceID)+'</td>';*/
	div += '		<td width="70" align="right">后视镜：</td>';
	div += '		<td width="160" align="left">'+(obCar.MqttDeviceID == undefined ? " " : obCar.MqttDeviceID)+'</td>';
	div += '	</tr>';
	div += '</table>';
	return div;
}

function getTitleDivfortrack(no,noColor,vehicleId,type){
	var div='<tr><td><span style="font-weight:bold;">'+(no == undefined ? " " : no)+'</span></td><td><span style="margin-left:30px;">车牌颜色：'+noColor+'</span></td></tr>';
	return div;
}
//创建轨迹回放弹出窗口布局
function createInfoWindowfortrack(obCar) {
	var _contentHeight = 250;
	try{
		var _mapHeight = maplet.getSize().height;
		if(_mapHeight < 400 ){
			_contentHeight = 100;
		}
	}catch(e){
		
	}
	var div = '<div id="openWindowId'+obCar.VehicleID+'" style="border-top:1px solid black;height:'+_contentHeight+'px;overflow-y:scroll;">';
	div += '<table width="100%" border="0">';
	
	div += '	<tr >';
	div += '		<td width="70" align="right">车辆状态：</td>';
	div += '		<td width="160" align="left">'+ (obCar.StatusCN == undefined ? " " : obCar.StatusCN) +'</td>';
	/*div += '		<td width="70" align="right">运行状态：</td>';
	div += '		<td width="120" align="left">'+ (obCar.RunStatus == undefined ? " " : obCar.RunStatus) +'</td>';*/
	div += '		<td width="70" align="right">充电状态：</td>';
	div += '		<td width="160" align="left">'+ (obCar.RunStatus == undefined ? " " : obCar.RunStatus) +'</td>';
	div += '		<td width="90" align="right">运行模式：</td>';
	div += '		<td width="160" align="left">'+ (obCar.FuelStatus == undefined ? " " : obCar.FuelStatus) +'</td>';
	div += '	</tr>';
	div += '	<tr class="popTr">';
	div += '		<td width="70" align="right">车速：</td>';
	div += '		<td width="160" align="left">'+ (obCar.CurrentSpeed == undefined ? " " : obCar.CurrentSpeed+" km/h") +'</td>';
	div += '		<td width="70" align="right">累计里程：</td>';
	div += '		<td width="120" align="left">'+ (obCar.CurrentMileage == undefined ? " " : obCar.CurrentMileage +" km") +'</td>';
	div += '		<td width="70" align="right">剩余电量：</td>';
	div += '		<td width="120" align="left">'+ (obCar.SocStatus == undefined ? " " : obCar.SocStatus+"%") +'</td>';
	div += '	</tr>';
	div += '	<tr >';
	div += '		<td width="70" align="right">总电压：</td>';
	div += '		<td width="160" align="left">'+ (obCar.Totalvoltage == undefined ? " " : obCar.Totalvoltage +"V") +'</td>';
	div += '		<td width="70" align="right">总电流：</td>';
	div += '		<td width="120" align="left">'+ (obCar.TotalCurrent == undefined ? " " : obCar.TotalCurrent + "A") +'</td>';
	div += '		<td width="70" align="right">DC-DC状态：</td>';
	div += '		<td width="120" align="left">'+ (obCar.DcStatus == undefined ? " " : obCar.DcStatus) +'</td>';
	div += '	</tr>';
	div += '	<tr class="popTr">';
	div += '		<td width="70" align="right">档位：</td>';
	div += '		<td width="160" align="left">'+ (obCar.GearStatus == undefined ? " " : obCar.GearStatus) +'</td>';
	div += '		<td width="70" align="right">绝缘电阻：</td>';
	div += '		<td width="120" align="left">'+ (obCar.Resistance == undefined ? " " : obCar.Resistance + " kΩ") +'</td>';
	div += '		<td width="70" align="right"></td>';
	div += '		<td width="120" align="left"></td>';
	div += '	</tr>';
	div += '	<tr >';
	div += '		<td width="70" align="right">定位状态：</td>';
	div += '		<td width="160" align="left">'+ (obCar.PosType == undefined ? " " : obCar.PosType) +'</td>';
	div += '		<td width="70" align="right">经度：</td>';
	div += '		<td width="120" align="left">'+ (obCar.Longitude == undefined ? " " : obCar.Longitude) +'</td>';
	div += '		<td width="70" align="right">纬度：</td>';
	div += '		<td width="120" align="left">'+ (obCar.Latitude == undefined ? " " : obCar.Latitude) +'</td>';
	div += '	</tr>';
	div += '	<tr class="popTr">';
	div += '		<td width="70" align="right">定位时间：</td>';
	div += '		<td width="160" align="left">'+(obCar.GatherTime == undefined ? " " : obCar.GatherTime)+'</td>';
	div += '		<td width="70" align="right">方向：</td>';
	div += '		<td width="120" align="left">'+ getHeadDesZS(obCar.Head) +'(' + obCar.Head + '°)</td>';
	div += '		<td width="70" align="right">高度：</td>';
	div += '		<td width="120" align="left">' + (obCar.Height == undefined ? " " : obCar.Height+" m") + '</td>';
	div += '	</tr>';
	div += '	<tr >';
	div += '		<td width="160" align="right">发动机状态：</td>';
	div += '		<td width="80" align="left">'+(obCar.Parameters&&obCar.Parameters.Motor&&obCar.Parameters.Motor.MotorStatus?obCar.Parameters.Motor.MotorStatus:"")+'</td>';
	div += '		<td width="160" align="right">曲轴转速：</td>';
	div += '		<td width="80" align="left">'+(obCar.Parameters&&obCar.Parameters.Motor&&obCar.Parameters.Motor.MotorSpeed?obCar.Parameters.Motor.MotorSpeed+" rpm":"")+'</td>';
	div += '		<td width="160" align="right">燃料消耗：</td>';
	div += '		<td width="80" align="left">'+(obCar.Parameters&&obCar.Parameters.Motor&&obCar.Parameters.Motor.UseRate?obCar.Parameters.Motor.UseRate+" L/100km":"")+'</td>';
	div += '	</tr>';
	
	var posHtml = "";
	/*if(dataType==1){ //单车跟踪
		 posHtml = '<span style="width:500px;" id="lblAddress_'+obCar.VehicleID+'"><a href="javascript:void(0);" onclick="javascript:getAddressTool(\'#lblAddress_'+obCar.VehicleID+'\','+obCar.Latitude+','+obCar.Longitude+')">查看地址信息</a></span>';
	}else{
		if(obCar.address != undefined && obCar.Address != ""){
			posHtml = obCar.Address;
		}else{					
			posHtml = '<span style="width:500px;" id="lblAddress_'+obCar.VehicleID+'"><a href="javascript:void(0);" onclick="javascript:getAddressTool(\'#lblAddress_'+obCar.VehicleID+'\','+obCar.Latitude+','+obCar.Longitude+')">查看地址信息</a></span>';
		}				
	} */
	div += '	<tr class="popTr">';
	div += '		<td width="70" align="right">位置信息：</td>';
	div += '		<td colspan="5" align="left">'+posHtml+'</td>';
	div += '	</tr>';
	div += '	<tr >';
	div += '		<td width="70" align="right">终端报警(总数)：</td>';
	div += '		<td width="160" align="left">'+ (obCar.TerminalAlarmStatus>0?'<a href="'+appCtx+'secure/alarm/index.html?s=1&pn='+obCar.VehicleNo+'" target="_blank" style="color:red">'+obCar.TerminalAlarmStatus+'</a>':obCar.TerminalAlarmStatus)+'</td>';
	div += '		<td width="70" align="right">平台报警(总数)：</td>';
	div += '		<td width="160" align="left">'+ (obCar.ServerAlarmStatus>0?'<a href="'+appCtx+'secure/alarm/index.html?s=10&pn='+obCar.VehicleNo+'" target="_blank" style="color:red">'+obCar.ServerAlarmStatus+'</a>':obCar.ServerAlarmStatus) +'</a></td>';
	div += '	</tr>';
	div += '	<tr class="popTr">';
	div += '		<td width="70" align="right">司机姓名：</td>';
	div += '		<td width="150" align="left">'+ (obCar.DriverName == undefined ? "" : obCar.DriverName) +'</td>';
	div += '		<td width="100" align="right">司机联系电话：</td>';
	div += '		<td width="120" align="left">'+ (obCar.DriverMobile == undefined ? "" : obCar.DriverMobile) +'</td>';
	div += '		<td width="70" align="right"></td>';
	div += '		<td width="120" align="left"></td>';
	div += '	</tr>';
	div += '	<tr>';
	div += '		<td width="70" align="right">所属机构：</td>';
	div += '		<td width="160" align="left">'+(obCar.UnitName == undefined ? " " : obCar.UnitName)+'</td>';
	/*div += '		<td width="70" align="right">T-BOX：</td>';
	div += '		<td width="160" align="left">'+(obCar.TBoxDeviceID == undefined ? " " : obCar.TBoxDeviceID)+'</td>';*/
	div += '		<td width="70" align="right">后视镜：</td>';
	div += '		<td width="160" align="left">'+(obCar.MqttDeviceID == undefined ? " " : obCar.MqttDeviceID)+'</td>';
	div += '	</tr>';
	div += '</table>';
	return div;
}

function createInfoWindow4Station(stationData) {
	var _contentHeight = 250;
	try{
		var _mapHeight = maplet.getSize().height;
		if(_mapHeight < 400 ){
			_contentHeight = 100;
		}
	}catch(e){
		
	}
	var div = '<div id="openWindowId_'+stationData.stationID+'" style="border-top:1px solid black;height:'+_contentHeight+'px;">'
			+ '<p  class="popTr" style="margin-top:2px;background-color: #DFDFDF;">'
			+ '	<p style="height:28px;line-height:28px"><span >站点名称：</span><span style="display:inline-block;">'+ (stationData.stationName == undefined ? " " : stationData.stationName) +'</span></p>'
			+ '	<p style="height:28px;line-height:28px"><span >联系人：</span><span style="display:inline-block;">' +  (stationData.linkMan == undefined ? " " : stationData.linkMan)  + '</span></p>'
			+ '	<p style="height:28px;line-height:28px"><span >联系电话：</span><span style="display:inline-block;">'+ (stationData.phoneNO == undefined ? " " : stationData.phoneNO) +'</span></p>'
			+ '	<p style="height:28px;line-height:28px"><span >位置：</span><span style="display:inline-block;">'+ (stationData.position == undefined ? " " : stationData.position) +'</span></p>'
			+ '	<p style="height:28px;line-height:28px"><span >营业时间：</span><span style="display:inline-block;">'+ (stationData.businessStart == undefined ? " " : stationData.businessStart) +'&nbsp;-&nbsp;'+(stationData.businessEnd == undefined ? " " : stationData.businessEnd)+'</span></p>'
			+ '</p>';
			div += '</div>';
	return div;
}

/***
 * 取得车辆状态图片地址
 * vehicleTypeId 车辆类型
 * statusId 车辆状态
 * head 方向
 */ 
var carStatus = ['car','carYellow','red','gray'];
function getVehicleStatusPicUrl(vehicleTypeId,statusId,head){
  	var picUrl = basePath + "/img/car/";
	try{ 
		  picUrl  += ((vehicleTypeId == null || vehicleTypeId == undefined) ? 1 : vehicleTypeId) 
			+ "/" +(carStatus[statusId-1])+getHead(head)+".gif";
		  return picUrl;
	}catch(ex){
		console.log(ex);
		return picUrl  = basePath + "/img/car1.gif";  //出错的话 默认车辆图标
}
	
}

//获取方向，用于查询图片
function getHead(head) {
	head=head;
	if ((head >= 0 && head < 22) || (head >= 336)){
		return 3;
		}else if (head >=22 && head <66){
			return 7;
		}else if (head >=66 && head <112){
			return 1;
	    }else if (head >=112 && head <=156){
			return 8;
	    }else if (head >=156 && head <202){
			return 4;
	    }else if (head >=202 && head <= 246){
			return 5;
	    }else if (head >=246 && head <292){
			return 2;
	    }else if (head >=292 && head <336){
			return 6;
	    }
}

/** 车辆方向 **/
function getHeadDesZS(head) {
	if ((head >= 0 && head < 22)||(head >= 336)){
		return "北";
	}else if(head >= 22 && head <66){
		return "东北";
	}else if(head>=66&&head<112){
		return "东";
	}else if(head>=112&&head<156){
		return "东南";
	}else if(head>=156&&head<202){
		return "南";
	}else if(head>=202&&head<246){
		return "西南";
	}else if(head>=246&&head<292){
		return "西";
	}else if(head>=292&&head<336){
		return "西北";
	}
}

//订阅列表中,取中文地址
function getAddressTool(ctrl,lat,lon) {
	if(ctrl)
		$(ctrl).html("正在查询，请稍候...");
	$.ajax({
		type:"GET",
		url : "http://118.178.233.155:8192/?location="+lon+","+lat,
		dataType : "jsonp",
		success:function(result){
			if(result&&result.regeocodes){
	          var ac = result.regeocodes[0].addressComponent;
	          var address = ac.province+ac.city+ac.district+ac.township+ac.streetNumber.street+ac.streetNumber.number;
	          if(address == "") return;
				if(ac.streetNumber.direction != ""){
					address += "偏"+ac.streetNumber.direction+"方";
					if(ac.streetNumber.distance != ""){
						address += Number(ac.streetNumber.distance).toFixed(0)+"米";
					}
				}
	          	$(ctrl).html(address);
			}
		}
	});
}

/**
 * 取中文地址
 * @param lat 纬度
 * @param lon 经度
 * @param callback 成功取到地址后执行的回调函数，回调函数第一个参数是返回的中文地址，第二个参数是params
 * @param params 回调函数的第二个参数
 * @param ctrl 需要显示地址的元素ID
 */
function getAddressCN(lat,lon,callback,params,ctrl) {
	if(ctrl)
		$(ctrl).html("正在查询，请稍候...");

	$.ajax({
		type:"GET",
		url : "http://118.178.233.155:8192/?location="+lon+","+lat,
		dataType : "jsonp",
		success:function(result){
			if(result&&result.regeocodes){
	          var ac = result.regeocodes[0].addressComponent;
	          var address = ac.province+ac.city+ac.district+ac.township+ac.streetNumber.street+ac.streetNumber.number;
	          if(address == "") return;
				if(ac.streetNumber.direction != ""){
					address += "偏"+ac.streetNumber.direction+"方";

					if(ac.streetNumber.distance != ""){
						address += Number(ac.streetNumber.distance).toFixed(0)+"米";
					}
				}
				if(ctrl)
					$(ctrl).html(address);
				 if(callback==null && params==null){
					 $(ctrl).val(address);
				 }
				 
	          	if(typeof(callback)=='function'){
	          		callback(address,params);
	          	}
	          	ac = null;
	          	address = null;
			}
		}
	});
}