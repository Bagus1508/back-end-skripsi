var express = require('express');
var router = express.Router();
const models = require('../models/index');

/* GET roles listing. */
router.get('/', async function(req, res, next) {
  try {
    //mengambil semua data
    const roles = await models.roles.findAll({});
    
    if (roles.length !== 0) {
      res.json({
        'status': 'OK',
        'messages': '',
        'data': roles
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
    const role = await models.roles.findByPk(id);		
		
    if (role) {
      res.json({
        'status': 'OK',
        'messages': '',
        'data': role
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
    const { name,code, } = req.body;

    // Simpan role dengan password yang terenkripsi
    const role = await models.roles.create({
      name,
      code,
    });

    res.status(201).json({
      status: 'OK',
      messages: 'Hak Akses berhasil ditambahkan',
      data: role,
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
      code,
    } = req.body
    
    const role = models.roles.update({
      name,
      code,
    }, {
      where: {
        id: id
      }
    })

    if (role) {
      res.json({
        'status': 'OK',
        'messages': 'Hak Akses berhasil diubah'
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
    const deletedRows = await models.roles.destroy({
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
      messages: 'Hak Akses berhasil dihapus'
    });
  } catch (err) {
    res.status(500).json({
      status: 'ERROR',
      messages: err.message
    });
  }  
});

module.exports = router;
