const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const multer = require('multer');

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import authRouter from './routes/auth';
import classRoomsRouter from './routes/classRooms';

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
  origin: 'http://localhost:5173', // Mengizinkan hanya dari origin ini
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Mengizinkan metode HTTP tertentu
  allowedHeaders: ['Content-Type', 'Authorization'], // Mengizinkan header tertentu
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

// Master - User
app.use('/api/users', usersRouter);

// Master - Class Room
app.use('/api/class-rooms', classRoomsRouter);

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