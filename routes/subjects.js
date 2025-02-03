var express = require('express');
var router = express.Router();
const models = require('../models/index');

/* GET subjects listing. */
router.get('/', async function(req, res, next) {
  try {
    //mengambil semua data
    const subjects = await models.subjects.findAll({});
    
    if (subjects.length !== 0) {
      res.json({
        'status': 'OK',
        'messages': '',
        'data': subjects
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
    const subject = await models.subjects.findByPk(id);		
		
    if (subject) {
      res.json({
        'status': 'OK',
        'messages': '',
        'data': subject
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
    const { name, } = req.body;

    // Simpan subject dengan password yang terenkripsi
    const subject = await models.subjects.create({
      name,
    });

    res.status(201).json({
      status: 'OK',
      messages: 'Mata Pelajaran berhasil ditambahkan',
      data: subject,
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
      name,
    } = req.body
    
    const subject = models.subjects.update({
      name,
    }, {
      where: {
        id: id
      }
    })

    if (subject) {
      res.json({
        'status': 'OK',
        'messages': 'Mata Pelajaran berhasil diubah'
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
    const deletedRows = await models.subjects.destroy({
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
      messages: 'Mata Pelajaran berhasil dihapus'
    });
  } catch (err) {
    res.status(500).json({
      status: 'ERROR',
      messages: err.message
    });
  }  
});

module.exports = router;
