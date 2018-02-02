package com.example.demo.common;

import com.example.demo.common.BaiDuConvert;


/**
 * 常用工具类
 * 
 * @author dasuan 2010-7
 * 
 */
public class Tools{	
/*	public static String getLocationBaidu(String lat,String lon) {
		StringBuffer urlBuffer = new StringBuffer();
		String address="";
		//http://api.map.baidu.com/geocoder?output=json&location=26.612743,%20104.777478&key=37492c0ee6f924cb5e934fa08c6b1676
		urlBuffer.append("http://api.map.baidu.com/geocoder/v2/?output=json&location=")
				 .append(lat)
				 .append(",%20")
				 .append(lon)
				 .append("&ak=IXenpeWeenBHlNzfcWUy0Dmf");//37492c0ee6f924cb5e934fa08c6b1676
		
		try {
			Response resulResponse= HttpClient.getAddress(urlBuffer.toString());
			if(200== resulResponse.getStatusCode()){
				Map json=JSONUtil.fromJson(resulResponse.asString(), Map.class);
				address=((Map<String,String>) json.get("result")).get("formatted_address");
			}
		} catch (Exception e) {
			return "";
		}
		return  address;
	}*/
	
	public static String[] getRealngLatBaidu(String lng,String lat){
		String[] lngLatAry = {};
		try {
			lngLatAry = BaiDuConvert.GpsToBaidu(lng,lat);
		} catch (Exception e) {
		   e.printStackTrace();
		}
		return lngLatAry;
	}
	
	
	/**
	 * 获取偏移后的经纬度
	 * <p>
	 * 根据地图类型获取偏移经纬度,
	 * </p>
	 * @param lng 经度
	 * @param lat 纬度
	 * @param mapType 地图类型 mapType 为空取原值，不做交换
	 * @return String[] 经纬度
	 */
	public static  String[] getRealLngLat(String lng,String lat,String mapType){
		String[] lnglat= {"0","0"};
		try{  
			if(mapType.equals(MapType.BaiduMap)){
		    	return getRealngLatBaidu(lng,lat);
		    } /*else if(mapType.equals(MapType.SmartEarth)){
		    	return getRealLngLatTr(lng,lat);
		    } else if(mapType.equals(MapType.GoogleMap)){
		    	return getRealLngLatGoogleExtends(lng,lat);
			} else if(mapType.equals(MapType.GaoDeMap)){
				GaoDePoint point =	GaoDeConverter.getInstance().getEncryPoint(Double.parseDouble(lng),Double.parseDouble(lat));
				String[] ll= {String.valueOf(point.x),String.valueOf(point.y)};
				return ll;
			}*/
		}catch(Exception e){
			e.printStackTrace();
		}
		return lnglat;
		 
	}
	/**
	 * 获取偏移后的经纬度
	 * <p>
	 * 根据地图类型获取偏移经纬度,
	 * </p>
	 * @param lnglat 经纬度字符串
	 * @param mapType 地图类型 mapType 为空取原值，不做交换
	 * @return String[] 经纬度
	 */
	public static  String[] getRealLngLat(String lnglat,String mapType){
		if(null!= lnglat){
			String[] ll = lnglat.split(",");
			if(ll.length==2){
				return  getRealLngLat(ll[0],ll[1],mapType);
			}
		}
		return null;
		
	}
	
/*
	*//**
	 * 取谷歌经纬度偏移值
	 * 

	 * @return  String[] 经纬度
	 *//*
	public static String[] getRealLngLatGoogle(String lng,String lat){
		String[] lngArray =  null;
		StringBuffer urlBuffer=new StringBuffer();
		//String MAP_BASE_URL = "http://58.67.161.51:8010/googlemap/convert.html";
		//String MAP_BASE_URL = "http://10.10.3.10:8010/googlemap/convert.html";
		String MAP_BASE_URL = "http://10.156.7.6:8010/googlemap/convert.html";
		urlBuffer.append(MAP_BASE_URL)
		         .append("?")
		         .append("lonlat=")
		         .append(lng+","+lat);
		  try {
		   Response resulResponse=HttpClient.getAddress(urlBuffer.toString());
		   String  result =resulResponse.asString();
		   if(result!=null){
			  lngArray =   result.split(",");
		   }
		} catch (Exception e) {
			e.printStackTrace();
		}
		return lngArray;
	}*/
	
	
	/**
	 * 取泰瑞经纬度偏移值
	 * 

	 * @return  String[] 经纬度
	 */
	/*public static String[] getRealLngLatTr(String lng,String lat){
		String[] lngArray = {lng,lat}; 
		 //取车辆的经纬度
		String address="";
		StringBuffer urlBuffer=new StringBuffer();
		urlBuffer.append(CacheKey.MAP_BASE_URL+"/SE_SH")
		         .append("?")
		         .append("st=SE_SH&points=")
		         .append(lng+","+lat)
		         .append("&uid=")
				 .append(CacheKey.MAP_UID);
		
		  try {
		   Response resulResponse=HttpClient.getAddress(urlBuffer.toString());
		   address =resulResponse.asString();
		   Document document; 
		   document = DocumentHelper.parseText(address); 
		   Element root = document.getRootElement(); 
		   Element status=root.element("status");
		   if(CacheKey.MAP_OK.equals(status.getStringValue())){
			   Element resultElement=root.element("result");
			   Element pointsElement=resultElement.element("points");
			   Element pointElement=pointsElement.element("point");
			   Element lngElement=pointElement.element("lng");
			   lngArray[0] =lngElement.getStringValue();
			   Element latElement=pointElement.element("lat");
			   lngArray[1] =latElement.getStringValue();
		   }
		} catch (Exception e) {
			e.printStackTrace();
		}
		return lngArray;
	}*/
	
	/**
	 * 获取腾讯地址
	 * @param lat 纬度
	 * @param lon 经度
	 * @return
	 */
	/*public static String getLocationQQ(String lat, String lon) {
		StringBuffer urlBuffer = new StringBuffer();
		String address = "";
		
		urlBuffer.append("http://apis.map.qq.com/ws/geocoder/v1/?output=json&location=")
				 .append(lat)
				 .append(",")
				 .append(lon)
				 .append("&key=QZCBZ-7IYRG-YJSQI-IK5NS-IYM5Z-PUBO6&get_poi=0&coord_type=1");
		
		try {
			Response resulResponse = HttpClient.getAddress(urlBuffer.toString());
			if(200 == resulResponse.getStatusCode()) {
				Map json = JSONUtil.fromJson(resulResponse.asString(), Map.class);
				
				Map map = (Map) json.get("result");
				Map map2 = (Map) map.get("formatted_addresses");
				
				String address1 = ((Map<String,String>) map).get("address");
				String address2 = "," + ((Map<String,String>) map2).get("recommend");
				
				address = address1 + address2;
			}
		} catch (Exception e) {
			return "";
		}
		return address;
	}*/
	
	/**
	 * 取谷歌经纬度偏移值(通过算法)
	 * 
	 * @param lnglat String
	 * @return  String[] 经纬度
	 */
/*	public static String[] getRealLngLatGoogleExtends(String lng,String lat){
		String[] lngArray =  null;
		double[] lonlat = MapTransUtil.wgs2gcj(Double.parseDouble(lat), Double.parseDouble(lng));
		if(lonlat!=null){
			  String str=String.valueOf(lonlat[0])+","+String.valueOf(lonlat[1]);
			  lngArray =str.split(",");
		}
		return lngArray;
	}*/
	
}
