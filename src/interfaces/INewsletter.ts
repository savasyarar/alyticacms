import { Types, Document } from "mongoose";

export interface INewsletter extends Document {
    _id: Types.ObjectId;
    id: string;
    email: string;
    accepted: boolean;
    createdAt: Date;
    updatedAt: Date;
}