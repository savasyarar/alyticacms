// @ imports
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

// @ import model
import membershipModel from "../../models/Membership/membershipModel";
import {sendErrorMessages} from "../../utilis/basics";
import {membershipValidation} from "../../utilis/validation/membershipValidation";

// Erstele einen Mitglied
export const handleCreateMember = async(req: Request, res: Response) => {

    try {
        const { error, value } = membershipValidation.validate(req.body, {
            abortEarly: false
        });

        if(error){
            sendErrorMessages(res, 400, 'Validierungsfehler', error.details.map((err) => err.message));
            return;
        }

        const membershipId = uuidv4();

        const create = membershipModel.create({
            id: membershipId,
            entrepriseName: value.entrepriseName,
            firstName: value.firstName,
            lastName: value.lastName,
            phoneNumber: value.phoneNumber,
            email: value.email,
            address: value.address,
            postalCode: value.postalCode,
            location: value.location,
            membershipFee: value.membershipFee,
            iban: value.iban,
            bic: value.bic
        });

        res.status(201).json({
            message: 'Ihr Mitgliedsantrag konnte erfolgreich erstellt werden.'
        });

    } catch(error){
        sendErrorMessages(res, 400, 'Interner Serverfehler');
        console.error(error);
    }
}

// Zeige alle Mitgliedsanträge an
export const handleGetAllMemberships = async(req: Request, res: Response) => {
    try {

        const members = await membershipModel.find({}).sort({
            createdAt: -1
        });

        if(members.length === 0){
            sendErrorMessages(res, 404, 'Es sind keine Mitgliedsanträge vorhanden.');
            return;
        }

        const allMembers = members.map((member, index) => {

            const validMembershipFee = [
                { value: "semiAnnually", text: "halbjährlich"},
                { value: "yearly", text: "jährlich"},
                { value: "invoice", text: "Rechnung"}
            ];

            const membershipFee = validMembershipFee.find((mb) => mb.value === member.membershipFee);

            const formattedCreatedAt = moment(member.createdAt).format('DD.MM.YYYY');
            const formattedUpdatedAt = moment(member.updatedAt).format('DD.MM.YYYY');

            return {
               _id: member._id,
               id: member.id,
               entrepriseName: member.entrepriseName,
               firstName: member.firstName,
               lastName: member.lastName,
               phoneNumber: member.phoneNumber,
               email: member.email,
               address: member.address,
               postalCode: member.postalCode,
               location: member.location,
               membershipFee: membershipFee ? membershipFee.text : 'Unbekannt',
               iban: member.iban,
               bic: member.bic,
               createdAt: formattedCreatedAt,
               updatedAt: formattedUpdatedAt
           }
        });

        res.status(200).json({
            members: allMembers
        });

    } catch(error){
        sendErrorMessages(res, 400, 'Interner Serverfehler');
        console.error(error);
    }
}