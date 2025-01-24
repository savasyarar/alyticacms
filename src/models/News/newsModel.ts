import { Schema, model } from "mongoose";

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
        required: true,
        trim: true,
        maxlength: 200
    },
    coverPicture: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ["default"]
    },
    published: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const newsModel = model<INews>("News", newsSchema);
export default newsModel;