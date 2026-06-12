const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../Models/UserModel');
const Student = require('../Models/StudentModel');
const Teacher = require('../Models/TeacherModel');
const Attendance = require('../Models/AttendanceModel');
const Marks = require('../Models/MarksModel');
const Fee = require('../Models/FeeModel');
const Notice = require('../Models/NoticeModel');

const seedAll = async () => {
  try {
    console.log('Starting optimized database seeding...');

    // 1. Seed Admin
    const adminEmail = 'suryasekar626@gmail.com';
    const adminExists = await User.findOne({ email: adminEmail });
    const adminHashedPassword = await bcrypt.hash('surya@123', 12);
    if (!adminExists) {
      const admin = new User({
        firstname: 'Surya',
        lastname: 'Sekar',
        email: adminEmail,
        password: adminHashedPassword,
        role: 'admin',
      });
      await admin.save();
      console.log('Seeded Admin account successfully.');
    } else {
      adminExists.password = adminHashedPassword;
      adminExists.role = 'admin';
      await adminExists.save();
      console.log('Admin password updated successfully.');
    }

    // Check if we already have student or teacher records in the database
    const studentCount = await Student.countDocuments();
    const teacherCount = await Teacher.countDocuments();
    if (studentCount > 0 || teacherCount > 0) {
      console.log('Database already contains student or teacher records. Skipping mock seeding to preserve modifications.');
      return;
    }

    // 2. Clear old mock records
    console.log('Clearing old mock records from all collections...');
    await Student.deleteMany({ email: /@bullsworth\.edu$/i });
    await Teacher.deleteMany({ email: /@bullsworth\.edu$/i });
    await User.deleteMany({ email: /@bullsworth\.edu$/i });
    await Attendance.deleteMany({});
    await Marks.deleteMany({});
    await Fee.deleteMany({});
    console.log('Cleared all mock database records successfully.');

    // Initialize arrays for bulk insert
    const usersToInsert = [];
    const studentsToInsert = [];
    const attendanceToInsert = [];
    const marksToInsert = [];
    const feesToInsert = [];
    const teachersToInsert = [];

    // 3. Prepare Students Data (24CS001 to 24CS020)
    console.log('Preparing student accounts...');
    const studentHashedPassword = await bcrypt.hash('student123', 12);
    for (let i = 1; i <= 20; i++) {
      const rollNo = `24CS${String(i).padStart(3, '0')}`;
      const email = `${rollNo.toLowerCase()}@bullsworth.edu`;

      const userId = new mongoose.Types.ObjectId();
      const studentId = new mongoose.Types.ObjectId();

      usersToInsert.push({
        _id: userId,
        firstname: 'Student',
        lastname: `Name ${i}`,
        email,
        phone: `987654${String(i).padStart(4, '0')}`,
        password: studentHashedPassword,
        role: 'student',
        status: 'Active',
      });

      studentsToInsert.push({
        _id: studentId,
        userId,
        name: `Student Name ${i}`,
        email,
        program: 'B.Tech Computer Science & Engineering',
        semester: 2,
        status: 'Active',
      });

      // Prepare attendance (40 records per student)
      const attendancePct = 82 + (i % 13);
      const totalCount = 40;
      const presentCount = Math.round((attendancePct / 100) * totalCount);
      
      for (let dayOffset = 0; dayOffset < totalCount; dayOffset++) {
        const status = dayOffset < presentCount ? 'Present' : 'Absent';
        const date = new Date(Date.now() - dayOffset * 24 * 60 * 60 * 1000);
        
        attendanceToInsert.push({
          studentId,
          subject: 'Data Structures',
          date,
          status,
        });
      }

      // Prepare marks (3 subjects per student)
      const subjects = [
        { name: 'Data Structures', score: 75 + (i % 20) },
        { name: 'Digital Electronics', score: 80 + (i % 15) },
        { name: 'Discrete Mathematics', score: 70 + (i % 25) }
      ];

      for (const sub of subjects) {
        const grade = sub.score >= 90 ? 'O' : sub.score >= 80 ? 'A+' : sub.score >= 70 ? 'A' : sub.score >= 60 ? 'B' : 'Pass';
        marksToInsert.push({
          studentId,
          semester: 2,
          subject: sub.name,
          totalMarks: sub.score,
          grade,
        });
      }

      // Prepare fees
      const pendingBalance = 25000 + (i * 500);
      feesToInsert.push({
        studentId,
        totalFee: 120000,
        paidAmount: 120000 - pendingBalance,
        pendingBalance,
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      });
    }

    // 4. Prepare Teachers Data (BWC001 to BWC010)
    console.log('Preparing teacher accounts...');
    const teacherHashedPassword = await bcrypt.hash('teacher123', 12);
    for (let i = 1; i <= 10; i++) {
      const staffId = `BWC${String(i).padStart(3, '0')}`;
      const email = `${staffId.toLowerCase()}@bullsworth.edu`;

      const userId = new mongoose.Types.ObjectId();
      const teacherId = new mongoose.Types.ObjectId();

      usersToInsert.push({
        _id: userId,
        firstname: 'Faculty',
        lastname: `Member ${i}`,
        email,
        phone: `987655${String(i).padStart(4, '0')}`,
        password: teacherHashedPassword,
        role: 'teacher',
        status: 'Active',
      });

      teachersToInsert.push({
        _id: teacherId,
        userId,
        name: `Faculty Member ${i}`,
        email,
        department: 'Computer Science and Engineering',
        timetable: [
          { day: 'Monday', slot1: 'Data Structures', slot2: 'Lab Session 1', slot3: 'Office Hours' },
          { day: 'Tuesday', slot1: 'Digital Design', slot2: 'Research Review', slot3: 'Project Mentoring' }
        ],
        status: 'Active',
        classCount: 60 + i,
      });
    }

    // 5. Execute Bulk Insertions
    console.log('Executing bulk writes to MongoDB Atlas...');
    if (usersToInsert.length > 0) await User.insertMany(usersToInsert);
    if (studentsToInsert.length > 0) await Student.insertMany(studentsToInsert);
    if (teachersToInsert.length > 0) await Teacher.insertMany(teachersToInsert);
    if (attendanceToInsert.length > 0) await Attendance.insertMany(attendanceToInsert);
    if (marksToInsert.length > 0) await Marks.insertMany(marksToInsert);
    if (feesToInsert.length > 0) await Fee.insertMany(feesToInsert);
    console.log('Bulk writes completed.');

    // 6. Seed Notices if none exist
    const noticeCount = await Notice.countDocuments();
    if (noticeCount === 0) {
      console.log('Seeding campus notices...');
      const notices = [
        {
          title: 'End Semester Exams',
          content: 'The end semester exams will commence from June 15th. Please collect your hall tickets.',
          author: 'Office of the Controller of Examinations',
          targetAudience: 'All',
        },
        {
          title: 'Fees Submission Deadline',
          content: 'Last date for submission of outstanding semester fees is June 12th to avoid late fine.',
          author: 'Accounts Department',
          targetAudience: 'Students',
        },
        {
          title: 'Faculty Strategy Meeting',
          content: 'A general faculty meeting is scheduled for Wednesday at 3:00 PM in the main seminar hall to discuss next semester curriculum.',
          author: 'Principal Office',
          targetAudience: 'Teachers',
        }
      ];
      await Notice.insertMany(notices);
      console.log('Notices seeded successfully.');
    }

    console.log('✅ Database Seeding finished successfully!');
  } catch (error) {
    console.error('❌ Database Seeding error:', error.message);
  }
};

// If run directly
if (require.main === module) {
  require('dotenv').config();
  mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
      await seedAll();
      process.exit(0);
    })
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { seedAll };
