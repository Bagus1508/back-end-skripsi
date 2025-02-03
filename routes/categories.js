var express = require('express');
var router = express.Router();
const models = require('../models/index');

/* GET categories listing. */
router.get('/', async function(req, res, next) {
  try {
    //mengambil semua data
    const categories = await models.categories.findAll({});
    
    if (categories.length !== 0) {
      res.json({
        'status': 'OK',
        'messages': '',
        'data': categories
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
    const category = await models.categories.findByPk(id);		
		
    if (category) {
      res.json({
        'status': 'OK',
        'messages': '',
        'data': category
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

    // Simpan category dengan password yang terenkripsi
    const category = await models.categories.create({
      name,
    });

    res.status(201).json({
      status: 'OK',
      messages: 'Kategori berhasil ditambahkan',
      data: category,
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
    
    const category = models.categories.update({
      name,
    }, {
      where: {
        id: id
      }
    })

    if (category) {
      res.json({
        'status': 'OK',
        'messages': 'Kategori berhasil diubah'
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
    const deletedRows = await models.categories.destroy({
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
      messages: 'Kategori berhasil dihapus'
    });
  } catch (err) {
    res.status(500).json({
      status: 'ERROR',
      messages: err.message
    });
  }  
});

module.exports = router;
