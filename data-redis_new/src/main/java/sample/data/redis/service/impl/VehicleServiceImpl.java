package sample.data.redis.service.impl;

import com.yicheng.protos.JttProtocol;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import sample.data.redis.domain.TbVehicle;
import sample.data.redis.mapper.VehicleMapper;
import sample.data.redis.service.VehicleService;

import java.util.List;

/**
 * Created by xiong on 2017/11/8.
 */
@Slf4j
@Component
@Service
public class VehicleServiceImpl implements VehicleService{
    private VehicleMapper vehicleMapper;
    @Autowired
    public VehicleServiceImpl(VehicleMapper vehicleMapper) {
        this.vehicleMapper = vehicleMapper;
    }
    @Override
    public List<TbVehicle> GetVehicleList() {
        return  vehicleMapper.getvehlist();
    }

    @Override
    public TbVehicle GetVehicleOne(int id) {
        return  vehicleMapper.getvehone(id);
    }
}
