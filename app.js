const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const multer = require('multer');

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import teachersRouter from './routes/teachers';
import studentsRouter from './routes/students';
import authRouter from './routes/auth';
import classRoomsRouter from './routes/classRooms';
import subjects from './routes/subjects';
import schedules from './routes/schedules';
import categories from './routes/categories';
import roles from './routes/roles';
import questionsRouter from './routes/questions';
import answersRouter from './routes/answers';
import academicReportsRouter from './routes/academicReports';
import nonAcademicReportsRouter from './routes/nonAcademicReports';

// Konfigurasi penyimpanan file jika diperlukan
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Tentukan folder penyimpanan
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nama file unik
  }
});

const app = express();
const upload = multer({ storage: storage });

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware
app.use(logger('dev'));
app.use(express.json()); // Untuk menangani JSON
app.use(express.urlencoded({ extended: true })); // Untuk menangani form-data
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Rute
app.use('/', indexRouter);

// Auth
app.use('/api/auth', authRouter);

// Assestment Data
app.use('/api/questions', questionsRouter);
app.use('/api/answers', answersRouter);

// Learning Report
app.use('/api/academic-reports', academicReportsRouter);
app.use('/api/non-academic-reports', nonAcademicReportsRouter);

// Master
app.use('/api/users', usersRouter);
app.use('/api/students', studentsRouter);
app.use('/api/teachers', teachersRouter);
app.use('/api/class-rooms', classRoomsRouter);
app.use('/api/subjects', subjects);
app.use('/api/schedules', schedules);
app.use('/api/categories', categories);
app.use('/api/roles', roles);

//Uploads
app.use('/uploads', express.static('uploads'));

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({
    status: 'ERROR',
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;