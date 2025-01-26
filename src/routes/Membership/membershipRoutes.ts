import express from "express";
const membershipRoutes = express.Router();

// import controllers
import { handleCreateMember, handleGetAllMemberships } from "../../controllers/Membership/membershipController";

// @ post
membershipRoutes.post("/membership", handleCreateMember);

// @ get
membershipRoutes.get('/membership/all', handleGetAllMemberships);

export default membershipRoutes;