// @ imports
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";


// @ imports model
import newsletterModel from "../../models/Newsletter/newsletterModel";

// @ validation
import {newsletterValidation} from "../../utilis/validation/newsletterValidation";
import {sendErrorMessages} from "../../utilis/basics";
import {newsValidation} from "../../utilis/validation/newsValidation";

// Trage dich in den Newsletter ein // E-Mail bestätigung fehlt
export const handleSignNewsletter = async(req: Request, res: Response): Promise<void> => {

    try {

        const { error, value } = newsValidation.validate(req.body, {
            abortEarly: false
        });

        if(error){
            sendErrorMessages(res, 400, 'Validierunsfehler', error.details.map((err) => err.message));
            return;
        }

        // Prüfe ob E-Mail bereits existiert
        const findMail = await newsletterModel.findOne({
            email: value.email
        });

        if(findMail){
            sendErrorMessages(res, 400, 'Diese E-Mail wurde bereits eingetragen.');
            return;
        }

        // ID erstellen
        const id = uuidv4();

        // Trage E-Mail in die Datenbank ein.
        const create = await newsletterModel.create({
            id: id,
            email: value.email,
            accepted: false
        });

        res.status(200).json({
            message: 'Bitte bestätigen Sie Ihre E-Mail Adresse, dazu haben wir Ihnen eine Bestätigungsmail zugesendet.'
        });

    } catch(error){
        console.error('Fehler: ' + error);
        sendErrorMessages(res, 500, "Interner Serverfehler");
    }
}