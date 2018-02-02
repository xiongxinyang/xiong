//百度地图
function  BaiduGis(mapid){
	
	var startMarker = null;//起始点
	var endMarker = null;//结束点
	var carMarker = null;// 车辆Marker
	var trackLine = null;// 线路
	var imgMarkerAry = [];//图片点
	var alarmMarkerAry =[];//报警点
	var baiduControl = null;
	var retOverlay = null;
	/***
	 * 加载地图
	 */
	this.loadMap  = function(mapid){
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

		markerClusterer = new BMapLib.MarkerClusterer(maplet, {markers:[],styles:[{url:basePath+'resources/gis/images/clusterer.png',size:new BMap.Size(55, 55)}]});
	}
	
	
	/***
	 * 添加起始点
	 */
	this.addStartMarker = function(iconUrl,lng,lat){
        var point = new BMap.Point(lat,lng);
		//var point =  this.getPoint(lng,lat);
		if(startMarker==null){
			var myIcon = new BMap.Icon(iconUrl, new BMap.Size(28,32));
			startMarker = new BMap.Marker(point,{icon : myIcon}); // 创建标注
		    maplet.addOverlay(startMarker); // 将标注添加到地图中
		}else{
			startMarker.setPosition(point);
		}
	}
	
	/***
	 * 添加结束点
	 */
	this.addEndMarker = function(iconUrl,lng,lat){
        var point = new BMap.Point(lat,lng);
		//var point =  this.getPoint(lng,lat);
		if(endMarker==null){
			var myIcon = new BMap.Icon(iconUrl, new BMap.Size(28,32));
			endMarker = new BMap.Marker(point,{icon : myIcon}); // 创建标注
		    maplet.addOverlay(endMarker); // 将标注添加到地图中
		}else{
			endMarker.setPosition(point);
		}
	}
	
	this.setCursor = function(cursor){
		maplet.setDefaultCursor(cursor); 
	}
	
/*	this.addMapEventListener = function(eventName){
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
    
/*    this.removeMapEventListener = function(eventName,functionName){
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
	
	this.addMarker = function(iconUrl,point,obj){
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
	/**
	 * 画车辆图标
	 */
	this.drawCarMarker = function(iconUrl,obj,vehicleName,vehicleid){
		debugger;
        var point=new BMap.Point(obj.latitude,obj.longitude);
			/*var point =  this.getPoint(obj.longitude,obj.latitude);*/
			var labelName = getMarkerLabel(obj,vehicleName);
			var label = new BMap.Label(labelName,{offset:new BMap.Size(18,18)});
			 label.setStyle({
		        borderColor:"#808080",
		        color:"#333"
				});
			if(carMarker==null){
		/*	   var myIcon = new BMap.Icon(iconUrl, new BMap.Size(40,40), {anchor: new BMap.Size(15, 15)});*/
                //var myIcon = new BMap.Icon(iconUrl, new BMap.Size(140, 140));
                var myIcon = new BMap.Icon("/img/car1.gif", new BMap.Size(32, 42), {
                    offset: new BMap.Size(10, 25),
                    imageOffset: new BMap.Size(0, 0 * 25)
                });

                carMarker = new BMap.Marker(point,{icon : myIcon}); // 创建标注
			   carMarker.setLabel(label);
			   carMarker.addEventListener("click",function(){
			    	 winCloseCount=1;
				 var infoWindow = getWindowContent(obj,vehicleName,vehicleid);
				 infoWindow.addEventListener("close",function(){
						winCloseCount=0;
					});
				 this.openInfoWindow(infoWindow, point);
			   });
			   carMarker.setZIndex(100001);
			   maplet.addOverlay(carMarker); // 将标注添加到地图中
			   if(!this.isTargetPointInRect(point)){
					  maplet.panTo(point);    
				}
			}else{
				var icon = carMarker.getIcon();
				icon.setImageUrl(icon.imageUrl);
				carMarker.setIcon(icon);
				carMarker.setLabel(label);
				carMarker.closeInfoWindow();
				var infoWindow = getWindowContent(obj,vehicleName,vehicleid);
				carMarker.setPosition(point);
				if(!this.isTargetPointInRect(point)){
					maplet.panTo(point);    
				}
			}
			if(obj.speed>10||obj.speed>10){
				if(playIndex!=null && playIndex!=undefined && playIndex%3==0){//控制车子移动后的箭头三个点画一个箭头
					var vectorFCArrow = new BMap.Marker(point, {
						  // 初始化方向向上的闭合箭头
						  icon: new BMap.Symbol(BMap_Symbol_SHAPE_FORWARD_CLOSED_ARROW, {
						    scale: 1,
						    strokeWeight: 1,
						    rotation: obj.direction,//顺时针旋转30度
						    fillColor: 'blue',
						    fillOpacity: 0.8
						  })
						});
					
					maplet.addOverlay(vectorFCArrow);
				}
		 }
	}
	function getMarkerLabel(car,vehicleName){
		var dispLabel = "";
		try{


				dispLabel = "车牌：" + vehicleName;

			if(car.speed){
                var speed = car.speed.toFixed(1);
				dispLabel += (dispLabel == "" ? "速度：":"<br/>速度：") + (speed != 0 ? speed : "0") + " KM/h";
			}
			if(car.time){
                var time = new Date(car.time);
                var times=time.toLocaleString();
				dispLabel += (dispLabel == "" ? "时间：":"<br/>时间：") + (times != null ? times : 0);
			}
		 
			//dispLabel  = dispLabel==""?vehicleNO:dispLabel;
		}catch(ex){
			console.log("getMarkerLabel:"+ex);
		}
		return dispLabel;
	}
	 
	
	 /***
	  * 画点
	  */
	 this.addImgMarker =  function(iconUrl,lng,lat){
		   var point =  this.getPoint(lng,lat);
			var myIcon = new BMap.Icon(iconUrl, new BMap.Size(40,40));
			var imgMarker = new BMap.Marker(point,{icon : myIcon}); // 创建标注
			imgMarker.addEventListener("click",function(){
					if($("#importNav2").css("display") =="none"){
				    	$("#importNav2").slideDown();
				    	$("#importNav3").toggleClass("importNav");
				    }
					 $("#commandImg").show();
				}); 
		    maplet.addOverlay(imgMarker); // 将标注添加到地图中
		    imgMarkerAry.push(imgMarker);
	 }
	 
	 /***
	  * 画点
	  */
	 this.addAlarmMarker =  function(i,iconUrl,lng,lat){
		    var point =  this.getPoint(lng,lat);
			var myIcon = new BMap.Icon(iconUrl, new BMap.Size(40,40));
  			
  			var almMarker = new BMap.Marker(point,{icon : myIcon}); // 创建标注
  			almMarker.idx = i;
  			almMarker.addEventListener("click",function(){
  				var opts = { width : 530,enableMessage:false };    // 信息窗口大小
  				var infoWindow = new BMap.InfoWindow( createAlarmInfoWindow(almDatas[this.idx],this.idx),opts);
  				infoWindow.setTitle("历史报警");
  				this.openInfoWindow(infoWindow);
  		    }); 
  		    maplet.addOverlay(almMarker); // 将标注添加到地图中
  		    alarmMarkerAry.push(almMarker);
	 }
	 
	 /***
	  * 轨迹点 
	  */
	 this.addTrackPointMarker =  function(i,iconUrl,obCar){

         var point=new BMap.Point(obCar.correctedLat,obCar.correctedLng);
		 //var point =  this.getPoint(obCar.correctedLng, obCar.correctedLat);
		 var myIcon = new BMap.Icon(iconUrl, new BMap.Size(18,18));
		 var marker = new BMap.Marker(point,{icon : myIcon}); // 创建标注
			marker.addEventListener("click",function(){
				var opts = { width : 380,height: 200,enableMessage:false };    // 信息窗口大小
				var infoWindow = new BMap.InfoWindow( createTrackInfoWindow(obCar),opts);
				infoWindow.setTitle("车牌号："+obCar.name+"("+obCar.noColor+")");
				this.openInfoWindow(infoWindow);
		    }); 
		    maplet.addOverlay(marker); // 将标注添加到地图中
		    this.trackPointMarker.push(marker);
	 }
	
	 this.removeMarker = function (marker){
			if(maplet != undefined)
				maplet.removeOverlay(marker); 
			if(markerClusterer != null)
				markerClusterer.removeMarker(marker);
	 }
	
	 /**
	  * 得到点
	  */
	 this.getPoint = function(lon,lat){
		 return  new BMap.Point(lat,lon);
	 }
	 
	 this.setCenter = function(lon,lat){
		 var point = new BMap.Point(lat,lon);
		 maplet.centerAndZoom(point,10);
		 carMarker=null;
	 }
	 
	 /**
	  * 画线并加载到地图上clearOverlays
	  */
	 this.drawPolyline = function(trackPoint, strokeColor,strokeWeight,strokeOpacity){
		 trackLine = new BMap.Polyline(trackPoint,{strokeColor:strokeColor, strokeWeight:strokeWeight, strokeOpacity:0.5});
		 maplet.addOverlay(trackLine);
	 }
	
	 /**
	  * 清除地图上的层
	  */
	 this.clearOverlays = function(){
		 this.carMarker = null;
		 this.startMarker = null;//起始点
		 this.endMarker = null;//结束点
		 this.trackLine = null;// 线路
		 this.imgMarkerAry = null;
		 this.alarmMarkerAry = null;//报警点
		 this.trackPointMarker = [];
		 maplet.clearOverlays();
	 }
	 
	 this.zoom = function(type){
			if(type == 1){
				maplet.zoomIn();
			}else{
				maplet.zoomOut();
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
	 /***
	  * 拉框查找
	  * 0区域查车  1找加油站 2找停车场 3找高速路出入口 4找收费站
	  */
	 this.paintingMap = function(type){
	 	mapObj.paintingMap(type);
	 }
	
		//测距
	    this.measure =  function (){ 
		   baiduControl.close();
		   var myDis = new BMapLib.DistanceTool(maplet);
		    myDis.open();  // 开启鼠标测距
		}
	 
	/***
	 * 注销
	 * @returns
	 */
	this.destroy = function(){
		 this.maplet = null;
	}
	
	/***
	 * 判断是否边框内
	 */
	this.isTargetPointInRect = function(targetPoint){
		var bounds = maplet.getBounds();
		if(bounds.getSouthWest().lng < targetPoint.lng && targetPoint.lng < bounds.getNorthEast().lng 
			&& bounds.getSouthWest().lat < targetPoint.lat && targetPoint.lat < bounds.getNorthEast().lat){
				return true;
			}
		else
			return false;
	}
	
}


function baiduPaintingMap(){
	//try {
    var styleOptions = {
            strokeColor:strokeColor[colorIndex],    //边线颜色。
           // fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
            strokeWeight: 3,       //边线的宽度，以像素为单位。
            strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
            fillOpacity: 0.5,      //填充的透明度，取值范围0 - 1。
            strokeStyle: "solid" //边线的样式，solid或dashed。
     };
    
	baiduDrawingManager.open();
	baiduDrawingManager.setDrawingMode(BMAP_DRAWING_RECTANGLE);
	baiduDrawingManager.rectangleOptions  = styleOptions;
	colorIndex = colorIndex==4?0:colorIndex+1;
	//} catch (e) {
	//}
}



 
 function getWindowContent(currentCar,vehicleName,vehicleid){
	var windowTitle = {width : 760,enableMessage:false,title : getTitleDivfortrack(vehicleName,"黄色",vehicleid,2)};
	var infoWindow = new BMap.InfoWindow(createInfoWindowfortrack(currentCar,vehicleName,vehicleid),windowTitle);  // 创建信息窗口对象
	return infoWindow;
}
 