const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.json({ message: 'Backend is running' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

const userRoutes = require('./Routers/UserRouter');
const erpRoutes = require('./Routers/ERPRouter');
const adminRoutes = require('./Routers/AdminRouter');
const admissionRoutes = require('./Routers/AdmissionRouter');

app.use('/api/user', userRoutes);
app.use('/api/erp', erpRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admission', admissionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(async () => {
    console.log('MongoDB connected successfully');
    const { seedAll } = require('./Utils/seedDatabase');
    await seedAll();
  })
  .catch((err) => {
    console.error('MongoDB connection failed', err.message);
  }); 