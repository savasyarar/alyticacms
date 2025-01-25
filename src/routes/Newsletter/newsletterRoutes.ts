import express from "express";
const newsletterRoutes = express.Router();

// controllers
import { handleSignNewsletter } from "../../controllers/Newsletter/newsletterController";


// Routes
newsletterRoutes.post('/newsletter', handleSignNewsletter);

export default newsletterRoutes;