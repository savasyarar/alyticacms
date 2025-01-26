import express from "express";
const eventsRoutes = express.Router();

// @ auth
import { auth } from "../../middlewares/auth";

// @ import controllers
import { handleCreateEvent, handleDeleteEvent, handleUpdateEventById, handleGetAllEventsFromThisYear } from "../../controllers/Events/eventsController";

// @ post
eventsRoutes.post('/events', auth, handleCreateEvent);

// @ get
eventsRoutes.get('/events/all', handleGetAllEventsFromThisYear);

// @ put
eventsRoutes.put('/events/:id', auth, handleUpdateEventById);

// delete
eventsRoutes.delete('/events/:id', auth, handleDeleteEvent);

export default eventsRoutes;