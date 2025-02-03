var express = require('express');
var router = express.Router();
const models = require('../models/index');
const bcrypt = require('bcryptjs');
const { Sequelize } = require('sequelize');  // Pastikan Sequelize diimpor

/* GET users listing. */
router.get('/', async function(req, res, next) {
  try {
    //mengambil semua data
    const users = await models.users.findAll({
      attributes: [
        'id',
        'username',
        'role_id',
        [Sequelize.literal('(SELECT code FROM roles WHERE roles.id = users.role_id LIMIT 1)'), 'role'],
        [Sequelize.fn('DATE_FORMAT', Sequelize.col('users.created_at'), '%Y-%m-%d'), 'created_at'],
        [Sequelize.fn('DATE_FORMAT', Sequelize.col('users.updated_at'), '%Y-%m-%d'), 'updated_at'],
      ],
      include: [
        {
          model: models.userDetails,  // Mengambil data userDetails terkait
          as: 'userDetails',          // Jika sudah ada alias, misal 'userDetails'
          attributes: [
            'name',
            'email',
            [Sequelize.fn('DATE_FORMAT', Sequelize.col('userDetails.created_at'), '%Y-%m-%d'), 'created_at'],  // Alias untuk userDetails.created_at
            [Sequelize.fn('DATE_FORMAT', Sequelize.col('userDetails.updated_at'), '%Y-%m-%d'), 'updated_at']  // Alias untuk userDetails.updated_at
          ],
        }
      ]
    });
    
    if (users.length !== 0) {
      res.json({
        'status': 'OK',
        'messages': 'Get data success',
        'data': users
      });
    } else {
      res.json({
        'status': 'EMPTY',
        'messages': 'Data is empty',
        'data': {} 
      });
    }
  } catch (err) {
    res.status(500).json({
      'status': 'ERROR',
      'messages': err.message
    })
  }
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
    const { username, password, role_id, name, email } = req.body;
    
    // Enkripsi password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Simpan user dengan password yang terenkripsi
    const user = await models.users.create({
      username,
      password: hashedPassword,
      role_id,
    });

    const detailUser = await models.userDetails.create({
      user_id: user.id,
      name,
      email,
    });

    res.status(201).json({
      status: 'OK',
      messages: 'User berhasil ditambahkan',
      data: [user,detailUser],
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
