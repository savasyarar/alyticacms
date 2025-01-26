import express from "express";
const contactRoutes = express.Router();

// @ import controller
import { handleCreateContactRequest } from "../../controllers/Contact/contactController";

// @ post
contactRoutes.post("/contact", handleCreateContactRequest);

export default contactRoutes;