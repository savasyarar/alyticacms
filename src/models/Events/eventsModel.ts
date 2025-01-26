// @ imports
import { Schema, model } from "mongoose";

// @ import interface
import {IEvents} from "../../interfaces/IEvents";

const eventsSchema = new Schema<IEvents>({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    }
}, {
    timestamps: true,
});

const eventsModel = model<IEvents>("Events", eventsSchema);
export default eventsModel;