const express = require('express');
const multer = require('multer');
const formsController = require('../controller/formsController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
});


router.post('/form', upload.single('resume'), formsController.create)
router.get('/form',  formsController.getAll)
router.get('/form/:id',  formsController.getById)
router.patch('/form/:id', upload.single('resume'), formsController.update)
router.delete('/form/:id', formsController.delete)

module.exports=  router




