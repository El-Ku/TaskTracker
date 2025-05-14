import express from 'express';
import validate from "../middleware/validateMiddleware.js";
import {
    shortTermLoginLimiter,
    longTermLoginLimiter,
    shortTermUserRegLimiter,
    longTermUserRegLimiter
} from "../middleware/rateLimitMiddleware";
import { userAuthInfo } from "../validation/joiSchema.js";

const router = express.Router({ mergeParams: true });
router.use(express.json());

import {
    registerUser,
    loginUser
} from '../controllers/userAuthController.js';

router
    .route('/register')
    .post(shortTermUserRegLimiter, longTermUserRegLimiter, validate(userAuthInfo, 'body'), registerUser);  //validate before registering the user

router
    .route('/login')
    .post(shortTermLoginLimiter, longTermLoginLimiter, loginUser);  //doesnt need validation here

export default router;