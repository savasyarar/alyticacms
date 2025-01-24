// @ imports
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

// @ models
import newsModel from "../../models/News/newsModel";
import userModel from "../../models/User/userModel";
import {checkValidUser, sendErrorMessages} from "../../utilis/basics";

// @ validation
import {newsValidation} from "../../utilis/validation/newsValidation";

// Erstelle eine Nachricht // Fotoupload fehlt
export const handleCreateNews = async(req: Request, res: Response): Promise<void> => {

    try {

        const userId = req.id;

        // Prüfe ob der Benuzter zugriff hat.
        await checkValidUser(userId!);

        const { error, value } = newsValidation.validate(req.body, {
            abortEarly: false
        });

        if(error){
            sendErrorMessages(res, 400, 'Validierungsfehler', error.details.map((err) => err.message));
            return;
        }

        // ID erstellen
        const newsId = uuidv4();

        // Alles ok
        const create = await newsModel.create({
            id: newsId,
            userId: userId,
            title: value.title,
            content: value.content,
            category: value.category,
            published: value.published
        });

        if(!create){
            sendErrorMessages(res, 400, 'Artikel konnte nicht erstellt werden');
            return;
        }

        res.status(200).json({
            message: 'Artikel wurde erfolgreich angelegt.'
        });

    } catch(error){
        console.error('Fehler: ' + error);
        sendErrorMessages(res, 500, 'Interner Serverfehler');
    }
}