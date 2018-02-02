/***
 * 
 * 地图类型 mapType:baiduGis googleGis smartEarthGis
 * 地图ID 
 */
 function MapUtil(mapName){
	// var  isLoadMapJs = new HashMap(); //是否已经加载JS
	 var mapObj = null;//百度 谷歌 泰瑞 高德
	 var _mapType = null; //百度 0 泰瑞 1  谷歌 2 高德
	 var _mapName = mapName;
	 /**
	  * 加载地图
	  */
	 this.loadMap  = function (mapid){
		 try{
			 if(mapName=="baiduGis"){
				// $.getScript('http://api.map.baidu.com/api?v=2.0&ak=ceCK1osSlIYCSdhnVhO7eq3H'); 
				 this._mapType = 0; 
				 mapObj  = new BaiduGis(mapid);
			 }else if(mapName=="googleGis"){
				this._mapType = 1; 
				 mapObj = new GoogleGis(mapid);
			 }else if(mapName=="smartEarthGis"){
				 
			 } 
			  this._mapName = mapName;
			 mapObj.loadMap(mapid);
		 }catch(err){
		 }
	 } 
	 
	 this.getMapName = function(){
		return this._mapName;
	 }
	  
     this.getMapType = function(){
		return this._mapType;
	 } 
     
     this.zoom = function(type){
  		mapObj.zoom(type);
  	 }

	 /**
	  * 添加起始点
	  */
	 this.addStartMarker = function(iconUrl,lng,lat){
		 mapObj.addStartMarker(iconUrl,lng,lat);
	 }
	 
	 /***
	  * 添加终点
	  */
	 this.addEndMarker = function(iconUrl,lng,lat){
		 mapObj.addEndMarker(iconUrl,lng,lat);
	 }
	 
	 /***
	  * 画点
	  */
	 this.drawCarMarker =  function(iconUrl,obj,vehicleName,vehicleid){
		 mapObj.drawCarMarker(iconUrl,obj,vehicleName,vehicleid)
	 }
	 
	 /***
	  * 画点
	  */
	 this.addImgMarker =  function(iconUrl,lng,lat){
		  mapObj.addImgMarker(iconUrl,lng,lat)
	 }
	 
	 /***
	  * 画点
	  */
	 this.addAlarmMarker =  function(i,iconUrl,lng,lat){
		 mapObj.addImgMarker(i,iconUrl,lng,lat)
	 }
	 
	 /***
	  * 画点
	  */
	 this.addTrackPointMarker =  function(i,iconUrl,obCar){
		 mapObj.addTrackPointMarker(i,iconUrl,obCar)
	 }
	 
		this.addLabel = function(point,obj){
			return mapObj.addLabel(point,obj);
		}
	 
	 /**
	  * 得到点
	  */
	 this.getPoint = function(lon,lat){
		 return mapObj.getPoint(lon,lat);
	 }
	 
	 
	 /**
	  * 得到点
	  */
	 this.setcenter = function(lon,lat){
		mapObj.setCenter(lon,lat);
	 }
	 
	 
	 /**
	  * 画线并加载到地图上
	  */
	 this.drawPolyline = function(trackPoint,strokeColor,strokeWeight,strokeOpacity){
		 mapObj.drawPolyline(trackPoint,strokeColor,strokeWeight,strokeOpacity);
	 }
	 
	 /**
	  * 清除地图上的层
	  */
	 this.clearOverlays = function(){
		 mapObj.clearOverlays();
	 }
	 
	 /***
	  * 拉框查找
	  * 0区域查车  1找加油站 2找停车场 3找高速路出入口 4找收费站
	  */
	 this.paintingMap =  function(type){
	 	mapObj.paintingMap(type);
	 }
	 
	 /***
	  * 测面、线工具0、为面1为线
	  */
	 this.measure = function(){
		 mapObj.measure();
	 }
	 
	 /***
	  * 销毁
	  */
	 this.destroy =  function(){
		 mapObj.destroy();
	 } 
	 
	 /***
	  * 设置地图上的光标
	 */	 
	this.setCursor = function(cursor){
		mapObj.setCursor(cursor);
	}
	
	this.addMapEventListener = function(eventName){
		 mapObj.addMapEventListener(eventName);
	}
	
	/***
	 * 添加圆
	 */
	this.addCircle = function(point,stroke){
		return mapObj.addCircle(point,stroke);
	}
	
	this.addCurrentMarker = function(iconUrl,point){
		return mapObj.addCurrentMarker(iconUrl,point);
	}
	
	this.removeMapEventListener = function(eventName){
		 mapObj.removeMapEventListener(eventName);
	}
	
	this.removeOverlay = function(overlay){
		  mapObj.removeOverlay(overlay);
	}
	
	this.setDrawingMode = function(drawingMode){
		mapObj.setDrawingMode(drawingMode);
	}
	
	/**
	  * 得到点
	  */
	this.getPoint = function(lon,lat){
		return mapObj.getPoint(lon,lat);
	}
	
	this.addPolygonCMarker = function(iconUrl,point,label){
		return mapObj.addPolygonCMarker(iconUrl,point,label);
	}
	
	this.addPolygon = function(stroke){
		return mapObj.addPolygon(stroke);
	}
	
	this.addMarkerDragendListener =  function(marker,currentPolygon){
		mapObj.addMarkerDragendListener(marker,currentPolygon);
	}
	
	/***
	 * 添加标注
	 */
	this.addMarker = function(iconUrl,point,obj){
		return mapObj.addMarker(iconUrl,point,obj);
	}

	
	this.enableDragging =  function(marker){
		mapObj.enableDragging(marker);
	}
	
	this.addContextMenu = function(){
		 mapObj.addContextMenu();
	}
	
	this.removeMarker = function (marker){
		mapObj.removeMarker(marker);
	}
	
	this.clearMarkerAry =   function (){
		mapObj.clearMarkerAry();
	}
	
	this.removeRetOverlay =   function (){
		mapObj.removeRetOverlay();
	}
	 
 }