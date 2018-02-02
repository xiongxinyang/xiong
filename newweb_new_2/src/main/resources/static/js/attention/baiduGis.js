//百度地图
function  BaiduGis(mapid){
	
	var carMarker = null;// 车辆Marker
	
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
	}

	
	this.drawMarker = function(car){
		var pos = [];
		//这里处理在地图上绘点
		var point = new BMap.Point(car[0].locations.latitude,car[0].locations.longitude);
		var iconUrl = 	getVehicleStatusPicUrl(1,1,car[0].locations.direction);
		var labelName  =   getMarkerLabel(car[0]);
		if(carMarker==null){
			  var myIcon = new BMap.Icon(iconUrl, new BMap.Size(32, 42), {     
				   offset: new BMap.Size(10, 25),     
				   imageOffset: new BMap.Size(0, 0 * 25)  
			  }); 
			  carMarker = new BMap.Marker(point,{icon : myIcon}); // 创建标注
			 var label = new BMap.Label(labelName,{offset:new BMap.Size(18,18)});
			 label.setStyle({borderColor:"#808080",color:"#333"});
			 carMarker.setZIndex(100001);
			 carMarker.setLabel(label);
			 carMarker.addEventListener("click",function(){
					winCloseCount=1;
					var infoWindow = getWindowContent(car[0]);
					infoWindow.addEventListener("close",function(){
					winCloseCount=0;
			  });
			  this.openInfoWindow(infoWindow, point);
				    //setTimeout("getLocationInfo2("+car.sim+","+car.sHlon+","+car.sHlat+")",500);
			  });
			  maplet.addOverlay(carMarker); // 将标注添加到地图中
			  setTimeout(function(){
					  maplet.panTo(point);    
			  }, 500);
		}else{ 
			var icon = carMarker.getIcon();
			icon.setImageUrl(iconUrl);
			carMarker.setIcon(icon);
			
			     var infoWindow;
				 var label = new BMap.Label(labelName,{offset:new BMap.Size(18,18)});
				 label.setStyle({
			        borderColor:"#808080",
			        color:"#333"
					});
				 carMarker.setLabel(label);
			     carMarker.addEventListener("click",function(){
			    	 winCloseCount=1;
			    	 infoWindow = getWindowContent(car[0]);
			    	 infoWindow.addEventListener("close",function(){
						winCloseCount=0;
					 });
			    	 this.openInfoWindow(infoWindow, point);
			    	 //	setTimeout("getLocationInfo2("+car.sim+","+car.sHlon+","+car.sHlat+")",500);
			     });
			     if(winCloseCount==1){
			    	 carMarker.openInfoWindow(infoWindow, point);
			     }
			   carMarker.setPosition(point);//更新位置
			   maplet.addOverlay(carMarker); // 将标注添加到地图中
			   setTimeout(function(){
				  maplet.panTo(point);    
			   }, 500);
		}
		/*if(car.sd>10||car.sd2>10){
		var vectorFCArrow = new BMap.Marker(point, {
			  // 初始化方向向上的闭合箭头
			  icon: new BMap.Symbol(BMap_Symbol_SHAPE_FORWARD_CLOSED_ARROW, {
			    scale: 1,
			    strokeWeight: 1,
			    rotation: car.head,//顺时针旋转30度
			    fillColor: 'blue',
			    fillOpacity: 0.8
			  })
			});
			maplet.addOverlay(vectorFCArrow);
		}*/
		if(lastPoint!=null){
			pos.push(lastPoint);
		}
		pos.push(point);
		lastPoint=point;
		  // 画轨迹线
		//try{
		/*if(keystonelinecolor ==""){
			keystonelinecolor="#FF0000";
		}
		keystonelinecolor = keystonelinecolor =="#FFFFFF"?"#FF0000":keystonelinecolor
*/
		var keystonelinecolor="#FF0000";
		var pline =   new BMap.Polyline(pos,{strokeColor:keystonelinecolor, strokeWeight:4, strokeOpacity:0.8});
			maplet.addOverlay(pline);
			
	}
	
	/**
	 *  点击车辆图标
	 * @return {}
	 */
	getWindowContent = function(currentCar){
		var windowTitle = {width : 760,enableMessage:false,title : getTitleDiv(currentCar.vehicleNo,"",currentCar.vehicleId,2,"")};
		var infoWindow = new BMap.InfoWindow(createInfoWindow(currentCar),windowTitle);  // 创建信息窗口对象  
		return infoWindow;
	}
	
	
	/***
	 * 注销
	 * @returns
	 */
	this.destroy = function(){
		 this.maplet = null;
	}
	
	
}
 
 
 