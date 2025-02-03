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
      where: {
        role_id:2,
      },
      attributes: [
        'id',
        'username',
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
            'classes',
            'email',
            'number_id',
            'subject_id',
            [Sequelize.literal('(SELECT name FROM subjects WHERE subjects.id = userDetails.subject_id LIMIT 1)'), 'subject_desc'],
            'email',
            'gender',
            'birth_date',
            'birth_place',
            'age',
            'phone_number',
            'status',
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
router.get('/:id', async function(req, res, next) {
  try {			
    //mengangkap param ID
    const id = req.params.id;
    const user = await models.users.findByPk(id, {
      attributes: [
        'id',
        'username',
        [Sequelize.literal('(SELECT code FROM roles WHERE roles.id = users.role_id LIMIT 1)'), 'role'],
        [Sequelize.fn('DATE_FORMAT', Sequelize.col('users.created_at'), '%Y-%m-%d'), 'created_at'],
        [Sequelize.fn('DATE_FORMAT', Sequelize.col('users.updated_at'), '%Y-%m-%d'), 'updated_at'],
      ],
      include: [
        {
          model: models.userDetails,  // Mengambil data userDetails terkait
          as: 'userDetails',          // Jika sudah ada alias, misal 'userDetails'
          attributes: [
            'user_id',
            'number_id',
            'name',
            'subject_id',
            'email',
            'gender',
            'birth_date',
            'birth_place',
            'age',
            'phone_number',
            'status',
            [Sequelize.fn('DATE_FORMAT', Sequelize.col('userDetails.created_at'), '%Y-%m-%d'), 'created_at'],  // Alias untuk userDetails.created_at
            [Sequelize.fn('DATE_FORMAT', Sequelize.col('userDetails.updated_at'), '%Y-%m-%d'), 'updated_at']  // Alias untuk userDetails.updated_at
          ],
        }
      ]
    });		
    
    if (user) {
      res.json({
        'status': 'OK',
        'messages': '',
        'data': user
      });
    } else {
      res.status(404).json({
        'status': 'NOT_FOUND',
        'messages': 'Data not found',
        'data': null 
      });
    }
  } catch (err) {		
    res.status(500).json({
      'status': 'ERROR',
      'messages': 'Internal Server Error'
    })
  }
});

/**
 * Route untuk membuat baru
 */
router.post('/store', async function (req, res, next) {
  try {
    const { 
      number_id,
      name,
      classes,
      subject_id,
      email,
      gender,
      birth_date,
      birth_place,
      age,
      phone_number,
      status,
      username,
      password,
      role_id,
    } = req.body;
    
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
      number_id,
      name,
      classes,
      subject_id,
      email,
      gender,
      birth_date,
      birth_place,
      age,
      phone_number,
      status,
    });

    res.status(201).json({
      status: 'OK',
      messages: 'Guru berhasil ditambahkan',
      data: {
        user: user,
        detail_user: detailUser
      }      
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
router.put('/update/:id', async function(req, res, next) {
  try {
    const id = req.params.id;
    const { 
      number_id,
      name,
      classes,
      subject_id,
      email,
      gender,
      birth_date,
      birth_place,
      age,
      phone_number,
      status,
      username,
      password,
      role_id,
    } = req.body;

    // Cek apakah user dengan ID tersebut ada
    const existingUser = await models.users.findByPk(id);
    if (!existingUser) {
      return res.status(404).json({ status: 'ERROR', messages: 'User tidak ditemukan' });
    }
  
    // Enkripsi password hanya jika ada perubahan password
    let hashedPassword = existingUser.password; // Default tetap password lama
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
  
    // Update tabel users
    await models.users.update(
      { username, password: hashedPassword, role_id },
      { where: { id: id } }
    );
  
    // Update tabel userDetails
    await models.userDetails.update(
      {
        number_id,
        name,
        classes,
        subject_id,
        email,
        gender,
        birth_date,
        birth_place,
        age,
        phone_number,
        status,
      },
      { where: { user_id: id } }
    );
  
    // Ambil data terbaru setelah update
    const updatedUser = await models.users.findOne({
      where: { id: id },
      include: [{ model: models.userDetails, as: 'userDetails' }],
    });

    res.status(201).json({
      status: 'OK',
      messages: 'Data Guru berhasil diubah',
      data: updatedUser
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
 * Route untuk menghapus berdasarkan ID
 */
router.delete('/delete/:id', async function(req, res, next) {
  try {
    const id = req.params.id;
    const deletedRows = await models.users.destroy({
      where: {
        id: id
      }
    });
  
    if (deletedRows === 0) {
      return res.status(404).json({
        status: 'ERROR',
        messages: 'Data tidak ditemukan'
      });
    }
  
    res.json({
      status: 'OK',
      messages: 'Data Guru berhasil dihapus'
    });
  } catch (err) {
    res.status(500).json({
      status: 'ERROR',
      messages: err.message
    });
  }  
});

module.exports = router;
