// @ imports
import { Request, Response } from 'express';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

// @ models
import newsModel from "../../models/News/newsModel";
import userModel from "../../models/User/userModel";
import {checkValidUser, sendErrorMessages, validFileUpload} from "../../utilis/basics";

// @ validation
import {newsValidation} from "../../utilis/validation/newsValidation";

// Erstelle eine Nachricht
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

        const coverPictureLink = await validFileUpload(req.file, res);

        if(!coverPictureLink) return;

        // ID erstellen
        const newsId = uuidv4();

        // Alles ok
        const create = await newsModel.create({
            id: newsId,
            userId: userId,
            title: value.title,
            coverPicture: coverPictureLink,
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

// Nachricht editieren
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

        if(value.coverPicture){
            const coverPictureLink = await validFileUpload(req.file, res);
            if(!coverPictureLink) return;

            // Neues Foto aktualisieren
            value.coverPicture = coverPictureLink;
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

// Nachricht anzeigen nach ID
export const handleGetNewsById = async(req: Request, res: Response): Promise<void> => {

    try {
        const newsId = req.params.id;

        if(!newsId){
            sendErrorMessages(res, 404, 'Es konnte kein Artikel gefunden werden');
            return;
        }

        const findNewsById = await newsModel.findOne({
            id: newsId,
            published: true
        });

        if(!findNewsById){
            sendErrorMessages(res, 404, 'Es konnte kein Artikel gefunden werden');
            return;
        }

        const newsCreatedAt = moment(findNewsById.createdAt).format('DD.MM.YYYY');
        const newsUpdatedAt = moment(findNewsById.updatedAt).format('DD.MM.YYYY');

        res.status(200).json({
            news: {
                id: newsId,
                title: findNewsById.title,
                coverPicture: findNewsById.coverPicture,
                content: findNewsById.content,
                category: findNewsById.category,
                createdAt: newsCreatedAt,
                updatedAt: newsUpdatedAt
            }
        })

    } catch(error){
        sendErrorMessages(res, 500, 'Interner Serverfehler');
        return;
    }
}

// Alle Nachrichten anzeigen
export const handleGetAllNews = async(req: Request, res: Response): Promise<void> => {
    try {

        const page: number = Math.max(parseInt(req.query.page as string) || 1, 1);
        const limit: number = 10;

        const totalCountAllNews = await newsModel.find({
            published: true
        }).countDocuments();

        if(totalCountAllNews === 0){
            sendErrorMessages(res, 400, 'Es konnten keine Artikel gefunden werden.');
            return;
        }

        // Maximaleseitenanzahl
        const totalPages = Math.ceil(totalCountAllNews / page);
        if(page > totalPages){
            sendErrorMessages(res, 404, 'Die angeforderte Seite existiert nicht.');
            return;
        }

        const findAllNews = await newsModel.find({
           published: true
        }).sort({
            createdAt: -1
        }).skip((page - 1) * limit).limit(limit);

        if(findAllNews.length === 0){
            sendErrorMessages(res, 404, 'Es konnten keine Artikel gefunden werden');
            return;
        }

        res.status(200).json({
            totalPages: totalPages,
            totalCountAllNews,
            page,
            limit,
            news: findAllNews
        });

    } catch(error){
        console.error('Fehler: ' + error);
        sendErrorMessages(res, 500, 'Interner Serverfehler');
    }
}

// die letzten 5 Nachrichten anzeigen
export const handleGetLastFiveNews = async(req: Request, res: Response): Promise<void> => {
    try {

        const lastNews = await newsModel.find({
            published: true
        }).sort({
            createdAt: -1
        }).limit(5);

        if(lastNews.length === 0){
            sendErrorMessages(res, 404, 'Es konnten keine Artikel gefunden werden');
            return;
        }

        const allNews = lastNews.map((news) => {

            const id = news.id;
            const formattedUpdate = moment(news.updatedAt).format('DD.MM.YYYY');
            const title = news.title.length > 65 ? news.title.slice(0,65) + '...' : news.title;
            const image = news.coverPicture;

            return {
                id: id,
                title: title,
                image: image,
                updatedAt: formattedUpdate
            }
        });

        res.status(200).json({
            news: allNews
        });

    } catch(error){
        console.error('Fehler: ' + error);
        sendErrorMessages(res, 500, 'Interner Serverfehler');
    }
}

