import { Types, Document } from "mongoose";

export interface IContact extends Document {
    _id: Types.ObjectId;
    id: string;
    name: string;
    email: string;
    message: string;
    createdAt: Date;
    updatedAt: Date;
}