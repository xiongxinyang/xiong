package sample.data.redis.mapper;

import com.yicheng.protos.JttProtocol;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Component;
import sample.data.redis.domain.TbStudentBase;

import java.util.HashMap;
import java.util.List;

/**
 * Created by xiong on 2017/11/7.
 */
@Mapper
public interface StudentBaseMapper{
	@Select("select base.id as studentNum,\n" +
			"       base.driveType,\n" +
			"\t   isnull(sub2.Numerical,0) as subject2TotalAmt,\n" +
			"\t   isnull(query.Subject2ToTalAmt,0) as subject2Amt,\n" +
			"\t   isnull(sub3.Numerical,0) as subject3TotalAmt,\n" +
			"\t   isnull(query.Subject3ToTalAmt,0) as subject3Amt,\n" +
			"\t   isnull(sub3.MinMilage,0) as totalMileage,\n" +
			"\t   isnull(query.s3mileage,0) as s3mileage\n" +
			"\tfrom tb_student_base base\n" +
			"left join tb_SchoolSubjects sub2 on base.DriveType=sub2.DrivingType and sub2.SubjectId=22\n" +
			"left join tb_SchoolSubjects sub3 on base.DriveType=sub3.DrivingType and sub3.SubjectId=32\n" +
			"left join tb_StudyStat_Query query on base.id=query.StudentId\n" +
			"where base.DeleteMark=0 and base.status=1")
	List<TbStudentBase> getstulist();

	@Select("select base.id as studentNum,\n" +
			"       base.driveType,\n" +
			"\t   isnull(sub2.Numerical,0) as subject2TotalAmt,\n" +
			"\t   isnull(query.Subject2ToTalAmt,0) as subject2Amt,\n" +
			"\t   isnull(sub3.Numerical,0) as subject3TotalAmt,\n" +
			"\t   isnull(query.Subject3ToTalAmt,0) as subject3Amt,\n" +
			"\t   isnull(sub3.MinMilage,0) as totalMileage,\n" +
			"\t   isnull(query.s3mileage,0) as s3mileage\n" +
			"\tfrom tb_student_base base\n" +
			"left join tb_SchoolSubjects sub2 on base.DriveType=sub2.DrivingType and sub2.SubjectId=22\n" +
			"left join tb_SchoolSubjects sub3 on base.DriveType=sub3.DrivingType and sub3.SubjectId=32\n" +
			"left join tb_StudyStat_Query query on base.id=query.StudentId\n" +
			"where base.DeleteMark=0 and base.status=1 and base.id=#{id}")
	TbStudentBase getstuone(int id);
}
