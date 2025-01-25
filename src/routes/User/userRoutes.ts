import express from "express";
const userRoutes = express.Router();

// @ import middlewares
import { auth } from "../../middlewares/auth";

// @ controllers
import {handleUserLogin, handleCreateUser, handleVerifyUser, handleDeleteUser, handleEditUser, handleGetUserById, handleGetAllUser, handleRegisterFirstUser} from "../../controllers/User/userController";

// Post
userRoutes.post('/user/login', handleUserLogin);
userRoutes.post('/user/create', auth, handleCreateUser);
/*
userRoutes.post('/user/firstRegistration', handleRegisterFirstUser);
 */

// Put
userRoutes.put('/user/:id', auth, handleEditUser)

// Get
userRoutes.get('/user/details', auth, handleVerifyUser);
userRoutes.get('/user/all', auth, handleGetAllUser);
userRoutes.get('/user/:id', auth, handleGetUserById);

// Delete
userRoutes.delete('/user/:id', auth, handleDeleteUser);

export default userRoutes;