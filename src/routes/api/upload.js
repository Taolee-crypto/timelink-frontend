// src/routes/api/upload.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadController } = require('../../controllers/upload.controller');

const upload = multer({ storage: multer.memoryStorage() });

// 파일 업로드
router.post('/upload', upload.single('file'), uploadController.uploadFile);

// TLF 변환 상태 확인
router.get('/convert/:jobId/status', uploadController.getConversionStatus);

// 업로드된 파일 목록
router.get('/files', uploadController.getUserFiles);

module.exports = router;
