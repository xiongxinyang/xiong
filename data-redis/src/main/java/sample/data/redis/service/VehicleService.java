package sample.data.redis.service;

import com.yicheng.protos.JttProtocol;
import sample.data.redis.domain.TbVehicle;

import java.util.List;

/**
 * Created by xiong on 2017/11/8.
 */
public interface VehicleService {
    List<TbVehicle> GetVehicleList();
    TbVehicle GetVehicleOne(int id);
}
