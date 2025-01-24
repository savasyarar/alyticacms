import express from "express";
const userRoutes = express.Router();

// @ import middlewares
import { auth } from "../../middlewares/auth";

// @ controllers
import {handleUserLogin, handleCreateUser, handleVerifyUser, handleDeleteUser} from "../../controllers/User/userController";

// Post
userRoutes.post('/user/login', handleUserLogin);
userRoutes.post('/user/create', auth, handleCreateUser);

// Get
userRoutes.get('/user/details', auth, handleVerifyUser);

// Delete
userRoutes.delete('/user/:id', auth, handleDeleteUser);

export default userRoutes;