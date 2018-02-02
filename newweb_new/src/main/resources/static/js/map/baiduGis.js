	//百度地图
	function  BaiduGis(mapid){
		
		var drawingManager = null;
		var curShowCar = 0;
		
		var baiduControl = null;
		var retOverlay = null;
		var clusterWinow = null;
		
		var opts = {
				width : 400,     // 信息窗口宽度
				height: 180,     // 信息窗口高度
				enableMessage:false//设置允许信息窗发送短息
		 };

		/***
		 * 加载地图
		 */
		this.loadMap  = function(mapid){
			debugger;
			maplet = new BMap.Map(mapid);

			var city = defaultCity!=","?defaultCity.split(","):[113.26006, 23.13399];
			mapZoom = mapZoom !=null?mapZoom:12;
			maplet.centerAndZoom(new BMap.Point(city[0],city[1]), mapZoom);  // 初始化地图,设置中心点坐标和地图级别
			maplet.enableScrollWheelZoom(true);
			maplet.enableScrollWheelZoom();                            // 启用滚轮放大缩小
			maplet.addControl(new BMap.NavigationControl());
			maplet.addControl(new BMap.ScaleControl());  
			maplet.addControl(new BMap.OverviewMapControl()); 
		
			baiduControl = new BMapLib.RectangleZoom(maplet);
			maplet.addControl(new BMap.MapTypeControl({
				mapTypes: [BMAP_NORMAL_MAP, BMAP_SATELLITE_MAP, BMAP_HYBRID_MAP]
			 }));
	
	    
    var styleOptions = {
            strokeColor:"red",    //边线颜色。
           // fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
            strokeWeight: 3,       //边线的宽度，以像素为单位。
            strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
            fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
            strokeStyle: "solid" //边线的样式，solid或dashed。
     };
    
    drawingManager = new BMapLib.DrawingManager(maplet, {
        isOpen: false, //是否开启绘制模式
        enableDrawingTool: false, //是否显示工具栏
        drawingToolOptions: {
            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
            offset: new BMap.Size(5, 5), //偏离值
            scale: 0.8 //工具栏缩放比例
        },
        rectangleOptions: styleOptions //矩形的样式
    });
    drawingManager._super = this;
    
    //使用地图工具事件 
//    drawingManager.addEventListener('overlaycomplete', function(e){
//    	drawingManager.close();
//    	if(drawingType=="queryInfo"){
//    		drawingManager._super.queryInfoDrawingManager(e);
//        }
//	    if(drawingType=="rect" || drawingType=="polygon" ||drawingType=="circle"){
//	    	currentPolygon = e.overlay;
//			$("#divAreaPanel").show();
//	   	    $("#selectAreaType").hide();
//	   	    $("#aAcreageTd").text(e.calculate);
//	   	    if(typeof(e.overlay.getRadius) !="undefined"){
//	   	    	$("#txtRadius").val(e.overlay.getRadius());
//	   	    }
//	   	   drawCenterMarker(currentPolygon);
//		 }
//	    
//		//window.setTimeout(function(){;},3000); 
//    });
    drawingManager.addEventListener('overlaycomplete', function(e){
    	drawingManager.close();
    	currentPolygon = e.overlay;
    	if(drawingType=="rect" || drawingType=="polygon" ||drawingType=="circle"){
    		//如果获取的经纬度都是NaN,就不弹出添加区域框
    		for(var i = 0; i < currentPolygon.getPath().length; i++){
    			if(currentPolygon.getPath()[i].lng!="NaN" && currentPolygon.getPath()[i].lat!="NaN"){
    				$("#divAreaPanel").show();
    				break;
    			}
    		}
       	    $("#selectAreaType").hide();
       	    $("#aAcreageTd").text(e.calculate);
       	    if(typeof(e.overlay.getRadius) !="undefined"){
       	    	$("#txtRadius").val(e.overlay.getRadius());
       	    }
       	    drawCenterMarker(currentPolygon,null);
    	} else if(drawingType=="line"){
    		$("#divLinePanel").show();
       	    $("#selectLineType").hide();
       	    routePathList = e.overlay.getPath();
       	    $("#mileageSpan").text(e.calculate/1000);
	       	if(routePathList.length>0){
	       		var qd = routePathList[0];//起点
	    		 //getLocation(qd.lat,qd.lng,"#lStartPlace");
	       		getAddressCN(qd.lat,qd.lng,null,null,"#lStartPlace");
	    		 var zd = routePathList[routePathList.length-1];//终点
	    		 //getLocation(zd.lat,zd.lng,"#lEndPlace");
	    		 getAddressCN(zd.lat,zd.lng,null,null,"#lEndPlace");
	       	}
    	}
    	if(drawingType=="queryInfo"){
    		drawingManager._super.queryInfoDrawingManager(e);
        }
    	if(typeof(e.label) != "undefined"){//清除数字
    		maplet.removeOverlay(e.label);
    	}
    	
	 });
    
    //markerClusterer = new BMapLib.MarkerClusterer(maplet);
    markerClusterer = new BMapLib.MarkerClusterer(maplet, {markers:[],styles:[{url:basePath+'resources/gis/images/clusterer.png',size:new BMap.Size(55, 55)}]});

	}
	 
	 this.addMarker = function(vehicleId,lon,lat,no,picUrl,vin,time,speed){

		 time = new Date(time);
		 var times=time.toLocaleString();
			if( speed != undefined && speed!=0) {
                speed = speed.toFixed(1);
            }
         //console.log("addMarker-->vehicleId="+vehicleId+",lon="+lon+",lat="+lat+",no="+no+",picUrl="+picUrl+",vin="+vin);
		/*var showInCurrentView = BMapLib.GeoUtils.isPointInRect(point, maplet.getBounds());
		if(!showInCurrentView) return;*/
		var point = new BMap.Point(lat,lon);
		var prevPoint = no;
		//if(this.isTargetPointInRect(point) || this.isTargetPointInRect(prevPoint)){
			//GlobalPrevPoint.put(vehicleId,point);
			if(GlobalMarkerCache.containsKey(vehicleId)){
				  var currentCarMarker = GlobalMarkerCache.get(vehicleId);
				 //removeBaiduMarker(currentCarMarker);
				 //GlobalMarkerCache.remove(vehicleId);
				 var icon = currentCarMarker.getIcon();
				 if(icon.imageUrl!=picUrl){//图片不同
				 icon.setImageUrl(picUrl); //修改图片
				 currentCarMarker.setIcon(icon);//修改提示
				 }
				 currentCarMarker.setPosition(point);//更新位置

				 if(curShowCar == vehicleId){
				 var divHtml = createInfoWindow(GlobalSubscribeVehicle.get(vehicleId));
				 $("#openWindowId"+vehicleId).replaceWith(divHtml);
				 }
				 this.setMarkerLabel(vehicleId,currentCarMarker,times,speed,no);

				 return;
			}

			var myIcon = new BMap.Icon(picUrl, new BMap.Size(32, 42), {
				offset: new BMap.Size(10, 25),     
				imageOffset: new BMap.Size(0, 0 * 25)  
			});  
			
			var marker = new BMap.Marker(point, {icon: myIcon});  
			marker.addEventListener("click",function(){
				debugger;
			/*	winCloseCount++;*/
				var infoWindow = carMarkerWindow(vehicleId);
				infoWindow.addEventListener("close",function(){
					/*winCloseCount--;*/
				});
                maplet.openInfoWindow(infoWindow,point);

				curShowCar = vehicleId;
			}); 
			marker.vehicleId = vehicleId;
			this.setMarkerLabel(vehicleId,marker,times,speed,no);
			GlobalMarkerCache.put(vehicleId,marker);
			if(MonitorConf.showCluster){
				markerClusterer.addMarker(marker);
			}
	/*	}else{
			//console.log("不在屏幕范围...,point="+JSON.stringify(point)+"\r"+"prevPoint="+JSON.stringify(prevPoint));
		}*/
	}
	 
	 this.addMarker4Station = function(vehicleId,lon,lat,picUrl){
			/*var showInCurrentView = BMapLib.GeoUtils.isPointInRect(point, maplet.getBounds());
			if(!showInCurrentView) return;*/
			var point = new BMap.Point(lon,lat); 
			//var prevPoint = GlobalPrevPoint.get(vehicleId);
			if(this.isTargetPointInRect(point)){
				//GlobalPrevPoint.put(vehicleId,point);
				/*if(GlobalMarkerCache.containsKey(vehicleId)){
					var currentCarMarker = GlobalMarkerCache.get(vehicleId);
					//removeBaiduMarker(currentCarMarker);
					//GlobalMarkerCache.remove(vehicleId);
					var icon = currentCarMarker.getIcon();
					if(icon.imageUrl!=picUrl){//图片不同
						icon.setImageUrl(picUrl); //修改图片
						currentCarMarker.setIcon(icon);//修改提示
					}    
					currentCarMarker.setPosition(point);//更新位置
					
					if(curShowCar == vehicleId){
						var divHtml = createInfoWindow(GlobalSubscribeVehicle.get(vehicleId));
						$("#openWindowId"+vehicleId).replaceWith(divHtml);	
					}
					this.setMarkerLabel(vehicleId,currentCarMarker);
					if(winCloseCount==0){
					//	markerClusterer._redraw();
					}
					return;
				}*/
				var myIcon = new BMap.Icon(picUrl, new BMap.Size(32, 42), {     
					offset: new BMap.Size(10, 25),     
					imageOffset: new BMap.Size(0, 0 * 25)  
				});  
				
				var marker = new BMap.Marker(point, {icon: myIcon});  
				marker.addEventListener("click",function(){
					/*winCloseCount++;*/
					var infoWindow = createStatoinMarkerWindow(vehicleId);
					infoWindow.addEventListener("close",function(){
					/*	winCloseCount--;*/
					});
					this.openInfoWindow(infoWindow);
					curShowCar = vehicleId;
				}); 
				marker.vehicleId = vehicleId;
				//this.setMarkerLabel(vehicleId,marker);
				//GlobalMarkerCache.put(vehicleId,marker);
				GlobalStationMarkerCache.put(vehicleId,marker);
				maplet.addOverlay(marker);
				/*if(MonitorConf.showCluster){
					markerClusterer.addMarker(marker);
				}*/
			}
		}	
	 
	 

	 this.addMarkers = function(iconUrl,point,obj){
			var myIcon = new BMap.Icon(iconUrl, new BMap.Size(25,25));
			var marker = new BMap.Marker(point, {icon: myIcon});
			if(obj != null){
				var label = new BMap.Label(obj.name,{offset:new BMap.Size(23,3)});
				label.setStyle({ color:obj.namecolor});
				marker.setLabel(label);
			}
			maplet.addOverlay(marker);
			return marker;
		}
	
	 this.addLabel = function(point,obj){
	 	 var label = new BMap.Label(obj.name, {position : point, offset   : new BMap.Size(23, 3)}); 
	 	 label.setStyle({ color:obj.namecolor});
		return label;
	}
	  
	function carMarkerWindow(vehicleId){
	 	debugger;
		var data = GlobalSubscribeVehicle.get(vehicleId);
		 var opts = { width:800,enableMessage:false };    // 信息窗口大小
		var infoWindow = new BMap.InfoWindow( createInfoWindow(data),opts);
		/*infoWindow.setTitle(getTitleDiv(data.VehicleNo,data.VehicleNoColor,data.VehicleID,1,data.Vin));*/
        infoWindow.setTitle(getTitleDiv(data.vehicleNo,"",vehicleId,1,data.simCardNo));
		return infoWindow;
	}
	
	function createStatoinMarkerWindow(stationID){
		var data = GlobalStationCache.get(stationID);
		 var opts = { width:400,enableMessage:false };    // 信息窗口大小
		var infoWindow = new BMap.InfoWindow(createInfoWindow4Station(data),opts);
		infoWindow.setTitle("服务站点");
		return infoWindow;
	}


	this.zoom = function(type){
		if(type == 1){
			maplet.zoomIn();
		}else{
			maplet.zoomOut();
		}
	}
	
	this.removeMarker = function (marker){
		if(maplet != undefined)
			maplet.removeOverlay(marker); 
		if(markerClusterer != null)
			markerClusterer.removeMarker(marker);
	}

	this.setMarkerLabel = function(vehicleId,marker,time,speed,no){
		//var _tempGpsInfo = GlobalSubscribeVehicle.get(vehicleId);
		var dispLabel = "";
		if(MonitorConf.platerNum){
			dispLabel = "车牌：" + no;
		}
        dispLabel += (dispLabel == "" ? "时间：":"<br/>时间：") + (time != null ? time : "");
        dispLabel += (dispLabel == "" ? "速度：":"<br/>速度：") + (speed != null ? speed : "") + " km/h";
		/*if(MonitorConf.gpsTime){
			dispLabel += (dispLabel == "" ? "时间：":"<br/>时间：") + (_tempGpsInfo.GatherTime != null ? _tempGpsInfo.GatherTime : "");
		}
		if(MonitorConf.speed){
			dispLabel += (dispLabel == "" ? "速度：":"<br/>速度：") + (_tempGpsInfo.CurrentSpeed != null ? _tempGpsInfo.CurrentSpeed : "") + " km/h";
		}*/
		//if(MonitorConf.state){
			//dispLabel += (dispLabel == "" ? "":"<br/>") + (_tempGpsInfo.isDriving == 1 ? "开车：" : "停车：")+ (_tempGpsInfo.drivingTime != null ? _tempGpsInfo.drivingTime : 0);
			//dispLabel += (dispLabel == "" ? "":"<br/>") + _tempGpsInfo.RunStatus;
		//}
		 maplet.addOverlay(marker); 
		 if(dispLabel != ""){
			 var label = new BMap.Label(dispLabel,{offset:new BMap.Size(18,18)});
			 label.setStyle({
				borderColor:"#808080",
				color:"#333"
				});
			 marker.setLabel(label);
		 }
	}

	//清除拉框查找的信息点
	this.clearMarkerAry =   function (){
		for(var i=0;i<queryMarkerAry.length;i++){
			maplet.removeOverlay(queryMarkerAry[i]);
		}
		if( bigMarker!= null){
			maplet.removeOverlay(bigMarker);
		}
		queryMarkerAry =[];
		queryMarkerAry.length=0;
	}

	//移除矩形框
	this.removeRetOverlay = function removeRetOverlay(){
		if(retOverlay!=null){
			maplet.removeOverlay(retOverlay);
		}
	}


	//添加拉框查找的标记
	this.addRetMarker = function  (index,lon,lat,iconUrl,width,height){
		var myIcon = new BMap.Icon(iconUrl, new BMap.Size(width,height));
		var marker = new BMap.Marker(new BMap.Point(lon,lat),{icon : myIcon}); // 创建标注
		marker.addEventListener("click",function(){
			showInMap(5,index); 
		  }); 
		
		maplet.addOverlay(marker); // 将标注添加到地图中
		return marker;
	}

	/***
	 * 设置百度中心点
	 * @returns
	 */
	this.setMapCenter = function(lon,lat,zoom){
		maplet.centerAndZoom(new BMap.Point(lat,lon), zoom);
	}
	/**
	 * 判断点是否在地图可见区域
	 */
	this.isTargetPointInRect = function(targetPoint){
		var bounds = maplet.getBounds();
		if(bounds.getSouthWest() != null && targetPoint != null && bounds.getSouthWest().lng < targetPoint.lng && targetPoint.lng < bounds.getNorthEast().lng 
			&& bounds.getSouthWest().lat < targetPoint.lat && targetPoint.lat < bounds.getNorthEast().lat){
				return true;
			}
		else
			return false;
	}

	this.openClusterWindow = function(lng,lat,table){
		if(clusterWinow!=null){
				clusterWinow.close();
				clusterWinow = null;
			}
		    var point = new BMap.Point(lng,lat);
			clusterWinow = new BMap.InfoWindow(table,opts);  // 创建信息窗口对象 
			maplet.openInfoWindow(clusterWinow,point); //开启信息窗口
	}

	this.closeClusterInfo =function(){ 
			if(clusterWinow!=null){
				clusterWinow.close();
				clusterWinow = null;
			}
	}


	/***
	* 取得地图等级
	* @returns
	*/
	function getMapZoom(){
		return maplet.getZoom();
	}
 

	/***
	* 注销
	*/
	this.destroy = function (){
		GlobalMarkerCache.clear();
		GlobalPrevPoint.clear();
		this.clearMarkerAry();
	}


	//测距
    this.measure =  function (){ 
	   baiduControl.close();
	   var myDis = new BMapLib.DistanceTool(maplet);
	    myDis.open();  // 开启鼠标测距
	}

    this.setCursor = function(cursor){
		maplet.setDefaultCursor(cursor); 
	}
    
    /*this.addMapEventListener = function(eventName){
 	   maplet.addEventListener(eventName,function(e){
 		   showDotPanel(e.point);
 	   });
 	}*/
    
    this.addMapEventListener = function(eventName,functionName){
		   maplet.addEventListener(eventName,showDotPanel);
	}
    
    this.addCircle = function(point,stroke){
 	   var 	currentMarkerCircle = new BMap.Circle(point,stroke.radius,
 				{strokeColor:stroke.strokeColor,strokeWeight: stroke.strokeWeight , fillOpacity:stroke.fillOpacity, strokeOpacity: stroke.strokeOpacity });
 	   maplet.addOverlay(currentMarkerCircle);	
 	  return currentMarkerCircle;
 	}
    
    this.addCurrentMarker = function(iconUrl,point){
	    var myIcon = new BMap.Icon(iconUrl, new BMap.Size(25,25));
	   var  currentMarker = new BMap.Marker(point, {icon: myIcon});
	    currentMarker.addEventListener("dragend",function(){
			var  p = currentMarker.getPosition();
			 $("#mLon").val(p.lng);
		     $("#mLat").val(p.lat);
		      currentMarkerCircle.setCenter(p);
		      //getLocation(p.lat,p.lng,"#mPlace");
		      getAddressCN(p.lat,p.lng,null,null,"#mPlace");
		 }); 
	     currentMarker.enableDragging();
	     maplet.addOverlay(currentMarker);
	     return currentMarker;
	}
    
 /*   this.removeMapEventListener = function(eventName,functionName){
		 maplet.removeEventListener(eventName, functionName);
	}*/
    
    this.removeMapEventListener = function(eventName,functionName){
		 maplet.removeEventListener(eventName,showDotPanel);
	}
    
    
    this.removeOverlay = function(overlay){
		if(overlay!=null){
			maplet.removeOverlay(overlay);
		}
	}
    
    this.setDrawingMode = function(drawingMode){
		var mode = null;
		if(drawingMode == "marker"){
			mode = BMAP_DRAWING_RECTANGLE;
		}else if(drawingMode == "polygon"){
			mode = BMAP_DRAWING_POLYGON;
		}else if(drawingMode == "polyline"){
			mode = BMAP_DRAWING_POLYLINE;
		}else if(drawingMode == "rectangle"){
			mode = BMAP_DRAWING_RECTANGLE;
		}else if(drawingMode == "circle"){
			mode = BMAP_DRAWING_CIRCLE;
		}
		drawingManager.open();
		drawingManager.setDrawingMode(mode);
	}
    
    /**
	  * 得到点
	  */
	this.getPoint = function(lon,lat){
		return  new BMap.Point(lat,lon);
	}
	
	this.addPolygonCMarker = function(iconUrl,point,label){
	    var myIcon = new BMap.Icon(iconUrl, new BMap.Size(32,32));
		var marker = new BMap.Marker(point, {icon: myIcon});
		marker.setLabel(label);
		maplet.addOverlay(marker);
		return marker;
	}
	
	this.addPolygon = function(stroke){
		   var  cPolygon = new BMap.Polygon(stroke.pointPath, {strokeColor:stroke.strokeColor,strokeWeight: stroke.strokeWeight , fillOpacity:stroke.fillOpacity, strokeOpacity: stroke.strokeOpacity});  //创建多边形
		   maplet.addOverlay(cPolygon);   //增加多边形
		   return cPolygon;
	}
	
	this.addMarkerDragendListener =  function(marker,currentPolygon){
		if(marker !=null){
			marker.addEventListener("dragend",function(){
	      			var  p = marker.getPosition();
	      			//移动多边形
	      			 var olng = $("#aLon").attr("oldPoint");
	      			 var olat = $("#aLat").attr("oldPoint");
	      			 var nlng = p.lng;
	      			 var nlat = p.lat;
	      			var point = getPoint(nlng,nlat);
	      			 if(drawingType=="circle"){
	      				  currentPolygon.setCenter(point);
	      			 }else {
	      				 movePolygon(currentPolygon,olng,nlng,olat,nlat);
	      			 } 
	      			 $("#aLon").val(p.lng).attr("oldPoint",p.lng);
	      		     $("#aLat").val(p.lat).attr("oldPoint",p.lat); 
	      		     //getLocation(p.lat,p.lng,"#aPlace");
	      		   getAddressCN(p.lat,p.lng,null,null,"#aPlace");
	      		 }); 
		}
	}
	
	this.enableDragging =  function(marker){
		marker.enableDragging();
	}
	
	this.addContextMenu = function(){
		var menu = new BMap.ContextMenu();
		var txtMenuItem = [
		        {
		         	text:'撤销',
		        	callback:function(){
		        		cancelFlag=true;
		        		var points =overlay.getPath();
		        		var t=points.slice(0,points.length-2);
		        		overlay.setPositionAt(t.length-1,t);
		        		overlay.setPath(t);
		        		maplet.addOverlay(overlay);
		        	}
		        }
		  ];
		  menu.addItem(new BMap.MenuItem(txtMenuItem[0].text,txtMenuItem[0].callback,50));
		  maplet.addContextMenu(menu);
	}
/***
 * 拉框查找
 * 0区域查车  1找加油站 2找停车场 3找高速路出入口 4找收费站
 */
    this.paintingMap =function (type){
	try {
	
	this.clearMarkerAry()//清除上一次的Marker
	this.removeRetOverlay();//移除上一次的拉框
	drawingManagerType = type;
	drawingManager.open();
	drawingManager.setDrawingMode(BMAP_DRAWING_RECTANGLE);
	} catch (e) {
		console.log(e);
	}
}

/***
 * 拉框找车
 * 查找信息点
 */
this.queryInfoDrawingManager = function (e){ 
	retOverlay = e.overlay;
	$("#loading").show();
    if(drawingManagerType==0){
        var params = "";
        for(var i = 0; i < retOverlay.getPath().length; i++){
               params = params
                           + ";"
                           + retOverlay.getPath()[i].lng
                           + "|"
                           + retOverlay.getPath()[i].lat;
        }
	     var lnglat=params.substring(1,params.length);
    	  queryAreaVehicle(lnglat);//mapController.js中的方法
    }else {
    	var options = {
    			pageCapacity:100,
    		onSearchComplete: function(results){ //成功后回调
    		var resultData =[];
    		if (local.getStatus() == BMAP_STATUS_SUCCESS){// 判断状态是否正确
	    		for (var i = 0; i < results.getCurrentNumPois(); i ++){
	    			  var obj = new Object();
	    			  obj.index = i;
	    			  obj.name = results.getPoi(i).title;
	    			  if(typeof(results.getPoi(i).address)!="undefined"){
	    				  obj.address = results.getPoi(i).address;
	    			  }
	    			  if(typeof(results.getPoi(i).phoneNumber)!="undefined"){
	    				  obj.phoneNumber = results.getPoi(i).phoneNumber;
	    			  }
	    			  obj.lat =results.getPoi(i).point.lat;
	    			  obj.lon =results.getPoi(i).point.lng;
	    			  
	    			  resultData.push(obj);
	    			  var iconUrl = basePath + "/resources/gis/images/mapMarkerS.png";
	    			  var mker  = addBaiduRetMarker(i,obj.lon,obj.lat,iconUrl,9,13);
	    			  queryMarkerAry.push(mker);
	    		}
    		}
    		queryAreaInfoCallBack(resultData);
    	 }};
    	 var local = new BMap.LocalSearch(maplet, options);
    	 var bs = new BMap.Bounds(retOverlay.getPath()[3],retOverlay.getPath()[1]); //左下角  右上角
    	 local.searchInBounds(queryContent[drawingManagerType], bs);
    } 

	
}



}