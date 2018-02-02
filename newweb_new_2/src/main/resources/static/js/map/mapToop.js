/**
 * Created by Administrator on 2017-06-13.
 */
var mapTool = {
	init : function(){
        this.markers = [];
        this.vehicleId = [];
        this.mapZoom = 12;
        this.loadingMap();
        this.isopenWin=false;
        this.polylines = [];
        this.MARKID=null;
        this.infoWindow=null;
    },
    /*初始化各类数据，用于存储*/
    initHashMap : {
        GlobalMarkerCache : new HashMap(),      // 地图车辆缓存  key: Id value:marke
        GlobalAddressCache : new HashMap(),
        GlobalPolylineCache : new HashMap()
    },
    /*
     * 初始化地图
     * */
     loadingMap : function(){
    	 var  _this=this;// 创建Map实例
         if($("#mymap").length<=0)return;
         this.map = new AMap.Map('mymap',{
             resizeEnable: true,
             zoom: _this.mapZoom,
             center: [106.67000, 26.60000]
         });  
         AMap.plugin(['AMap.ToolBar'],function(){
        	 _this.map.addControl(new AMap.ToolBar());
         });
     },
     /*覆盖物图标*/
     getVehicleStatusPicUrl : function(head,status){
         var carStatus = ['car','car','carYellow','gray'];
         var picUrl = global.url.domain + "gps-web/resources/images/mapTool/";
         try{
             picUrl += (carStatus[status])+this.getHead(head)+".png";
             return picUrl;
         }catch(ex){
             console.log(ex);
             return picUrl  = global.url.domain + "gps-web/resources/images/mapTool/car1.png";  //出错的话 默认车辆图标
         }
     },
     /**
      * 增加覆盖物
      * @param map
      * @param lon
      * @param lat
      */
	 addMarker : function(data){
		var picUrl = this.getVehicleStatusPicUrl(data.head,data.carStatus);
		marker = new AMap.Marker({
	        map: mapTool.map,
	        position: [data.longitude, data.latitude],
	        icon: picUrl,
	        offset: new AMap.Pixel(-15, -10),
	        autoRotation: true
	    });
		var status = "";
		if(data.carStatus == 1){
			status = "开车";
		}else if(data.carStatus == 2){
			status = "停车";
		}else if(data.carStatus == 2){
			status = "离线";
		}
			
		marker.content = '车牌号：'+data.vehicleNo+'-'+global.carColor(data.vehicleColor)+'</br>定位时间：'+data.gpsTimeS+'</br>GPS速度：'+data.gpsSpeed+' 公里/小时</br>里程：'+data.gpsMileage+' 公里</br>状态：'+status;
		if(mapTool.infoWindow&&mapTool.MARKID==data.vehicleId){
			mapTool.infoWindow.on('close',function(){
				mapTool.MARKID = null;
			}); 
		}
		marker.on('click', function(e){
			mapTool.infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
			mapTool.MARKID=data.vehicleId;
			mapTool.infoWindow.setContent(e.target.content);
			mapTool.infoWindow.open(mapTool.map, e.target.getPosition());
		    setTimeout(function(){
		    	mapTool.MARKID=data.vehicleId;
			},500);
		});
		if(mapTool.infoWindow&&mapTool.MARKID==data.vehicleId){
			var mark = mapTool.initHashMap.GlobalMarkerCache.get(mapTool.MARKID);
			mapTool.infoWindow.setContent(mark.content);
			mapTool.infoWindow.open(mapTool.map,[data.longitude, data.latitude]);
		};
		this.initHashMap.GlobalMarkerCache.put(data.vehicleId,marker);
	},
	/**
     * 增加覆盖物
     * @param map
     * @param lon
     * @param lat
     */
	 addMarkerForShare : function(data){
		var picUrl = this.getVehicleStatusPicUrl(data.head,data.carStatus);
		var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)}); 
		marker = new AMap.Marker({
	        map: mapTool.map,
	        position: [data.longitude, data.latitude],
	        icon: picUrl,
	        offset: new AMap.Pixel(-15, -10),
	        autoRotation: true
	    });
		marker.content = '车牌号：'+data.vehicleNo+'</br>定位时间：'+data.gpsTimeStr+'</br>GPS速度：'+data.gpsSpeedF+' 公里/小时</br>里程：'+data.gpsMileageF+' 公里</br>';
		marker.on('click', function(e){
			 mapTool.isopenWin=true;
			 mapTool.MARKID=data.vehicleId;
			 infoWindow.setContent(e.target.content);
		     infoWindow.open(mapTool.map, e.target.getPosition());
		});
		if(mapTool.isopenWin){
			 infoWindow.setContent(marker.content);
			 infoWindow.open(mapTool.map,marker.getPosition());
			 infoWindow.on('close',function(){
				 mapTool.isopenWin=false;
			 }); 
		};
		this.initHashMap.GlobalMarkerCache.put(data.vehicleId,marker);
	},
	//获取方向，用于查询图片
    getHead : function(head){
        var head=head;
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
    },

    getChinaHead : function(head){
        var head=head;
        if ((head >= 0 && head < 22) || (head >= 336)){
            return '北';
        }else if (head >=22 && head <66){
            return '东北';
        }else if (head >=66 && head <112){
            return '东';
        }else if (head >=112 && head <=156){
            return '东南';
        }else if (head >=156 && head <202){
            return '南';
        }else if (head >=202 && head <= 246){
            return '西南';
        }else if (head >=246 && head <292){
            return '西';
        }else if (head >=292 && head <336){
            return '西北';
        }
    },
	/**
	 * 删除覆盖物
	 * @param vid 车辆ID
	 */
	clearMarker : function(vid){
		var marker = this.initHashMap.GlobalMarkerCache.get(vid);
		 if(marker){
	         marker.setMap(null);
	         marker = null;
	     }
	},
	/**
	 * 删除所有覆盖物
	 * 
	 */
	clearAllMarker : function(vid){
		var markers = this.initHashMap.GlobalMarkerCache.values();
		for(var i=0;i<markers.length;i++){
			var marker = markers[i];
			 if(marker){
		         marker.setMap(null);
		         marker = null;
		     }
		}
		this.initHashMap.GlobalMarkerCache.clear();
		
	},
	/**
	 * 设置地图中心点
	 * @param data  定位数据
	 */
	setCenter : function(data){
		mapTool.map.setCenter(new AMap.LngLat(data.longitude, data.latitude));
	},
	/**
	 * 高德逆地址解析
	 * @param ctrl  地址标签ID
	 * @param  data 定位经纬度
	 */
	getAddress : function(ctrl,data){
		if(data.longitudeD=='0'&&data.latitudeD=='0'){
			return '无效经纬度，无法获取地址';
		}else{
			var ctrl="#"+ctrl;
			if(this.initHashMap.GlobalAddressCache.get(data.longitudeD+'_'+data.latitudeD)){
				return this.initHashMap.GlobalAddressCache.get(data.longitudeD+'_'+data.latitudeD);
			}else{
				var geocoder = new AMap.Geocoder({
		            radius: 1000,
		            extensions: "all"
		        });        
		        geocoder.getAddress(new AMap.LngLat(data.longitude, data.latitude), function(status, result) {
		            if (status === 'complete' && result.info === 'OK') {
		            	var address=result.regeocode.formattedAddress;
		            	mapTool.initHashMap.GlobalAddressCache.put(data.longitudeD+'_'+data.latitudeD,address);
		            	$(ctrl).text(address);
		            	$(ctrl).attr("title",address);
		            }
		        });     
			}	    
		}
		
	},
	
	/**
	 * 高德逆地址解析(定位页面用)
	 * @param ctrl  地址标签ID
	 * @param  data 定位经纬度
	 */
	getAddressExtend : function(ctrl,item,callback){
		if(item.longitudeD=='0'&&item.latitudeD=='0'){
			return '无效经纬度，无法获取地址'; 
		}else{
//			var ctrl="#"+ctrl;
//			var add = mapTool.initHashMap.GlobalAddressCache.get(data.longitudeD+'_'+data.latitudeD);
//			if(add){
//				if(typeof(callback)=='function'){
// 	          		callback(add,data);
// 	          	}
//			}else{
//				var geocoder = new AMap.Geocoder({
//		            radius: 1000,
//		            extensions: "all"
//		        });        
//		        geocoder.getAddress(new AMap.LngLat(data.longitude, data.latitude), function(status, result) {
//		            if (status === 'complete' && result.info === 'OK') {
//		            	var address=result.regeocode.formattedAddress;
//		            	mapTool.initHashMap.GlobalAddressCache.put(data.longitudeD+'_'+data.latitudeD,address);
//		            	if(typeof(callback)=='function'){
//		 	          		callback(address,data);
//		 	          	}
//		            }
//		        });     
//			}
			
			var add = mapTool.initHashMap.GlobalAddressCache.get(item.longitudeD+'_'+item.latitudeD);
			if(add){
				if(typeof(callback)=='function'){
 	          		callback(add,item);
 	          	}
			}else{
				$.ajax({
		            url : addressPath + "?location="+item.longitude+","+item.latitude,
		            dataType : 'jsonp',
		            success : function(data){
		                if(data.info != "OK") return;
		                var ac = data.regeocodes[0].addressComponent;
		                var address = ac.province+ac.city+ac.district+ac.township+ac.streetNumber.street+ac.streetNumber.number;
		                if(address == "") return;
		                if(ac.streetNumber.direction != ""){
		                    address += "偏"+ac.streetNumber.direction+"方";
		                    if(ac.streetNumber.distance != ""){
		                        address += Number(ac.streetNumber.distance).toFixed(0)+"米";
		                    }
		                } 
		                mapTool.initHashMap.GlobalAddressCache.put(item.longitudeD+'_'+item.latitudeD,address);
		                if(typeof(callback)=='function'){
		 	          		callback(address,item);
		 	          	}
		            }
		        })
			}
		}
		
	},
	/**
	 * 测距工具
	 */
	RangingTool : function(){
		mapTool.map.plugin(["AMap.RangingTool"], function() {
			ruler = new AMap.RangingTool(mapTool.map);
	        AMap.event.addListener(ruler, "end", function(e) {
	            ruler.turnOff();
	        });
		});
	},
	/**
	 * 画折线
	 * @param data
	 * @param lineArr
	 */
	drawTrack : function(data,lineArr){
		polyline = new AMap.Polyline({
			path: lineArr,
			strokeColor:"#3366FF",
			strokeWeight:4,
			strokeOpacity:1
		});
		polyline.setMap(mapTool.map);
		this.initHashMap.GlobalPolylineCache.put(mapTool.uuidCreate(),polyline);
	},
	/**
	 * 生成UUID
	 * @returns {String}
	 */
	uuidCreate : function(){
		var S4 = function(){
			return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
		}
		return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	},
	/**
	 * 删除所有覆盖物
	 * 
	 */
	clearAllPolyline : function(){
		var polylines = this.initHashMap.GlobalPolylineCache.values();
		for(var i=0;i<polylines.length;i++){
			var polyline = polylines[i];
			 if(polyline){
				 polyline.setMap(null);
				 polyline = null;
		     }
		}		
	},
    drag : function(obj){
        var bodyH = $('body').height();
        $('#nResizeDiv').mousedown(function(){
            var monitorH = $('.monitor-detail').height();
            $('#nResizeMoveDiv').css({
                display:'block',
                height : monitorH + 7 + 'px',
                bottom : 0
            });
            mouseover();
        });



        var mouseover = function(){
            $('.page').bind('mousemove',function(e){
                var clientY = e.clientY; // console.log(clientY);
                $('#nResizeMoveDiv').css({
                    height:bodyH - clientY + 7 + 'px'
                });
                mouseout();
            });
        };

        var mouseout = function(){
            $('.page').bind('mouseup',function(e){
                var clientY = e.clientY;
                $('#nResizeMoveDiv').css({
                    height:bodyH - clientY + 7 + 'px'
                });
                $('#mymap').css({
                    height : clientY - obj.h + 'px'
                });
                $('.monitor-detail').css({
                    height : bodyH - clientY - 5 + 'px'
                });
                $('#nResizeMoveDiv').hide();
                /*$('.car-staues').css({
                    bottom : bodyH - clientY + 2
                });*/
                $('.page').unbind();
                obj.callback(bodyH - clientY);
            });
        };
    }
	
};
mapTool.init();