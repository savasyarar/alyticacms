import  { Types, Document } from "mongoose";

// @ types
import { Role } from "../@types/user";

export interface IUser extends Document {
    _id: Types.ObjectId;
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: Role;
    createdAt: Date,
    updatedAt: Date
}