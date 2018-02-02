/***
 * 
 * 地图类型 mapType:baiduGis googleGis smartEarthGis
 * 地图ID 
 */
 function MapUtil(mapName){
	// var  isLoadMapJs = new HashMap(); //是否已经加载JS
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
			 //console.log(err);
		 }
	 } 
	 
     this.getMapName = function(){
		return this._mapName;
	 }
	  
     this.getMapType = function(){
		return this._mapType;
	 }

	 /***
	  * 画点
	  */
	 this.drawMarker =  function(car){
		 mapObj.drawMarker(car);
	 }
	 
	 /***
	  * 销毁
	  */
	 this.destroy =  function(){
		 mapObj.destroy();
	 } 
	 
	 
	 
 }