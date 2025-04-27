import express from 'express';

const router = express.Router({ mergeParams: true });
router.use(express.json());

import {
    registerUser,
    loginUser
} from '../controllers/userAuthController.js';

router
    .route('/register')
    .post(registerUser);

router
    .route('/login')
    .post(loginUser);

export default router;