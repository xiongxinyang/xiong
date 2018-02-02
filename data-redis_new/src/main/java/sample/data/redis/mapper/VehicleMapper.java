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
    @Select("SELECT ID as vehicleId,\n" +
            "\t   VNo as vehicleNo,\n" +
            "\t   Mark AS simCardNo,\n" +
            "\t   12 AS kindID,\n" +
            "\t   VLease AS Tel \n" +
            "\t   FROM tb_newVechile WHERE (DeleteMark=0 OR DeleteMark IS NULL) AND Mark is not  NULL")
    List<TbVehicle> getvehlist();

    @Select("select veh.id as vehicleId,\n" +
            "\t   veh.VehicleNo as vehicleNo,  " +
            "\t   isnull(veh.kindID,0) as kindID,\n" +
            "\t   isnull(sim.simCardNo,0) as simCardNo from tb_vehicle veh \n" +
            "left join tb_BaseDevCarMachine dev on veh.id=dev.VehicleId\n" +
            "left join tb_BaseDevSimMachine sim on sim.id=dev.SimCardId\n" +
            "where veh.WorkStatus=1 and veh.DeleteMark=0 and veh.id=#{id}")
    TbVehicle getvehone(int id);
}
