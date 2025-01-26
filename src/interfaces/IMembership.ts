// @ imports
import { Types, Document } from "mongoose";

export interface IMembership extends Document {
    _id: Types.ObjectId;
    id: string;
    entrepriseName: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    address: string;
    postalCode: string;
    location: string;
    membershipFee: string;
    iban: string;
    bic: string;
    createdAt: Date;
    updatedAt: Date;
}