import express from "express";
import { protect } from "../middleware/protectMiddleware.js";
// TODO: add rate limiter

const tagRouter = express.Router({ mergeParams: true });
tagRouter.use(express.json());

import { loadAll, createTag } from "../controllers/tagController.js";

// Apply `protect` to _all_ subsequent routes
tagRouter.use(protect);

tagRouter.route("/").get(loadAll).post(createTag);

export { tagRouter };
