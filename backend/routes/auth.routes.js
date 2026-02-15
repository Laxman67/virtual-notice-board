// routes/auth.routes.js
import express from 'express';
import {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword
} from '../controller/auth.controller.js';
import authenticateToken from '../middleware/authenticateToken.js';
import { changePasswordValidation, loginValidation, registerValidation, updateProfileValidation } from '../validations/auth.validations.js';

const router = express.Router();



// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', logout);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfileValidation, updateProfile);
router.put('/change-password', authenticateToken, changePasswordValidation, changePassword);

export default router;
