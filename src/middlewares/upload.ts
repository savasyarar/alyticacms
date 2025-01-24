import multer from "multer";
import { Request } from "express";

// ram speicher
const storage = multer.memoryStorage();

// Filter für Datentypen
const fileFilter = (req: Request, file: any, cb: any)=> {
    const allowedFileTypes = [
        "image/jpg",
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/heif",
        "image/heic",
        "video/mp4", // Videos
        "video/quicktime", // MOV-Dateien (iPhone)
        "video/x-matroska", // MKV-Dateien
        "video/x-msvideo", // AVI-Dateien
        "video/x-ms-wmv", // WMV-Dateien
    ];

    if(allowedFileTypes.includes(file.mimetype)){
        cb(null, true);
    } else {
        cb(new Error('Ungültiger Dateityp, unterstützt werden nur Fotos und Videos'), false);
    }
}

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50 MB
    }
})