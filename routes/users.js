var express = require('express');
var router = express.Router();
const models = require('../models/index');
const bcrypt = require('bcryptjs');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource users');
});

/**
 * Route untuk mengambil berdasarkan ID
 */
router.get('/:id', function(req, res, next) {

});

/**
 * Route untuk membuat baru
 */
router.post('/store', async function (req, res, next) {
  try {
    const { username, password, role_id } = req.body;
    
    // Enkripsi password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 adalah salt rounds

    // Simpan user dengan password yang terenkripsi
    const user = await models.users.create({
      username,
      password: hashedPassword,
      role_id,
    });

    res.status(201).json({
      status: 'OK',
      messages: 'User berhasil ditambahkan',
      data: user,
    });
  } catch (error) {
    console.error('Error:', error.message); // Debug log
    res.status(400).json({
      status: 'ERROR',
      messages: error.message,
    });
  }
});

/**
 * Route untuk mengupdate berdasarkan ID
 */
router.put('/:id', function(req, res, next) {
	  
});

/**
 * Route untuk menghapus berdasarkan ID
 */
router.delete('/:id', function(req, res, next) {
	  
});

module.exports = router;
