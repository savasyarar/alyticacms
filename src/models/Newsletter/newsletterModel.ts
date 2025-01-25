import { Schema, model} from "mongoose";

// @ interface
import {INewsletter} from "../../interfaces/INewsletter";

// Schema
const newsletterSchema = new Schema<INewsletter>({
   id: {
       type: String,
       required: true,
       unique: true
   },
   email: {
       type: String,
       required: true,
       unique: true
   },
   accepted: {
       type: Boolean,
       required: true,
       default: false
   }
}, {
    timestamps: true
});

const newsletterModel = model<INewsletter>("Newsletter", newsletterSchema);
export default newsletterModel;