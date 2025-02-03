var express = require('express');
var router = express.Router();
const models = require('../models/index');
const upload = require('../middleware/upload'); // Import middleware upload
const { Sequelize, where } = require('sequelize');

/* GET answers listing. */
router.get('/', async function(req, res, next) {
  try {
    //mengambil semua data
    const answers = await models.answers.findAll({
      where: {
        ...req.query,
      },
      attributes: [
        'id',
        'question_id',
        'option',
        'description',
        'attachment',  
        'is_true_answer',  
        [
          Sequelize.literal(`CONCAT('${req.protocol}://${req.get('host')}/uploads/', attachment)`),
          'attachment'
        ]
      ]
    });    
    
    if (answers.length !== 0) {
      res.json({
        'status': 'OK',
        'messages': 'Data Jawaban Berhasil Ditampilkan',
        'data': answers
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

    const answersData = await models.answers.findAll({
      where: {
        question_id: id,
      },
      attributes: [
        'id',
        'question_id',
        'option',
        'description',
        'attachment',  
        'is_true_answer', 
        [
          Sequelize.literal(`CONCAT('${req.protocol}://${req.get('host')}/uploads/', attachment)`),
          'attachment'
        ]
      ]
    });    	
    
    if (answersData) {
      res.json({
        'status': 'OK',
        'messages': 'Jawaban berhasil ditampilkan',
        'data': answersData
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
      question_id,
      option,
      description,
      is_true_answer
    } = req.body;

    const questions = await models.questions.findByPk(req.body.question_id);
    if (!questions) {
      return res.status(404).json({ status: 'ERROR', messages: 'Pertanyaan tidak ditemukan' });
    }    

    // Cek apakah ada file yang diupload
    const attachment = req.file ? req.file.filename : null;

    // Simpan ke database
    const answersData = await models.answers.create({
      question_id,
      option,
      description,
      attachment, // Simpan nama file di database
      is_true_answer
    });

    res.status(201).json({
      status: 'OK',
      messages: 'Jawaban berhasil ditambahkan',
      data: {
        ...answersData.toJSON(),
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
      question_id,
      option,
      description,
      is_true_answer
    } = req.body

    // Cari data Jawaban lama
    const oldQuestion = await models.answers.findByPk(id);
    if (!oldQuestion) {
      return res.status(404).json({ status: 'ERROR', messages: 'Jawaban tidak ditemukan' });
    }

    // Jika ada file lama, hapus dari sistem
    if (oldQuestion.attachment) {
      const oldFilePath = path.join(__dirname, '..', 'uploads', oldQuestion.attachment);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath); // Hapus file lama
      }
    }

    const questions = await models.questions.findByPk(req.body.question_id);
    
    if (!questions) {
      return res.status(404).json({ status: 'ERROR', messages: 'Jadwal tidak ditemukan' });
    }    

    // Cek apakah ada file yang diupload
    const attachment = req.file ? req.file.filename : null;
    
    const answersData = models.answers.update({
      question_id,
      option,
      description,
      attachment, // Simpan nama file di database
      is_true_answer
    }, {
      where: {
        id: id
      }
    })

    const updatedanswers = await models.answers.findOne({
      where: { id: id },
    });

    if (answersData) {
      res.json({
        'status': 'OK',
        'messages': 'Jawaban berhasil diubah',
        data: updatedanswers,
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
    const deletedRows = await models.answers.destroy({
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
      messages: 'Jawaban berhasil dihapus'
    });
  } catch (err) {
    res.status(500).json({
      status: 'ERROR',
      messages: err.message
    });
  }  
});

module.exports = router;
