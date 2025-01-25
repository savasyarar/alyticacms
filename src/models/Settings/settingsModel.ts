import { Schema, model } from "mongoose";

import {ISettings} from "../../interfaces/ISettings";

export const settingsSchema = new Schema<ISettings>({
    id: {
        type: String,
        required: true
    },
    entrepriseName: {
        type: String,
        required: true
    },
    entrepriseAddress: {
        type: String,
        required: true
    },
    entrepriseCity: {
        type: String,
        required: true
    },
    entreprisePostalcode: {
        type: String,
        required: true
    },
    entrepriseMail: {
        type: String,
        required: true
    },
    entrepriseMailServer: {
        type: String
    },
    entrepriseMailUsername: {
        type: String
    },
    entrepriseMailPassword: {
        type: String
    },
    entrepriseSmtpPort: {
        type: String
    }
});

const settingsModel = model<ISettings>("settingsModel", settingsSchema);
export default settingsModel;