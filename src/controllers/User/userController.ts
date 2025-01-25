// @ import
import { Request, Response } from 'express';
import bcrypt  from "bcrypt";
import { userValidation } from "../../utilis/validation/userValidation";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

// @ import models
import userModel from "../../models/User/userModel";

// @ import utilis
import {checkValidUser, sendErrorMessages} from "../../utilis/basics";

// Token erstellen
const createToken = (id: string): string => {

    if(!process.env.secretKey){
        throw new Error('Der Secret Key existiert nicht.');
    }

    return jwt.sign({id}, process.env.secretKey, {
        expiresIn: "30d",
    });
}

// Benutzerlogin
export const handleUserLogin = async(req: Request, res: Response): Promise<void> => {
    try {

        const {
            email,
            password
        } = req.body;

        if(!email || !password){
            sendErrorMessages(res, 400, 'Bitte geben Sie Ihre E-Mail und Passwort ein.');
            return;
        }

        const validEmail = email.trim();
        const validPassword = password.trim();

        // Prüfen ob Benutzeremail existiert
        const findUser = await userModel.findOne({
            email: validEmail
        });

        if(!findUser){
            sendErrorMessages(res, 400, 'Ihre E-Mail und Passwort stimmen nicht überein.');
            return;
        }

        // Passwortcheck
        const comparePassword = await bcrypt.compare(validPassword, findUser.password);

        if(!comparePassword){
            sendErrorMessages(res, 400, 'Ihre E-Mail und Passwort stimmen nicht überein.');
            return;
        }

        // Token erstellen
        const token = createToken(findUser.id);

        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: true,
            maxAge: 30 * 24 * 60 * 1000,
        });

        // Ok
        res.status(200).json({
            token: token,
            message: 'Ihre Anmeldung war erfolgreich.'
        });

    } catch(error){
        console.error('Fehler: ' + error);
        sendErrorMessages(res, 500, 'Interner Serverfehler');
    }
}

// Benutzer anlegen
export const handleCreateUser = async(req: Request, res: Response): Promise<void> => {
    try {

        const user = req.id;

        if(!user){
            sendErrorMessages(res, 400, 'Benutzer ist nicht valide');
            return;
        }

        // Prüfe ob Benutzer existiert
        const existUser = await userModel.findOne({
            id: user
        }).select("_id id role");

        if(!existUser){
            sendErrorMessages(res, 404, 'Benutzer existiert nicht');
            return;
        }

        if(existUser.role !== 'administrator'){
            sendErrorMessages(res, 403, 'Sie haben keine Rechte diesen Benutzer anzulegen');
            return;
        }

        // Fehlermeldung
        const { error, value} = userValidation.validate(req.body, {
            abortEarly: false
        });

        if(error){
            sendErrorMessages(res, 400, 'Ihre Eingabe ist nicht valide', error.details.map((err) => err.message));
            return;
        }

        // Prüfe ob E-Mail existiert
        const findUser = await userModel.findOne({
            email: value.email
        });

        if(findUser){
            sendErrorMessages(res, 400, 'Dieser Benutzer existiert bereits.');
            return;
        }

        // Passwort hashen
        const hashedPassword = await bcrypt.hash(value.password, 10);

        // Generiere eine ID
        const userId = uuidv4();

        // Alles Ok
        const createUser = await userModel.create({
            id: userId,
            firstName: value.firstName,
            lastName: value.lastName,
            email: value.email,
            password: hashedPassword,
            role: value.role
        });


        res.status(201).json({
            message: 'Der Benutzer wurde erfolgreich angelegt.'
        });

    } catch(error){
        console.error('Fehler: ' + error);
        sendErrorMessages(res, 500, 'Interner Serverfehler');
    }
}

// Benutzer bearbeiten
export const handleEditUser = async(req: Request, res: Response): Promise<void> => {
    try {

        const userId = req.id;
        const user = await checkValidUser(userId!);

        // ID vom Benutzer welches editiert werden soll
        const editUserId = req.params.id;

        if(!editUserId){
            sendErrorMessages(res, 400, 'Benutzer ist nicht valide');
            return;
        }

        if(user.role !== 'administrator'){
            sendErrorMessages(res, 403, 'Sie dürfen diesen Benutzer nicht bearbeiten');
            return;
        }

        // Validierung
        const { error, value } = userValidation.validate(req.body, {
            abortEarly: false
        });

        if(error){
            sendErrorMessages(res, 400, 'Validierungsfehler', error.details.map((err) => err.message));
            return;
        }

        const updateUser = await userModel.findOneAndUpdate(
            { id: editUserId },
            { ...value },
            { new: true}
        );

        if(!updateUser){
            sendErrorMessages(res, 404, 'Benutzer konnte nicht gefunden und aktualisiert werden');
            return;
        }

        res.status(200).json({
            message: 'Benutzer wurde erfolgreich aktualisiert.'
        });

    } catch(error){
        console.error('Fehler: ' + error);
        sendErrorMessages(res, 500, 'Interner Serverfehler');
    }
}

// Benutzerverifizierung
export const handleVerifyUser = async(req: Request, res: Response): Promise<void> => {
    try {
        const user = req.id;

        if(!user){
            sendErrorMessages(res, 400, 'Benutzer ist nicht valide');
            return;
        }

        const findUser = await userModel.findOne({
            id: user
        }).select("id role firstName lastName email");

        if(!findUser){
            sendErrorMessages(res, 404, 'Benutzer konnte nicht gefunden werden');
            return;
        }
        res.status(200).json({
            user: findUser
        });
    } catch(error){
        console.error('Fehler: ' + error);
        sendErrorMessages(res, 500, 'Interner Serverfehler');
    }
}

// Benutzer löschen
export const handleDeleteUser = async(req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.id;
        await checkValidUser(userId!);

        // Benutzer ID
        const deleteUserId = req.params.id;

        if(!deleteUserId){
            sendErrorMessages(res, 400, 'Die Benutzer-ID ist erforderlich.');
            return;
        }

        if(userId === deleteUserId){
            sendErrorMessages(res, 400, 'Du kannst deinen eigenen Benutzeraccount nicht löschen');
            return;
        }

        const deleteUser = await userModel.findOneAndDelete({
            id: deleteUserId
        });

        if(!deleteUser){
            sendErrorMessages(res, 404, 'Der Benutzer konnte nicht gefunden werden.');
            return;
        }

        res.status(200).json({
            message: 'Der Benutzer wurde erfolgreich gelöscht.'
        });

    } catch(error){
        console.error('Fehler: ' + error);
        sendErrorMessages(res, 500, 'Interner Serverfehler');
    }
}

// Benutzer nach ID anzeigen
export const handleGetAllUser = async(req: Request, res: Response): Promise<void> => {
    try {
        const user = req.id;

        await checkValidUser(user!);

        const getUserId = req.params.id;

        if(!getUserId){
            sendErrorMessages(res, 400, 'Benutzer ist nicht valide');
            return;
        }

        const findUser = await userModel.findOne({
            id: getUserId
        }).select("id role firstName lastName email");

        if(!findUser){
            sendErrorMessages(res, 404, 'Benutzer konnte nicht gefunden werden');
            return;
        }
        res.status(200).json({
            user: findUser
        });
    } catch(error){
        console.error('Fehler: ' + error);
        sendErrorMessages(res, 500, 'Interner Serverfehler');
    }
}

// Alle Benutzer anzeigen
export const handleGetUserById = async(req: Request, res: Response): Promise<void> => {
    try {
        const user = req.id;

        await checkValidUser(user!);

        const getUserId = req.params.id;

        if(!getUserId){
            sendErrorMessages(res, 400, 'Benutzer ist nicht valide');
            return;
        }

        const findUser = await userModel.find().select("id role firstName lastName email");

        if(findUser.length === 0){
            sendErrorMessages(res, 404, 'Es konnten keine Benutzer gefunden werden');
            return;
        }
        res.status(200).json({
            user: findUser
        });

    } catch(error){
        console.error('Fehler: ' + error);
        sendErrorMessages(res, 500, 'Interner Serverfehler');
    }
}

// Erste Registrierung
export const handleRegisterFirstUser = async(req: Request, res: Response): Promise<void> => {
    try {
        // Fehlermeldung
        const { error, value} = userValidation.validate(req.body, {
            abortEarly: false
        });

        if(error){
            sendErrorMessages(res, 400, 'Ihre Eingabe ist nicht valide', error.details.map((err) => err.message));
            return;
        }

        // Prüfe ob E-Mail existiert
        const findUser = await userModel.findOne({
            email: value.email
        });

        if(findUser){
            sendErrorMessages(res, 400, 'Dieser Benutzer existiert bereits.');
            return;
        }

        // Passwort hashen
        const hashedPassword = await bcrypt.hash(value.password, 10);

        // Generiere eine ID
        const userId = uuidv4();

        // Alles Ok
        const createUser = await userModel.create({
            id: userId,
            firstName: value.firstName,
            lastName: value.lastName,
            email: value.email,
            password: hashedPassword,
            role: value.role
        });


        res.status(201).json({
            message: 'Der Benutzer wurde erfolgreich angelegt.'
        });

    } catch(error){
        console.error('Fehler: ' + error);
        sendErrorMessages(res, 500, 'Interner Serverfehler');
    }
}