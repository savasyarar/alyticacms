import { Schema, model } from "mongoose";

// @ import interface
import { IUser } from "../../interfaces/IUser";

// @ import types

const userSchema = new Schema<IUser>({
    id: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ["administrator", "contentManager", "editor"]
    }
}, {
    timestamps: true
});

const userModel = model<IUser>("User", userSchema);
export default userModel;