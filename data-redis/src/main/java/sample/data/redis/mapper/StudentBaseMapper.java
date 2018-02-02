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
	@Select("select base.id,\n" +
			"\n" +
			"\t\t\t base.stunum as studentNum,\n" +
			"\t\t\t base.Name as stuName,\n" +
			"\t\t\t case base.Sex when 1 then '男' else '女' end as stuSex,\n" +
			"\t\t\t base.IDCardNo as stuCard,\n" +
			"\t\t\t base.Mobilephone as stuTel,\n" +
			"\t\t\t base.pic as stuPic,\n" +
			"\t\t\t base.driveType,\n" +
			"\t\t\tisnull(sub2.Numerical,0) as subject2TotalAmt,\n" +
			"\t\t\tisnull(query.Subject2ToTalAmt,0) as subject2Amt,\n" +
			"\t\t\tisnull(sub3.Numerical,0) as subject3TotalAmt,\n" +
			"\t\t\tisnull(query.Subject3ToTalAmt,0) as subject3Amt,\n" +
			"\t\t\tisnull(sub3.MinMilage,0) as totalMileage,\n" +
			"\t\t\tisnull(query.s3mileage,0) as s3mileage\n" +
			"\t\t\tfrom tb_student_base base\n" +
			"\t\t\tleft join tb_SchoolSubjects sub2 on base.DriveType=sub2.DrivingType and sub2.SubjectId=22\n" +
			"\t\t\tleft join tb_SchoolSubjects sub3 on base.DriveType=sub3.DrivingType and sub3.SubjectId=32\n" +
			"\t\t\tleft join tb_StudyStat_Query query on base.id=query.StudentId\n" +
			"\t\t\twhere base.DeleteMark=0 and base.status=1 and base.stunum is not null")
	List<TbStudentBase> getstulist();

	@Select("select base.id,\n" +
			"\n" +
			"\t\t\t base.stunum as studentNum,\n" +
			"\t\t\t base.Name as stuName,\n" +
			"\t\t\t case base.Sex when 1 then '男' else '女' end as stuSex,\n" +
			"\t\t\t base.IDCardNo as stuCard,\n" +
			"\t\t\t base.Mobilephone as stuTel,\n" +
			"\t\t\t base.pic as stuPic,\n" +
			"\t\t\t base.driveType,\n" +
			"\t\t\tisnull(sub2.Numerical,0) as subject2TotalAmt,\n" +
			"\t\t\tisnull(query.Subject2ToTalAmt,0) as subject2Amt,\n" +
			"\t\t\tisnull(sub3.Numerical,0) as subject3TotalAmt,\n" +
			"\t\t\tisnull(query.Subject3ToTalAmt,0) as subject3Amt,\n" +
			"\t\t\tisnull(sub3.MinMilage,0) as totalMileage,\n" +
			"\t\t\tisnull(query.s3mileage,0) as s3mileage\n" +
			"\t\t\tfrom tb_student_base base\n" +
			"\t\t\tleft join tb_SchoolSubjects sub2 on base.DriveType=sub2.DrivingType and sub2.SubjectId=22\n" +
			"\t\t\tleft join tb_SchoolSubjects sub3 on base.DriveType=sub3.DrivingType and sub3.SubjectId=32\n" +
			"\t\t\tleft join tb_StudyStat_Query query on base.id=query.StudentId\n" +
			"\t\t\twhere base.DeleteMark=0 and base.status=1 and base.stunum is not null and base.id=#{id}")
	TbStudentBase getstuone(int id);
}
