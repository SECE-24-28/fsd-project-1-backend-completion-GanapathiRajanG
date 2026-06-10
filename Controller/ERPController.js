const Student = require('../Models/StudentModel');
const Teacher = require('../Models/TeacherModel');
const User = require('../Models/UserModel');
const Attendance = require('../Models/AttendanceModel');
const Marks = require('../Models/MarksModel');
const Fee = require('../Models/FeeModel');
const Assignment = require('../Models/AssignmentModel');
const Notice = require('../Models/NoticeModel');

const getStudentProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    let studentRecord = await Student.findOne({ userId: user._id });
    if (!studentRecord) {
      studentRecord = new Student({ userId: user._id, name: `${user.firstname} ${user.lastname}`, email: user.email });
      await studentRecord.save();
    }

    const attendance = await Attendance.find({ studentId: studentRecord._id });
    const marks = await Marks.find({ studentId: studentRecord._id });
    const fees = await Fee.findOne({ studentId: studentRecord._id });
    const notices = await Notice.find({ targetAudience: { $in: ['All', 'Students'] } }).sort({ date: -1 });
    
    // Fetch assignments for student's program/semester
    // For demo purposes, we fetch all
    const assignments = await Assignment.find().populate('teacherId', 'name');

    res.status(200).json({
      user,
      student: studentRecord,
      attendance,
      marks,
      fees,
      notices,
      assignments,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student profile', error: error.message });
  }
};

const getTeacherProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    let teacherRecord = await Teacher.findOne({ userId: user._id });
    if (!teacherRecord) {
      teacherRecord = new Teacher({ userId: user._id, name: `${user.firstname} ${user.lastname}`, email: user.email });
      await teacherRecord.save();
    }

    const notices = await Notice.find({ targetAudience: { $in: ['All', 'Teachers'] } }).sort({ date: -1 });
    const assignments = await Assignment.find({ teacherId: teacherRecord._id });

    // In a real app, we would fetch students associated with teacher's courses
    const allStudentsCount = await Student.countDocuments();

    res.status(200).json({
      user,
      teacher: teacherRecord,
      notices,
      assignments,
      stats: { totalStudents: allStudentsCount },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teacher profile', error: error.message });
  }
};

module.exports = { getStudentProfile, getTeacherProfile };
