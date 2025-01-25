import { Response } from "express";
import { PutObjectCommand, S3Client, PutObjectCommandInput } from "@aws-sdk/client-s3";
import s3Client from "./s3Client";

// @ models
import userModel from "../models/User/userModel";

// @ interfaces
import {IUser} from "../interfaces/IUser";

// @ types
import { Role } from "../@types/user";
import {Multer} from "multer";

// Fehlermeldungen
export const sendErrorMessages = (res: Response, status: number, message: string, errors?: string[]): void  => {
    res.status(status).json({
        message,
        errors
    });
}

// Prüfen ob Benutzer valide ist
export const checkValidUser = async(id: string, requiredRole?: Role): Promise<IUser> => {

    if(!id){
        throw new Error ("Der Benutzer ist nicht valide.");
    }

    // Prüfe ob Benutzer existiert
    const user = await userModel.findOne({
        id: id
    }).select("_id id firstName lastName email role");

    if (!user){
        throw new Error('Dieser Benutzer existiert nicht');
    }

    // Prüfe ob der Benutzer eine Rechte hat
    if(requiredRole && user.role !== requiredRole){
        throw new Error('Sie haben keine nötigen Rechte um diese Aktion durchzuführen');
    }

    return user;
}

// Validiere den Upload
export const validFileUpload = async(file: Express.Multer.File | undefined, res: Response): Promise<string|undefined> => {

    // Prüfen ob Foto hochgeladen wurde
    if(!file){
        sendErrorMessages(res, 400, 'Sie müssen ein Titelbild hochladen');
        return;
    }

    const allowedFileTypes: string[] = [
        "image/jpg",
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/heif",
        "image/heic",
    ];

    // Prüfe ob Datei ein Foto ist
    if(!allowedFileTypes.includes(file.mimetype)){
        sendErrorMessages(res, 400, 'Sie dürfen nur Bilder hochladen');
        return;
    }

    try {

        const s3Params: PutObjectCommandInput = {
            Bucket: 'alytica',
            Key: `${Date.now()}_${file.originalname}`, // Erstelle einen eindeutigen Dateinamen
            Body: file.buffer, // Dateiinhalt aus dem Memory Storage
            ContentType: file.mimetype,
            ACL: 'public-read',
        };

        const command = new PutObjectCommand(s3Params);
        await s3Client.send(command);

        return `${process.env.AWS_ENDPOINT}/alytica/${s3Params.Key}`;

    } catch(error){
        console.error('Fehler: ' + error);
        sendErrorMessages(res, 400, 'Interner Serverfehler');
    }
}