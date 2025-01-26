import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

// @ settings
const app = express();
const PORT = process.env.PORT || 3080;
require('dotenv').config();

// @ another settings
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// @ cors settings
let corsOptions = {
    origin: ["http://localhost:3000"],
    credentials: true
};

app.use(cors(corsOptions));

// @ import routes
import userRoutes from "./routes/User/userRoutes";
import newsRoutes from "./routes/News/newsRoutes";
import newsletterRoutes from "./routes/Newsletter/newsletterRoutes";
import eventsRoutes from "./routes/Events/eventsRoutes";
import membershipRoutes from "./routes/Membership/membershipRoutes";
import contactRoutes from "./routes/Contact/contactRoutes";

// use Routes
app.use('/api', userRoutes);
app.use('/api', newsRoutes);
app.use('/api', newsletterRoutes);
app.use('/api', eventsRoutes);
app.use('/api', membershipRoutes);
app.use('/api', contactRoutes);

// server starts
app.listen(PORT, () => {
    mongoose.connect(process.env.MONGO_URI!).then(() => {
        console.log(`Die Datenbankverbindung war erfolgreich, der Server mit dem PORT: ${PORT} ist gestartet.`);
    }).catch((err) => {
        console.log(err.message);
    })
});