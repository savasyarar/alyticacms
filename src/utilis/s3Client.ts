import { S3Client } from "@aws-sdk/client-s3";

if(!process.env.s3accessKey || !process.env.s3secretKey || !process.env.AWS_ENDPOINT){
    throw new Error("Die Verbindungen zum S3 Server sind fehlgeschlagen");
}

const s3Client = new S3Client({
    endpoint: process.env.AWS_ENDPOINT,
    credentials: {
        accessKeyId: process.env.s3accessKey,
        secretAccessKey: process.env.s3secretKey,
    },
    region: process.env.AWS_REGION || 'eu-central-1',
    forcePathStyle: true,
});

export default s3Client;