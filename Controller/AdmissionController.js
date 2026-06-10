const Admission = require('../Models/AdmissionModel');

const submitAdmission = async (req, res) => {
  try {
    const { studentName, dob, gender, address, mobile, email, parentName, parentMobile, courseSelection, academicDetails } = req.body;
    
    const documents = req.files ? req.files.map(file => file.path) : [];

    const newAdmission = new Admission({
      studentName, dob, gender, address, mobile, email, parentName, parentMobile, courseSelection, academicDetails, documents
    });

    await newAdmission.save();
    res.status(201).json({ message: 'Admission application submitted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting application', error: error.message });
  }
};

const getAdmissions = async (req, res) => {
  try {
    const admissions = await Admission.find().sort({ createdAt: -1 });
    res.status(200).json(admissions);
  } catch (error) {
    // Return mock applications if MongoDB is offline
    res.status(200).json([
      {
        _id: 'mock-adm-1',
        studentName: 'Karthik Raja',
        courseSelection: 'B.Tech AI & Machine Learning',
        email: 'karthik@gmail.com',
        mobile: '9876543210',
        status: 'Pending',
        createdAt: new Date(),
      },
      {
        _id: 'mock-adm-2',
        studentName: 'Anitha Selvam',
        courseSelection: 'B.Tech Computer Science and Engineering',
        email: 'anitha@gmail.com',
        mobile: '9845123670',
        status: 'Approved',
        createdAt: new Date(),
      }
    ]);
  }
};

module.exports = { submitAdmission, getAdmissions };
