var express = require('express');
var router = express.Router();
const models = require('../models/index');
const { Sequelize } = require('sequelize');  // Pastikan Sequelize diimpor

/* GET schedules listing. */
router.get('/', async function(req, res, next) {
  try {
    //mengambil semua data
    const schedules = await models.schedules.findAll({
      where: {
        ...req.query
      },
      attributes:[
        'id',
        'name',
        'schedule_date',
        'start_date',
        'end_date',
        'start_time',
        'end_time',
        'status',
        'subject_id',
        [Sequelize.literal('(SELECT name FROM subjects WHERE subjects.id = schedules.subject_id LIMIT 1)'), 'subject_desc'],
        'user_id',
        [Sequelize.literal('(SELECT name FROM user_details WHERE user_details.user_id = schedules.user_id LIMIT 1)'), 'teacher'],
        'classes_id',
        [Sequelize.literal('(SELECT name FROM class_rooms WHERE class_rooms.id = schedules.classes_id LIMIT 1)'), 'classes_desc'],
        'category_id',
        [Sequelize.literal('(SELECT name FROM categories WHERE categories.id = schedules.category_id LIMIT 1)'), 'category_desc'],
      ],
    });
    
    if (schedules.length !== 0) {
      res.json({
        'status': 'OK',
        'messages': '',
        'data': schedules
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
      'messages': 'Internal Server Error'
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
    const schedule = await models.schedules.findByPk(id, {
      attributes:[
        'id',
        'schedule_date',
        'start_date',
        'end_date',
        'start_time',
        'end_time',
        'status',
        'subject_id',
        [Sequelize.literal('(SELECT name FROM subjects WHERE subjects.id = schedules.subject_id LIMIT 1)'), 'subject_desc'],
        'user_id',
        [Sequelize.literal('(SELECT name FROM user_details WHERE user_details.user_id = schedules.user_id LIMIT 1)'), 'teacher'],
        'classes_id',
        [Sequelize.literal('(SELECT name FROM class_rooms WHERE class_rooms.id = schedules.classes_id LIMIT 1)'), 'classes_desc'],
        'category_id',
        [Sequelize.literal('(SELECT name FROM categories WHERE categories.id = schedules.category_id LIMIT 1)'), 'category_desc'],
      ],
    });		
		
    if (schedule) {
      res.json({
        'status': 'OK',
        'messages': '',
        'data': schedule
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
      schedule_date,
      start_date,
      end_date,
      start_time,
      end_time,
      status,
      subject_id,
      user_id,
      classes_id,
      category_id,
     } = req.body;

    // Mapping foreign key dengan model
    const foreignKeys = {
      subject_id: models.subjects,
      user_id: models.users,
      classes_id: models.classRooms,
      category_id: models.categories,
    };

    // Cek semua foreign key secara paralel
    const checks = await Promise.all(
      Object.entries(foreignKeys).map(async ([key, model]) => {
        const exists = await model.findByPk(req.body[key]);
        return exists ? null : key;
      })
    );

    // Filter key yang tidak ditemukan
    const missingKeys = checks.filter(key => key !== null);

    // Jika ada yang tidak ditemukan, kembalikan error dengan pesan spesifik
    if (missingKeys.length > 0) {
      return res.status(400).json({
        status: 'ERROR',
        messages: `Validasi gagal: ${missingKeys.join(', ')} tidak ditemukan.`,
      });
    }
     
    // Simpan schedule dengan password yang terenkripsi
    const schedule = await models.schedules.create({
      schedule_date,
      start_date,
      end_date,
      start_time,
      end_time,
      status,
      subject_id,
      user_id,
      classes_id,
      category_id,
    });

    res.status(201).json({
      status: 'OK',
      messages: 'Jadwal berhasil ditambahkan',
      data: schedule,
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
    const id = req.params.id
    const {
      schedule_date,
      start_date,
      end_date,
      start_time,
      end_time,
      status,
      subject_id,
      user_id,
      classes_id,
      category_id,
    } = req.body
    
    const [updated] = await models.schedules.update({
      schedule_date,
      start_date,
      end_date,
      start_time,
      end_time,
      status,
      subject_id,
      user_id,
      classes_id,
      category_id,
    }, {
      where: { id: id }
    });
    
    // Jika ada perubahan, ambil ulang datanya
    if (updated) {
      const updatedSchedule = await models.schedules.findByPk(id);
      res.json({
        status: 'OK',
        messages: 'Jadwal berhasil diubah',
        data: updatedSchedule,
      });
    }
  } catch(err) {
    res.status(400).json({
      'status': 'ERROR',
      'messages': err.message
    })
  }
});


/**
 * Route untuk menghapus berdasarkan ID
 */
router.delete('/delete/:id', async function(req, res, next) {
  try {
    const id = req.params.id;
    const deletedRows = await models.schedules.destroy({
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
      messages: 'Jadwal berhasil dihapus'
    });
  } catch (err) {
    res.status(500).json({
      status: 'ERROR',
      messages: err.message
    });
  }  
});

module.exports = router;
