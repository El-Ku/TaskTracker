import express from "express";
import { connectDB } from "./config/db.js";
import { taskRouter } from "./routes/taskRouter.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import { userAuthRouter } from "./routes/userAuthRouter.js";
import { profileRouter } from "./routes/profileRouter.js";
import { adminRouter } from "./routes/adminRouter.js";
import { tagRouter } from "./routes/tagRouter.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.set("trust proxy", "loopback"); // only trust 127.0.0.1

connectDB();

app.use(express.static("public"));

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Task Tracker App listening on port ${port}`);
});

// Redirect root URL to login.html
app.get("/tasktracker/", (req, res) => {
  res.redirect("/welcome.html");
});

app.use("/tasktracker/api/auth", userAuthRouter);
app.use("/tasktracker/api/profile", profileRouter);
app.use("/tasktracker/api/tasks", taskRouter);
app.use("/tasktracker/api/admin", adminRouter);
app.use("/tasktracker/api/tags", tagRouter);

app.use(errorHandler); // very important to place it at the very end to catch all errors.

export default app;
