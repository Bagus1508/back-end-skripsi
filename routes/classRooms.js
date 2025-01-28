var express = require('express');
var router = express.Router();
const models = require('../models/index');

/* GET classRooms listing. */
router.get('/', async function(req, res, next) {
  try {
    //mengambil semua data
    const classRooms = await models.classRooms.findAll({});
    
    if (classRooms.length !== 0) {
      res.json({
        'status': 'OK',
        'messages': '',
        'data': classRooms
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
    const classRoom = await models.classRooms.findByPk(id);		
		
    if (classRoom) {
      res.json({
        'status': 'OK',
        'messages': '',
        'data': classRoom
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

    // Simpan classRoom dengan password yang terenkripsi
    const classRoom = await models.classRooms.create({
      name,
    });

    res.status(201).json({
      status: 'OK',
      messages: 'Kelas berhasil ditambahkan',
      data: classRoom,
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
    
    const classRoom = models.classRooms.update({
      name,
    }, {
      where: {
        id: id
      }
    })

    if (classRoom) {
      res.json({
        'status': 'OK',
        'messages': 'Kelas berhasil diubah'
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
router.delete('/delete/:id', function(req, res, next) {
  try {
    const id = req.params.id
    const classRoom = models.classRooms.destroy({
      where: {
        id: id
      }
    })

    if (classRoom) {
      res.json({
        'status': 'OK',
        'messages': 'Kelas berhasil dihapus'
      })
    }
  } catch(err) {
    res.status(400).json({
      'status': 'ERROR',
      'messages': err.message
    })
  }
});

module.exports = router;
