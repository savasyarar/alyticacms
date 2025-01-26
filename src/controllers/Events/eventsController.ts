// @ imports
import { Request, Response } from "express";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

// @ import models
import eventsModel from "../../models/Events/eventsModel";
import {checkValidUser, sendErrorMessages} from "../../utilis/basics";
import eventsValidation from "../../utilis/validation/eventsValidation";



// Erstellen einer Veranstaltung
export const handleCreateEvent = async(req: Request, res: Response): Promise<void> => {
    try {

        const userId = req.id;

        // Validiere Nutzer
         await checkValidUser(userId!);

         const { error, value } = eventsValidation.validate(req.body, {
             abortEarly: false
         });

         if(error){
             sendErrorMessages(res, 400, 'Validierungsfehler', error.details.map((err) => err.message));
             console.log(error.details.map((err) => err.message));
             return;
         }

         // ID erstellen
        const eventsId = uuidv4();

         const create = await eventsModel.create({
            id: eventsId,
            name: value.name,
            description: value.description,
            date: value.date,
         });

         res.status(201).json({
             messages: 'Die Veranstaltung wurde erfolgreich angelegt.'
         });

    } catch(error){
        sendErrorMessages(res, 500, 'Interner Serverfehler');
        console.error('Fehlermeldung: ' + error);
    }
}

// Veranstaltung bearbeiten
export const handleUpdateEventById = async(req: Request, res: Response): Promise<void> => {
    try {

        const userId = req.id;
        await checkValidUser(userId!);

        // Veranstaltungs ID
        const {
            id
        } = req.params;

        if(!id){
            sendErrorMessages(res, 400, 'Die Veranstaltungs ID ist nicht valide');
            return;
        }

        const { error, value } = eventsValidation.validate(req.body, {
            abortEarly: false
        });

        if(error){
            sendErrorMessages(res, 400, 'Validierungsfehler', error.details.map((err) => err.message));
            return;
        }

        const update = await eventsModel.findOneAndUpdate(
            { id: id },
            { ...value},
            { new: true}
        );

        if(!update){
            sendErrorMessages(res, 400, 'Die Veranstaltung konnte nicht aktualisiert werden.');
            return;
        }

        res.status(200).json({
            message: 'Die Veranstaltung konnte aktualisiert werden.'
        });

    } catch(error){
        sendErrorMessages(res, 500, 'Interner Serverfehler');
        console.error('Fehlermeldung: ' + error);
    }
}

// Veranstaltung löschen
export const handleDeleteEvent = async(req: Request, res: Response): Promise<void> => {
    try {

        const userId = req.id;
        await checkValidUser(userId!);

        // Veranstaltungs ID
        const {
            id
        } = req.params;

        if(!id){
            sendErrorMessages(res, 400, 'Die Veranstaltungs ID ist nicht valide');
            return;
        }

        const deleteEvent = await eventsModel.findOneAndDelete({
            id: id
        });

        if(!deleteEvent){
            sendErrorMessages(res, 400, 'Die Veranstaltung konnte nicht gelöscht werden.');
            return;
        }

        res.status(200).json({
            message: 'Die Veranstaltung konnte erfolgreich gelöscht werden.'
        });

    } catch(error){
        sendErrorMessages(res, 500, 'Interner Serverfehler');
        console.error('Fehlermeldung: ' + error);
    }
}

// Alle Events aus diesem Jahr zeien
export const handleGetAllEventsFromThisYear = async(req: Request, res: Response): Promise<void> => {
    try {

        const startDate = new Date("2025-01-01T00:00:00.000Z");
        const endDate = new Date("2025-12-31T23:59:59.999Z");

        const allEvents = await eventsModel.find({
            date: {
                $gte: startDate,
                $lte: endDate
            }
        }).sort({
            createdAt: -1
        });

        if(allEvents.length === 0){
            sendErrorMessages(res, 440, 'Es konnten keine Veranstaltungen gefunden werden');
            return;
        }


        const events = allEvents.map((event, index) => {

            const formattedDate = moment(event.date).format('DD.MM.YYYY');

           return {
               id: event.id,
               name: event.name,
               description: event.description,
               date: formattedDate
           }
        });

        res.status(200).json({
            allEvents: events
        });

    } catch(error){
        sendErrorMessages(res, 500, 'Interner Serverfehler');
        console.error('Fehlermeldung: ' + error);
    }
}