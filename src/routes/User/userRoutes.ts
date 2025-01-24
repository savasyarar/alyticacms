import express from "express";
const userRoutes = express.Router();

// @ import middlewares
import { auth } from "../../middlewares/auth";

// @ controllers
import {handleUserLogin, handleCreateUser, handleVerifyUser} from "../../controllers/User/userController";

// POST
userRoutes.post('/user/login', handleUserLogin);
userRoutes.post('/user/create', auth, handleCreateUser);

// GET
userRoutes.get('/user/details', auth, handleVerifyUser);


export default userRoutes;