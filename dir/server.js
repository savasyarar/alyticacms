"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
// @ settings
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3080;
require('dotenv').config();
// @ another settings
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// @ cors settings
let corsOptions = {
    origin: ["http://localhost:3000"],
    credentials: true
};
app.use((0, cors_1.default)(corsOptions));
// @ import routes
const userRoutes_1 = __importDefault(require("./routes/User/userRoutes"));
const newsRoutes_1 = __importDefault(require("./routes/News/newsRoutes"));
const newsletterRoutes_1 = __importDefault(require("./routes/Newsletter/newsletterRoutes"));
const eventsRoutes_1 = __importDefault(require("./routes/Events/eventsRoutes"));
const membershipRoutes_1 = __importDefault(require("./routes/Membership/membershipRoutes"));
const contactRoutes_1 = __importDefault(require("./routes/Contact/contactRoutes"));
// use Routes
app.use('/api', userRoutes_1.default);
app.use('/api', newsRoutes_1.default);
app.use('/api', newsletterRoutes_1.default);
app.use('/api', eventsRoutes_1.default);
app.use('/api', membershipRoutes_1.default);
app.use('/api', contactRoutes_1.default);
// server starts
app.listen(PORT, () => {
    mongoose_1.default.connect(process.env.MONGO_URI).then(() => {
        console.log(`Die Datenbankverbindung war erfolgreich, der Server mit dem PORT: ${PORT} ist gestartet.`);
    }).catch((err) => {
        console.log(err.message);
    });
});
