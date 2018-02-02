package com.example.demo.common;

import com.example.demo.common.RefObject;

import java.math.BigDecimal;

/**
 * Created by xiong on 2017/12/28.
 */
public class BaiDuConvert {
    private static double latt;
    private static double lngg;
    private static final double x_pi = 52.35987755982988D;

    public BaiDuConvert() {
    }

    public static String[] GpsToBaidu(String Lng, String Lat) {
        String[] lngLatAry = new String[2];

        try {
            RefObject e = new RefObject(Double.valueOf(latt));
            RefObject tempRef_lngg = new RefObject(Double.valueOf(lngg));
            GpsToBaiduMap(Double.parseDouble(Lng), Double.parseDouble(Lat), e, tempRef_lngg);
            lngLatAry[0] = String.format("%.6f", new Object[]{e.argvalue});
            lngLatAry[1] = String.format("%.6f", new Object[]{tempRef_lngg.argvalue});
        } catch (Exception var5) {
            var5.printStackTrace();
        }

        return lngLatAry;
    }

    public static Double[] GpsToBaidu(Double Lng, Double Lat) {
        Double[] lngLatAry = new Double[2];

        try {
            RefObject e = new RefObject(Double.valueOf(latt));
            RefObject tempRef_lngg = new RefObject(Double.valueOf(lngg));
            GpsToBaiduMap(Lng.doubleValue(), Lat.doubleValue(), e, tempRef_lngg);
            BigDecimal bLatt = new BigDecimal(((Double)e.argvalue).doubleValue());
            lngLatAry[0] = Double.valueOf(bLatt.setScale(6, 4).doubleValue());
            BigDecimal bLng = new BigDecimal(((Double)tempRef_lngg.argvalue).doubleValue());
            lngLatAry[1] = Double.valueOf(bLng.setScale(6, 4).doubleValue());
        } catch (Exception var7) {
            var7.printStackTrace();
        }

        return lngLatAry;
    }

    public static String[] BaiduToGps(String Lng, String Lat) {
        String[] lngLatAry = new String[2];

        try {
            RefObject e = new RefObject(Double.valueOf(latt));
            RefObject tempRef_lngg = new RefObject(Double.valueOf(lngg));
            BaiduMapToGps(Double.parseDouble(Lng), Double.parseDouble(Lat), e, tempRef_lngg);
            lngLatAry[0] = String.format("%.6f", new Object[]{e.argvalue});
            lngLatAry[1] = String.format("%.6f", new Object[]{tempRef_lngg.argvalue});
        } catch (Exception var5) {
            var5.printStackTrace();
        }

        return lngLatAry;
    }

    public static Double[] BaiduToGps(Double Lng, Double Lat) {
        Double[] lngLatAry = new Double[2];

        try {
            RefObject e = new RefObject(Double.valueOf(latt));
            RefObject tempRef_lngg = new RefObject(Double.valueOf(lngg));
            BaiduMapToGps(Lng.doubleValue(), Lat.doubleValue(), e, tempRef_lngg);
            BigDecimal bLatt = new BigDecimal(((Double)e.argvalue).doubleValue());
            lngLatAry[0] = Double.valueOf(bLatt.setScale(6, 4).doubleValue());
            BigDecimal bLng = new BigDecimal(((Double)tempRef_lngg.argvalue).doubleValue());
            lngLatAry[1] = Double.valueOf(bLng.setScale(6, 4).doubleValue());
        } catch (Exception var7) {
            var7.printStackTrace();
        }

        return lngLatAry;
    }

    private static void GpsToBaiduMap(double GpsLon, double GpsLat, RefObject<Double> BaiduMapLon, RefObject<Double> BaiduMapLat) {
        double mglat = 0.0D;
        double mglon = 0.0D;
        RefObject tempRef_mglat = new RefObject(Double.valueOf(mglat));
        RefObject tempRef_mglon = new RefObject(Double.valueOf(mglon));
        encrypt(GpsLat, GpsLon, tempRef_mglat, tempRef_mglon);
        mglat = ((Double)tempRef_mglat.argvalue).doubleValue();
        mglon = ((Double)tempRef_mglon.argvalue).doubleValue();
        bdMapEncrypt(mglat, mglon, BaiduMapLat, BaiduMapLon);
    }

    private static void BaiduMapToGps(double BaiduMapLon, double BaiduMapLat, RefObject<Double> GpsLon, RefObject<Double> GpsLat) {
        double mglat = 0.0D;
        double mglon = 0.0D;
        RefObject tempRef_mglat = new RefObject(Double.valueOf(mglat));
        RefObject tempRef_mglon = new RefObject(Double.valueOf(mglon));
        bdMapDecrypt(BaiduMapLat, BaiduMapLon, tempRef_mglat, tempRef_mglon);
        mglat = ((Double)tempRef_mglat.argvalue).doubleValue();
        mglon = ((Double)tempRef_mglon.argvalue).doubleValue();
        decrypt(mglat, mglon, GpsLat, GpsLon);
    }

    private static boolean outOfChina(double lat, double lon) {
        return lon >= 72.004D && lon <= 137.8347D?lat < 0.8293D || lat > 55.8271D:true;
    }

    private static double sin2(double x) {
        double tt = 0.0D;
        double ss = 0.0D;
        boolean ff = false;
        double s2 = 0.0D;
        boolean cc = false;
        if(x < 0.0D) {
            x = -x;
            ff = true;
        }

        int cc1 = (int)(x / 6.28318530717959D);
        tt = x - (double)cc1 * 6.28318530717959D;
        if(tt > 3.141592653589793D) {
            tt -= 3.141592653589793D;
            if(ff) {
                ff = false;
            } else if(!ff) {
                ff = true;
            }
        }

        ss = tt;
        s2 = tt;
        tt *= tt;
        s2 *= tt;
        ss -= s2 * 0.166666666666667D;
        s2 *= tt;
        ss += s2 * 0.00833333333333333D;
        s2 *= tt;
        ss -= s2 * 1.98412698412698E-4D;
        s2 *= tt;
        ss += s2 * 2.75573192239859E-6D;
        s2 *= tt;
        ss -= s2 * 2.50521083854417E-8D;
        if(ff) {
            ss = -ss;
        }

        return ss;
    }

    private static double TransformLon(double x, double y) {
        double tt = 300.0D + 1.0D * x + 2.0D * y + 0.1D * x * x + 0.1D * x * y + 0.1D * Math.sqrt(Math.sqrt(x * x));
        tt += (20.0D * sin2(18.849555921538762D * x) + 20.0D * sin2(6.283185307179588D * x)) * 0.6667D;
        tt += (20.0D * sin2(3.141592653589794D * x) + 40.0D * sin2(1.047197551196598D * x)) * 0.6667D;
        tt += (150.0D * sin2(0.2617993877991495D * x) + 300.0D * sin2(0.1047197551196598D * x)) * 0.6667D;
        return tt;
    }

    private static double TransformLat(double x, double y) {
        double tt = -100.0D + 2.0D * x + 3.0D * y + 0.2D * y * y + 0.1D * x * y + 0.2D * Math.sqrt(Math.sqrt(x * x));
        tt += (20.0D * sin2(18.849555921538762D * x) + 20.0D * sin2(6.283185307179588D * x)) * 0.6667D;
        tt += (20.0D * sin2(3.141592653589794D * y) + 40.0D * sin2(1.047197551196598D * y)) * 0.6667D;
        tt += (160.0D * sin2(0.2617993877991495D * y) + 320.0D * sin2(0.1047197551196598D * y)) * 0.6667D;
        return tt;
    }

    private static double TransformLon2(double x, double xx) {
        double a = 6378245.0D;
        double e = 0.00669342D;
        double n = Math.sqrt(1.0D - e * sin2(x * 0.0174532925199433D) * sin2(x * 0.0174532925199433D));
        n = xx * 180.0D / (a / n * Math.cos(x * 0.0174532925199433D) * 3.1415926D);
        return n;
    }

    private static double TransformLat2(double x, double yy) {
        double a = 6378245.0D;
        double e = 0.00669342D;
        double mm = 1.0D - e * sin2(x * 0.0174532925199433D) * sin2(x * 0.0174532925199433D);
        double m = a * (1.0D - e) / (mm * Math.sqrt(mm));
        return yy * 180.0D / (m * 3.1415926D);
    }

    private static void TransformLonLat(int wg_lng, int wg_lat, RefObject<Integer> china_lng, RefObject<Integer> china_lat) {
        double x_l = (double)wg_lng / 3686400.0D;
        double y_l = (double)wg_lat / 3686400.0D;
        double x_add = TransformLon(x_l - 105.0D, y_l - 35.0D);
        double y_add = TransformLat(x_l - 105.0D, y_l - 35.0D);
        x_add += 0.5D;
        y_add += 0.75D;
        china_lng.argvalue = Integer.valueOf((int)((x_l + TransformLon2(y_l, x_add)) * 3686400.0D));
        china_lat.argvalue = Integer.valueOf((int)((y_l + TransformLat2(y_l, y_add)) * 3686400.0D));
    }

    private static void encrypt(double wgLat, double wgLon, RefObject<Double> mgLat, RefObject<Double> mgLon) {
        if(outOfChina(wgLat, wgLon)) {
            mgLat.argvalue = Double.valueOf(wgLat);
            mgLon.argvalue = Double.valueOf(wgLon);
        } else {
            double BASE = 3686400.0D;
            int lon = (int)(wgLon * 3686400.0D);
            int lat = (int)(wgLat * 3686400.0D);
            RefObject tempRef_lon = new RefObject(Integer.valueOf(lon));
            RefObject tempRef_lat = new RefObject(Integer.valueOf(lat));
            TransformLonLat(lon, lat, tempRef_lon, tempRef_lat);
            lon = ((Integer)tempRef_lon.argvalue).intValue();
            lat = ((Integer)tempRef_lat.argvalue).intValue();
            mgLon.argvalue = Double.valueOf((double)lon / 3686400.0D);
            mgLat.argvalue = Double.valueOf((double)lat / 3686400.0D);
        }
    }

    private static void decrypt(double mgLat, double mgLon, RefObject<Double> wgLat, RefObject<Double> wgLon) {
        encrypt(mgLat, mgLon, wgLat, wgLon);
        double d_lat = ((Double)wgLat.argvalue).doubleValue() - mgLat;
        double d_lon = ((Double)wgLon.argvalue).doubleValue() - mgLon;
        wgLat.argvalue = Double.valueOf(mgLat - d_lat);
        wgLon.argvalue = Double.valueOf(mgLon - d_lon);
        int nCount = 0;

        double deltalat;
        double deltalon;
        do {
            double newlat = 0.0D;
            double newlon = 0.0D;
            RefObject tempRef_newlat = new RefObject(Double.valueOf(newlat));
            RefObject tempRef_newlon = new RefObject(Double.valueOf(newlon));
            encrypt(((Double)wgLat.argvalue).doubleValue(), ((Double)wgLon.argvalue).doubleValue(), tempRef_newlat, tempRef_newlon);
            newlat = ((Double)tempRef_newlat.argvalue).doubleValue();
            newlon = ((Double)tempRef_newlon.argvalue).doubleValue();
            deltalat = mgLat - newlat;
            deltalon = mgLon - newlon;
            wgLat.argvalue = Double.valueOf(((Double)wgLat.argvalue).doubleValue() + deltalat);
            wgLon.argvalue = Double.valueOf(((Double)wgLon.argvalue).doubleValue() + deltalon);
            ++nCount;
        } while((Math.abs(deltalat) >= 1.0E-7D || Math.abs(deltalon) >= 1.0E-7D) && nCount <= 10);

    }

    private static void bdMapEncrypt(double gg_lat, double gg_lon, RefObject<Double> bd_lat, RefObject<Double> bd_lon) {
        double z = Math.sqrt(gg_lon * gg_lon + gg_lat * gg_lat) + 2.0E-5D * Math.sin(gg_lat * 52.35987755982988D);
        double theta = Math.atan2(gg_lat, gg_lon) + 3.0E-6D * Math.cos(gg_lon * 52.35987755982988D);
        bd_lon.argvalue = Double.valueOf(z * Math.cos(theta) + 0.0065D);
        bd_lat.argvalue = Double.valueOf(z * Math.sin(theta) + 0.006D);
    }

    private static void bdMapDecrypt(double bd_lat, double bd_lon, RefObject<Double> gg_lat, RefObject<Double> gg_lon) {
        bdMapEncrypt(bd_lat, bd_lon, gg_lat, gg_lon);
        double d_lat = ((Double)gg_lat.argvalue).doubleValue() - bd_lat;
        double d_lon = ((Double)gg_lon.argvalue).doubleValue() - bd_lon;
        gg_lat.argvalue = Double.valueOf(bd_lat - d_lat);
        gg_lon.argvalue = Double.valueOf(bd_lon - d_lon);
        int nCount = 0;

        double deltalat;
        double deltalon;
        do {
            double newlat = 0.0D;
            double newlon = 0.0D;
            RefObject tempRef_newlat = new RefObject(Double.valueOf(newlat));
            RefObject tempRef_newlon = new RefObject(Double.valueOf(newlon));
            bdMapEncrypt(((Double)gg_lat.argvalue).doubleValue(), ((Double)gg_lon.argvalue).doubleValue(), tempRef_newlat, tempRef_newlon);
            newlat = ((Double)tempRef_newlat.argvalue).doubleValue();
            newlon = ((Double)tempRef_newlon.argvalue).doubleValue();
            deltalat = bd_lat - newlat;
            deltalon = bd_lon - newlon;
            gg_lat.argvalue = Double.valueOf(((Double)gg_lat.argvalue).doubleValue() + deltalat);
            gg_lon.argvalue = Double.valueOf(((Double)gg_lon.argvalue).doubleValue() + deltalon);
            ++nCount;
        } while((Math.abs(deltalat) >= 1.0E-7D || Math.abs(deltalon) >= 1.0E-7D) && nCount <= 10);

    }
}
