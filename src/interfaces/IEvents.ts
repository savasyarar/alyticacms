// @ imports
import { Types, Document } from "mongoose";

export interface IEvents extends Document {
    _id: Types.ObjectId;
    id: string;
    name: string;
    description: string;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}