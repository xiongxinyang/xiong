	/***
	 * 
	 * 地图类型 mapType:baiduGis googleGis smartEarthGis
	 * 地图ID 
	 */
	function MapUtil(mapName){
	  var mapObj = null;//百度 谷歌 泰瑞 高德
	  var _mapType = null; //百度 0 泰瑞 1  谷歌 2 高德
	  var _mapName = null;
	
	 /**
	  * 加载地图
	  */
	 this.loadMap  = function (mapid){
		 try{
			 if(mapName=="baiduGis"){
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
			 console.log(err);
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
 	
     this.addMarker = function(vehicleId,lon,lat,no,picUrl,vin,time,speed){
		mapObj.addMarker(vehicleId,lon,lat,no,picUrl,vin,time,speed);
	 }
     
     this.addMarker4Station = function(vehicleId,lon,lat,picUrl){
 		mapObj.addMarker4Station(vehicleId,lon,lat,picUrl);
 	 }

     this.paintingMap =function (type){
    	 mapObj.paintingMap(type);
     }
	 
     /***
 	 * 添加标注
 	 */
 	this.addMarkers = function(iconUrl,point,obj){
 		return mapObj.addMarkers(iconUrl,point,obj);
 	}
 	this.addLabel = function(point,obj){
		return mapObj.addLabel(point,obj);
	}
 	this.addPolygon = function(stroke){
		return mapObj.addPolygon(stroke);
	}
  	/*** 
	 * @returns
	 */
	this.setMapCenter = function(lon,lat,zoom){
		mapObj.setMapCenter(lon,lat, zoom);
	}

 
	this.openClusterWindow = function(lng,lat,table){
		mapObj.openClusterWindow(lng,lat,table);
	}

	this.closeClusterInfo =function(){
		mapObj.closeClusterInfo();
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


	this.addRetMarker =   function (){
		mapObj.addRetMarker();
	}

	
	/***
	* 注销
	*/
	this.destroy = function (){
		mapObj.destroy(); 
	}
	

	/***
	 * 取得地图等级
	 * @returns
	 */
	function getMapZoom(){
		return mapObj.getMapZoom(); 
	}
 

   this.measure =  function (){ 
	return mapObj.measure(); 
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
	
	this.addMarkerDragendListener =  function(marker,currentPolygon){
		mapObj.addMarkerDragendListener(marker,currentPolygon);
	}
	
	this.enableDragging =  function(marker){
		mapObj.enableDragging(marker);
	}
	
	this.addContextMenu = function(){
		 mapObj.addContextMenu();
	}
}