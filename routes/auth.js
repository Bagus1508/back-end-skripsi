var express = require('express');
var router = express.Router();
const models = require('../models/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Ganti dengan secret key Anda yang lebih aman
const JWT_SECRET = 'your_secret_key';

router.post('/login', async function (req, res, next) {
    try {
        const { username, password } = req.body;

        // Cari user berdasarkan username
        const user = await models.users.findOne({
        where: { username }
        });

        if (!user) {
        return res.status(400).json({
            status: 'ERROR',
            messages: 'Username tidak ditemukan',
        });
        }

        // Verifikasi password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
        return res.status(400).json({
            status: 'ERROR',
            messages: 'Password salah',
        });
        }

        // Membuat JWT Token
        const payload = {
        id: user.id,
        username: user.username,
        role_id: user.role_id,
        };

        // Generate token, valid untuk 1 jam
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
        status: 'OK',
        messages: 'Login berhasil',
        data: {
            "username": user.username,
            "role_id": user.role_id,
            token,  // Kirimkan token dalam response
        },
        });
    } catch (error) {
            console.error('Error:', error.message);
            res.status(500).json({
            status: 'ERROR',
            messages: 'Terjadi kesalahan saat login',
            });
    }
});


module.exports = router;
