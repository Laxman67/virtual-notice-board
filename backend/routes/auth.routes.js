// routes/auth.routes.js
import express from 'express';
import {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword
} from '../controller/auth.controller.js';
import authenticateToken from '../middleware/authenticateToken.js';
import { changePasswordValidation, loginValidation, registerValidation, updateProfileValidation, forgotPasswordValidation, resetPasswordValidation } from '../validations/auth.validations.js';

const router = express.Router();



// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPasswordValidation, forgotPassword);
router.post('/reset-password', resetPasswordValidation, resetPassword);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfileValidation, updateProfile);
router.put('/change-password', authenticateToken, changePasswordValidation, changePassword);

export default router;
