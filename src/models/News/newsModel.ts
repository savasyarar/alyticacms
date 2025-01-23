import {Schema, model, Types, Document } from "mongoose";

// @ import interfaces
import { INews } from "../../interfaces/INews";

const newsSchema = new Schema<INews>({
    id: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    coverPicture: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const newsModel = model<INews>("News", newsSchema);
export default newsModel;