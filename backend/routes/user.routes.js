import express from 'express';
import { register } from '../controllers/user.controller.js';
import { login } from '../controllers/user.controller.js';
import { logout,getMyProfile,getAdmins } from '../controllers/user.controller.js';
import { isAuthenticated } from '../middleware/authUser.js';

const router=express.Router();
router.post("/register",register)
router.post("/login",login);
router.get("/logout",logout);
router.get("/myprofile",isAuthenticated,getMyProfile);
router.get("/admins",getAdmins);
export default router;