import { Response } from "express";

// @ models
import userModel from "../models/User/userModel";

// @ interfaces
import {IUser} from "../interfaces/IUser";

// @ types
import { Role } from "../@types/user";

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