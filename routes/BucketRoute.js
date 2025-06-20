import express from 'express';
import multer from 'multer';
import { getBucketByName, listBuckets, uploadFileToBucket, deleteFileFromBucket } from '../controllers/BucketsController';

const router = express.Router();

router.get('/buckets', listBuckets);

app.get('/buckets/:bucketName', getBucketByName);

// Configuração do multer para armazenar em memória
const upload = multer({ storage: multer.memoryStorage() });
app.post('/buckets/:bucketName/upload', upload.single('file'), uploadFileToBucket);

app.delete('/buckets/:bucketName/file/:fileName', deleteFileFromBucket);

export default router;