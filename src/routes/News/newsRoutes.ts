import express from "express";
const newsRoutes = express.Router();

// @ middlewares
import { auth } from "../../middlewares/auth";
import { upload } from "../../middlewares/upload";

// @ controllers
import {
    handleCreateNews,
    handleDeleteNews,
    handleEditNews,
    handleGetAllNews,
    handleGetNewsById,
    handleGetLastFiveNews
} from "../../controllers/News/newsController";


// Post
newsRoutes.post('/news', auth, upload.single('coverPicture'), handleCreateNews);

// Put
newsRoutes.put('/news/:id', auth, upload.single('coverPicture'), handleEditNews);

// Get
newsRoutes.get('/news/:id', handleGetNewsById); // Nachrichten nach ID anzeigen
newsRoutes.get('/news/all/view', handleGetAllNews); // Alle Nachrichten anzeigen
newsRoutes.get('/news/last/view', handleGetLastFiveNews); // Letzten 5 Nachrichten anzeigen

// Delete
newsRoutes.delete('/news/:id', auth, handleDeleteNews);

export default newsRoutes;