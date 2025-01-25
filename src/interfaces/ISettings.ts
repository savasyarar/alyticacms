import { Types, Document} from "mongoose";

export interface ISettings extends Document {
    _id: Types.ObjectId;
    id: string;
    entrepriseName: string;
    entrepriseAddress: string;
    entrepriseCity: string;
    entreprisePostalcode: string;
    entrepriseMail: string;
    entrepriseMailServer?: string;
    entrepriseMailUsername?: string;
    entrepriseMailPassword?: string;
    entrepriseSmtpPort?: number;
}