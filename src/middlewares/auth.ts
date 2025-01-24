// @ imports
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import {sendErrorMessages} from "../utilis/basics";

export const auth = async(req: Request, res: Response, next: NextFunction): Promise<void> => {

    const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];

    if(!token){
        sendErrorMessages(res, 401, 'Unauthorized');
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.secretKey!) as { id: string};
        req.id = decoded.id;
        next();

    } catch(error){
        console.error('Fehler: ' + error);
        sendErrorMessages(res, 500, 'Interner Serverfehler');
    }

}