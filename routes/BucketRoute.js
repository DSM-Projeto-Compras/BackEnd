import express from 'express';
import multer from 'multer';
import { getBucketByName, listBuckets, uploadFileToBucket, deleteFileFromBucket } from '../controllers/BucketsController.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.get('/buckets', listBuckets);

router.get('/buckets/:bucketName', getBucketByName);

// Configuração do multer para armazenar em memória
const upload = multer({ storage: multer.memoryStorage() });
router.post('/buckets/:bucketName/upload', upload.single('file'), uploadFileToBucket);

router.delete('/buckets/:bucketName/file/:fileName', deleteFileFromBucket);

export default router;