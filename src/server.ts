import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// @ settings
const app = express();
const PORT = process.env.PORT
require('dotenv').config();

// @ another settings
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// @ cors settings
let corsOptions = {
    origin: ["http://localhost:3085"],
    credentials: true
};

app.use(cors(corsOptions));

// @ import routes
import userRoutes from "./routes/User/userRoutes";


// use Routes
app.use('/api', userRoutes);

// server starts
app.listen(PORT, () => {
    console.log('Server ist erfolgreich gestartet!');
});