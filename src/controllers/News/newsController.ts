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

        // Fehlermeldungen
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

        res.status(200).json({
            message: 'Artikel wurde erfolgreich angelegt.'
        });

    } catch(error){
        console.error('Fehler: ' + error);
        sendErrorMessages(res, 500, 'Interner Serverfehler');
    }
}

// Nachricht editieren - // Fotoupload fehlt
export const handleEditNews = async(req: Request, res: Response): Promise<void> => {
    try {

        const userId = req.id;

        await checkValidUser(userId!);

        const newsId = req.params.id;

        if(!newsId){
            sendErrorMessages(res, 400, 'Die Artikel ID ist nicht valide');
            return;
        }

        const { error, value } = newsValidation.validate(req.body, {
            abortEarly: false
        });

        if(error){
            sendErrorMessages(res, 400, 'Validierungsfehler');
            return;
        }

        const editNews = await newsModel.findOneAndUpdate(
            { id: newsId },
            { ...value },
            { new: true}
        );

        if(!editNews){
            sendErrorMessages(res, 400, 'Artikel konnte nicht aktualisiert werden');
            return;
        }

        res.status(200).json({
            message: 'Dieser Aritkel wurde erfolgreich aktualisiert.',
            data: editNews
        });

    } catch(error){
        console.error('Fehler: ' + error);
        sendErrorMessages(res, 500, 'Interner Serverfehler');
    }
}

// Nachricht löschen
export const handleDeleteNews = async(req: Request, res: Response): Promise<void> => {
    try {

        const userId = req.id;

        await checkValidUser(userId!);

        const newsId = req.params.id;

        if(!newsId){
            sendErrorMessages(res, 400, 'Die Artikel ID ist nicht valide');
            return;
        }

        const findNews = await newsModel.findOneAndDelete({
            id: newsId
        });

        if(!findNews){
            sendErrorMessages(res, 400, 'Dieser Artikel konnte nicht gelöscht werden');
            return;
        }

        res.status(204).send();

    } catch(error){
        console.error('Fehler: ' + error);
        sendErrorMessages(res, 500, 'Interner Serverfehler');
    }
}