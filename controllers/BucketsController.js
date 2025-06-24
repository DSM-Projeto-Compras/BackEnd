import AWS from 'aws-sdk';
AWS.config.update({
  region: process.env.REGION,
  //accessKeyId: process.env.ACCESS_KEY_ID,
  //secretAccessKey: process.env.SECRET_ACCESS_KEY,
  //sessionToken: process.env.SESSION_TOKEN
});

const s3 = new AWS.S3();

import dotenv from 'dotenv';
dotenv.config();

import { logInfo, logError } from "../logger.js";


export const listBuckets = async (req, res) => {

    const bucketsPermitidos = ['projetocompras-dsm-prod', 'projetocompras-dsm-hml']

    try {
        const data = await s3.listBuckets().promise();
        const bucketsFiltrados = data.Buckets.filter(bucket => bucketsPermitidos.includes(bucket.Name));
        logInfo('Buckets encontrados', req, bucketsFiltrados);
        res.status(200).json(bucketsFiltrados);
    } catch (error) {
        logError("Erro ao buscar buckets", req, error);
        res.status(500).json({ error: 'Erro ao listar buckets', details: error });
    }
}

export const getBucketByName = async (req, res) => {
    const { bucketName } = req.params;
    const params = {
        Bucket: bucketName,
    };
    
    try {
        const data = await s3.listObjectsV2(params).promise();
        logInfo('Objetos encontrados', req, data.Contents);
        res.status(200).json(data.Contents);
    } catch (error) {
        logError("Erro ao buscar objetos", req, error);
        res.status(500).json({ error: 'Erro ao listar objetos do bucket', details: error });
    }
}


export const uploadFileToBucket = async (req, res) => {
    const { bucketName } = req.params;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
    }

    const params = {
        Bucket: bucketName,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
    };
    try {
        const data = await s3.upload(params).promise();
        logInfo('Upload efetuado', req, data);
        res.status(200).json({ message: 'Upload concluído com sucesso', data });
    } catch (error) {
        logError('Erro ao efetuar upload', req, error);
        res.status(500).json({ message: 'Erro no upload', error: error.message });
    }
}

export const deleteFileFromBucket = async (req, res) => {
    try {
        const { bucketName, fileName } = req.params;
        const data = await s3.deleteObject({ Bucket: bucketName, Key: fileName }).promise();
        logInfo('Objeto removido', req, data.Buckets);
        res.status(200).json({ message: 'Objeto removido com sucesso', data });
    } catch (error) {
        logError("Erro ao remover objeto", req, error);
        res.status(500).json({ error: 'Erro ao remover objeto do bucket', details: error });
    }
}