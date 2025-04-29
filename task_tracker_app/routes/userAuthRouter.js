import express from 'express';
import validate from '../middleware/validateMiddleware.js';
import { userAuthInfo } from '../validation/joiSchema.js';

const router = express.Router({ mergeParams: true });
router.use(express.json());

import {
    registerUser,
    loginUser
} from '../controllers/userAuthController.js';

router
    .route('/register')
    .post(validate(userAuthInfo, 'body'), registerUser);  //validate before registering the user

router
    .route('/login')
    .post(loginUser);  //doesnt need validation here

export default router;