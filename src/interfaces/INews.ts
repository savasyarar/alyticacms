import { Types, Document } from "mongoose";

export interface INews extends Document {
    _id: Types.ObjectId;
    id: string;
    userId: string;
    title: string;
    coverPicture: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}