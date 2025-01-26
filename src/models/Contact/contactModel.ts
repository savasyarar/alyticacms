// @ imports
import { Schema, model } from 'mongoose';

// @ import interface
import { IContact } from "../../interfaces/IContact";

const contactSchema = new Schema<IContact>({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const contactModel = model<IContact>("Contact",contactSchema);
export default contactModel;