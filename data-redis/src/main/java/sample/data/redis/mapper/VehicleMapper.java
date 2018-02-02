package sample.data.redis.mapper;

import com.yicheng.protos.JttProtocol;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import sample.data.redis.domain.TbVehicle;

import java.util.List;

/**
 * Created by xiong on 2017/11/8.
 */
@Mapper
public interface VehicleMapper {
    @Select("select veh.id as vehicleId,\n" +
            "       veh.GpsId as gpsId,  \n" +
            "       veh.VehicleNo as vehicleNo,  \n" +
            "         isnull(veh.kindID,0) as kindID,\n" +
            "            sim.simCardNo as simCardNo,\n" +
            "\t\t\tdri.id as driverSchoolCode,\n" +
            "\t\t\tdri.name as driverSchoolName\n" +
            "\t\t\t from tb_vehicle veh\n" +
            "            left join tb_BaseDevCarMachine dev on veh.id=dev.VehicleId\n" +
            "            left join tb_BaseDevSimMachine sim on sim.id=dev.SimCardId\n" +
            "\t\t\tleft join tb_DriveSchool dri on dri.id=veh.driveschoolid\n" +
            "            where veh.WorkStatus=1 and veh.DeleteMark=0 and sim.simCardNo is not null")
    List<TbVehicle> getvehlist();

    @Select("select veh.id as vehicleId,\n" +
            "       veh.GpsId as gpsId,  \n" +
            "             veh.VehicleNo as vehicleNo,  \n" +
            "             isnull(veh.kindID,0) as kindID,\n" +
            "             sim.simCardNo as simCardNo,\n" +
            "\t\t\t dri.id as driverSchoolCode,\n" +
            "\t\t\tdri.name as driverSchoolName from tb_vehicle veh\n" +
            "            left join tb_BaseDevCarMachine dev on veh.id=dev.VehicleId\n" +
            "            left join tb_BaseDevSimMachine sim on sim.id=dev.SimCardId\n" +
            "\t\t\tleft join tb_DriveSchool dri on dri.id=veh.driveschoolid\n" +
            "            where veh.WorkStatus=1 and veh.DeleteMark=0 and sim.simCardNo is not null and veh.id=#{id}")
    TbVehicle getvehone(int id);
}
