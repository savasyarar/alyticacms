// @ imports
import { Schema, model } from "mongoose";

// @ interfaces
import {IMembership} from "../../interfaces/IMembership";

const membershipSchema = new Schema<IMembership>({
    id: {
        type: String,
        required: true,
        unique: true
    },
    entrepriseName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    membershipFee: {
        type: String,
        required: true,
        enum: ["semiAnnually", "yearly", "invoice"], // Halbjährlich, Jährlich, Rechnung
        default: "semiAnnually"
    },
    iban: {
        type: String,
        required: true
    },
    bic: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const membershipModel = model<IMembership>("Membership", membershipSchema);
export default membershipModel;