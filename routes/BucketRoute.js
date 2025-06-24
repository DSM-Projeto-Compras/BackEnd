import express from 'express';
import multer from 'multer';
import { getBucketByName, listBuckets, uploadFileToBucket, deleteFileFromBucket } from '../controllers/BucketsController.js';
import dotenv from 'dotenv';
import authAdmin from '../middlewares/authAdmin.js';
dotenv.config();

const router = express.Router();

router.get('/', listBuckets);

router.get('/:bucketName', authAdmin, getBucketByName);

// Configuração do multer para armazenar em memória
const upload = multer({ storage: multer.memoryStorage() });
router.post('/:bucketName/upload', authAdmin, upload.single('file'), uploadFileToBucket);

router.delete('/:bucketName/file/:fileName', authAdmin, deleteFileFromBucket);

export default router;