var express = require('express');
var router = express.Router();
const models = require('../models/index');
const upload = require('../middleware/upload'); // Import middleware upload
const { Sequelize } = require('sequelize');  // Pastikan Sequelize diimpor

/* GET non_academic_reports listing. */
router.get('/', async function(req, res, next) {
  try {
    //mengambil semua data
    const non_academic_reports = await models.non_academic_reports.findAll({
      where: {
        ...req.query
      },
      attributes: [
        'id',
        'user_id',
        [Sequelize.literal('(SELECT name FROM user_details WHERE user_details.user_id = non_academic_reports.user_id LIMIT 1)'), 'student'],
        'subject_id',
        [Sequelize.literal('(SELECT name FROM subjects WHERE subjects.id = non_academic_reports.subject_id LIMIT 1)'), 'subject_desc'],
        'schedule_id',
        [Sequelize.literal('(SELECT name FROM schedules WHERE schedules.id = non_academic_reports.schedule_id LIMIT 1)'), 'schedule_desc'],
        'score',  
        'achievement',
        'status',  
        'created_at',
        'updated_at',
      ]
    });    
    
    if (non_academic_reports.length !== 0) {
      res.json({
        'status': 'OK',
        'messages': 'Data Nilai Non Akademik Berhasil Ditampilkan',
        'data': non_academic_reports
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
 * Route untuk mengambil berdasarkan Schedule ID
 */
router.get('/:id', async function(req, res, next) {
  try {	
    //mengangkap param ID
    const id = req.params.id;

    const nonAcademicReportData = await models.non_academic_reports.findAll({
      where: {
        schedule_id: id,
      },
      attributes: [
        'id',
        'user_id',
        'subject_id',
        'schedule_id',
        'score',  
        'achievement',
        'status',  
      ]
    });    	
    
    if (nonAcademicReportData) {
      res.json({
        'status': 'OK',
        'messages': 'Pertanyaan berhasil ditampilkan',
        'data': nonAcademicReportData
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
      id,
      user_id,
      subject_id,
      schedule_id,
      score,  
      achievement,
      status,  
    } = req.body;

    const schedules = await models.schedules.findByPk(req.body.schedule_id);
    if (!schedules) {
      return res.status(404).json({ status: 'ERROR', messages: 'Schedule tidak ditemukan' });
    }    
    const subjects = await models.subjects.findByPk(req.body.subject_id);
    if (!subjects) {
      return res.status(404).json({ status: 'ERROR', messages: 'Subject tidak ditemukan' });
    }    

    // Simpan ke database
    const nonAcademicReportData = await models.non_academic_reports.create({
      id,
      user_id,
      subject_id,
      schedule_id,
      score, 
      achievement, 
      status,
    });

    res.status(201).json({
      status: 'OK',
      messages: 'Nilai berhasil ditambahkan',
      data: {
        ...nonAcademicReportData.toJSON(),
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
    const id = req.params.id

    const {
      user_id,
      subject_id,
      schedule_id,
      score,  
      achievement,
      status,  
    } = req.body

    // Cari data pertanyaan lama
    const oldAcademicReport = await models.non_academic_reports.findByPk(id);
    if (!oldAcademicReport) {
      return res.status(404).json({ status: 'ERROR', messages: 'Nilai tidak ditemukan' });
    }
    
    const schedules = await models.schedules.findByPk(req.body.schedule_id);
    
    if (!schedules) {
      return res.status(404).json({ status: 'ERROR', messages: 'Jadwal tidak ditemukan' });
    }    

    // Cek apakah ada file yang diupload
    const attachment = req.file ? req.file.filename : null;
    
    const nonAcademicReportData = models.non_academic_reports.update({
      user_id,
      subject_id,
      schedule_id,
      score,  
      achievement,
      status,  
    }, {
      where: {
        id: id
      }
    })

    const updatednon_academic_reports = await models.non_academic_reports.findOne({
      where: { id: id },
    });

    if (nonAcademicReportData) {
      res.json({
        'status': 'OK',
        'messages': 'Nilai berhasil diubah',
        data: updatednon_academic_reports,
      })
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
    const deletedRows = await models.non_academic_reports.destroy({
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
      messages: 'Nilai berhasil dihapus'
    });
  } catch (err) {
    res.status(500).json({
      status: 'ERROR',
      messages: err.message
    });
  }  
});

module.exports = router;
