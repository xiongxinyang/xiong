var IsMouseOverDiv = false;
var IsSearchCityFocus = false;
var  openMapToosLiId = "";

$(function(){
	initDownMenu("mapChoiceLi","mapChoiceDiv","now");
	initDownMenu("drawSearchLi","drawSearchDiv","now");
	initDownMenu("matterMapLi","matterMapDiv","now");
	initDownMenu("mapToolsLi","mapToolsDiv","now");
//	$(document).click(function(){  
//		InitMapTools();
//	}); 
});


/***
 * zzf
 * 点击弹出下拉框
 */
var downArray  = new Array();//用于存放点击下拉菜单的ID

function  initDownMenu(downId,downMenuId,downCss) {
	var obj = new Object();
	obj.downId = downId;
	obj.downMenuId = downMenuId;
	obj.downCss = downCss;
	downArray.push(obj);
	$("#"+downId).click(function(){  
		InitMapTools();
		if($("#"+downMenuId).is(":hidden")==false){
			$(this).removeClass(downCss);
			$("#"+downMenuId).hide();  //
		}else{
			IsMouseOverDiv = true;
			openMapToosLiId = downId;
			$(this).addClass(downCss);
			$("#"+downMenuId).show();  
		}  
		event.stopPropagation();    //  阻止事件冒泡
	}).hover(function() {
		divOver()
	}, function() {
		divOut(downId,downMenuId);
	});
	
	$("#"+downMenuId).hover(function() {
		divOver()
	}, function() {
		divOut(downId, downMenuId)
	});
	
  }


function divOver() {
	try {
		IsMouseOverDiv = true;
	} catch (ex) {
		 throw new Error(ex);
	}
}

function divOut(liId, divId) {
	try {
		IsMouseOverDiv = false;
		setTimeout(function() {
			divClose(liId, divId)
		}, 1000)
	} catch (ex) {
		 throw new Error(ex);
	}
}

function divClose(liId, divId) {
	try {
		if (!IsSearchCityFocus && (!IsMouseOverDiv && liId == openMapToosLiId) ) {
			$("#" + liId).removeClass("now");
			$("#" + divId).hide();
			openMapToosLiId = "";
		}
	} catch (ex) {
		throw new Error(ex);
	}
}

/**
 * 初始化工具栏
 */
function InitMapTools() {
	try{
		IsMouseOverDiv = false;
		for (var i = 0; i < downArray.length; i++) {//下拉菜单隐藏
			var obj = downArray[i];
			$("#"+obj.downId).removeClass(obj.downCss);
			$("#"+obj.downMenuId).hide();  
		}
	}catch(e){}
}


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
//日期格式化
Date.prototype.format = function(format){ 
	var o = { 
	"M+" : this.getMonth()+1, // month
	"d+" : this.getDate(), // day
	"h+" : this.getHours(), // hour
	"m+" : this.getMinutes(), // minute
	"s+" : this.getSeconds(), // second
	"q+" : Math.floor((this.getMonth()+3)/3), // quarter
	"S" : this.getMilliseconds() // millisecond
	} 

	if(/(y+)/.test(format)) { 
	format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
	} 

	for(var k in o) { 
	if(new RegExp("("+ k +")").test(format)) { 
	format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
	} 
	} 
	return format; 
}

//获取url参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}


function getRootPath()
{   
	 var pathName = window.location.pathname.substring(1);   
	 var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));   
	 return window.location.protocol + '//' + window.location.host + '/'+ webName + '/';   
}

function getWebPath(){
	var pathName = window.location.pathname.substring(1);
	var webPath = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
	return webPath;
}



// 取中文地址
/***
 * _lat  _lon 经纬度 
 * addressId 结果回执 eg:"#addressId"
 */
  function getLocation(_lat,_lon,addressId) {
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
		        	if (distname!="")
		        	{
		        		distname=","+distname;
		        	}
		        	str = getDirection(lat2,lng2,lat1,lng1,dist);
		        	if (str!="")
		        	{
		        		str=","+str;
		        	}
	   	}
	   	
				var adc = result.detail.addressComponents;
				var address = adc.country+adc.province+adc.city+adc.district+adc.town+adc.village+adc.street+adc.streetNumber+distname+str;
		       $(addressId).val(address);
			}
	});
	
	//若未取得腾迅地址成功则取百度地址
	geocoder.setError(function() { 
		getBaiduLocation(_lat,_lon,addressId);
	});
	
	 qq.maps.convertor.translate(new qq.maps.LatLng(Number(_lat),Number(_lon)), 1, function(res){
	  geocoder.getAddress(res[0]);
	  });
	}

	
	//车辆列表中,取中文地址
	function getBaiduLocation(_lat,_lon,addressId) {
		var gc = new BMap.Geocoder();    
		var pt= new BMap.Point(_lon,_lat);
		gc.getLocation(pt, function(rs){
	        var addComp = rs.addressComponents;
	        var address = addComp.province + " " + addComp.city + " " + addComp.district + " " + addComp.street + " " + addComp.streetNumber;
	        $(addressId).val(address);
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
	