import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

// model
import contactModel from "../../models/Contact/contactModel";
import { sendErrorMessages } from "../../utilis/basics";
import { contactValidation } from "../../utilis/validation/contactValidation";

// Kontaktnachricht anzeigenä
export const handleCreateContactRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const { error, value } = contactValidation.validate(req.body, {
            abortEarly: false
        });

        if(error){
            sendErrorMessages(res, 400, 'Validierungsfehler', error.details.map((err) => err.message));
            return;
        }

        const contactId = uuidv4();

        const create = await contactModel.create({
            id: contactId,
            name: value.name,
            email: value.email,
            message: value.message
        });

        res.status(201).json({
            message: 'Vielen Dank für Ihre Kontaktanfrage. Wir werden uns in Kürze mit Ihnen in Verbindung setzen.'
        });

    } catch(error){
        sendErrorMessages(res, 500, 'Interner Serverfehler');
        console.error(error);
    }
}