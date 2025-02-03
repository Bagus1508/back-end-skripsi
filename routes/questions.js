var express = require('express');
var router = express.Router();
const models = require('../models/index');
const upload = require('../middleware/upload'); // Import middleware upload
const { Sequelize, where } = require('sequelize');

/* GET questions listing. */
router.get('/', async function(req, res, next) {
  try {
    //mengambil semua data
    const questions = await models.questions.findAll({
      attributes: [
        'id',
        'schedule_id',
        'question',
        'grade',
        'score',  
        [
          Sequelize.literal(`CONCAT('${req.protocol}://${req.get('host')}/uploads/', attachment)`),
          'attachment'
        ]
      ]
    });    
    
    if (questions.length !== 0) {
      res.json({
        'status': 'OK',
        'messages': 'Data Pertanyaan Berhasil Ditampilkan',
        'data': questions
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

    const questionData = await models.questions.findAll({
      where: {
        schedule_id: id,
      },
      attributes: [
        'id',
        'schedule_id',
        'question',
        'grade',
        'score',  
        [
          Sequelize.literal(`CONCAT('${req.protocol}://${req.get('host')}/uploads/', attachment)`),
          'attachment'
        ]
      ]
    });    	
    
    if (questionData) {
      res.json({
        'status': 'OK',
        'messages': 'Pertanyaan berhasil ditampilkan',
        'data': questionData
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
router.post('/store', upload.single('attachment'), async function (req, res, next) {
  try {
    const { 
      schedule_id,
      question,
      grade,
      score
    } = req.body;

    console.log(req.body);
    

    const schedules = await models.schedules.findByPk(req.body.schedule_id);
    if (!schedules) {
      return res.status(404).json({ status: 'ERROR', messages: 'Schedule tidak ditemukan' });
    }    

    // Cek apakah ada file yang diupload
    const attachment = req.file ? req.file.filename : null;

    // Simpan ke database
    const questionData = await models.questions.create({
      schedule_id,
      question,
      attachment, // Simpan nama file di database
      grade,
      score
    });

    res.status(201).json({
      status: 'OK',
      messages: 'Soal berhasil ditambahkan',
      data: {
        ...questionData.toJSON(),
        attachment_url: attachment ? `${req.protocol}://${req.get('host')}/uploads/${attachment}` : null
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
router.put('/update/:id', upload.single('attachment'), async function(req, res, next) {
  try {
    const id = req.params.id
    const fs = require('fs');
    const path = require('path');

    const {
      schedule_id,
      question,
      grade,
      score
    } = req.body

    // Cari data pertanyaan lama
    const oldQuestion = await models.questions.findByPk(id);
    if (!oldQuestion) {
      return res.status(404).json({ status: 'ERROR', messages: 'Soal tidak ditemukan' });
    }

    // Jika ada file lama, hapus dari sistem
    if (oldQuestion.attachment) {
      const oldFilePath = path.join(__dirname, '..', 'uploads', oldQuestion.attachment);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath); // Hapus file lama
      }
    }

    console.log(req.body);
    
    
    const schedules = await models.schedules.findByPk(req.body.schedule_id);
    
    if (!schedules) {
      return res.status(404).json({ status: 'ERROR', messages: 'Jadwal tidak ditemukan' });
    }    

    // Cek apakah ada file yang diupload
    const attachment = req.file ? req.file.filename : null;
    
    const questionData = models.questions.update({
      schedule_id,
      question,
      attachment, // Simpan nama file di database
      grade,
      score
    }, {
      where: {
        id: id
      }
    })

    const updatedQuestions = await models.questions.findOne({
      where: { id: id },
      include: [{ model: models.schedules, as: 'schedule_detail' }],
    });

    if (questionData) {
      res.json({
        'status': 'OK',
        'messages': 'Soal berhasil diubah',
        data: updatedQuestions,
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
    const deletedRows = await models.questions.destroy({
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
      messages: 'Soal berhasil dihapus'
    });
  } catch (err) {
    res.status(500).json({
      status: 'ERROR',
      messages: err.message
    });
  }  
});

module.exports = router;
