import express from "express";
const newsRoutes = express.Router();

// @ middlewares
import { auth } from "../../middlewares/auth";
import { upload } from "../../middlewares/upload";

// @ controllers
import {
    handleCreateNews,
    handleDeleteNews,
    handleEditNews
} from "../../controllers/News/newsController";


// Post
newsRoutes.post('/news', auth, upload.array('files', 15), handleCreateNews);

// Put
newsRoutes.put('/news/:id', auth, upload.array('files', 15), handleEditNews);

// Delete
newsRoutes.delete('/news/:id', auth, handleDeleteNews);

export default newsRoutes;