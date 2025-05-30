import express from "express";
import connectDB from "./config/db.js";
import taskRouter from "./routes/taskRouter.js";
import errorHandler from "./middleware/errorMiddleware.js";
import userAuthRouter from "./routes/userAuthRouter.js";
import profileRouter from "./routes/profileRouter.js";
import adminRouter from "./routes/adminRouter.js";
import cors from "cors";

const app = express();
const port = process.env.NODE_ENV === "production" ? process.env.PORT : 3000;

const allowedOrigin =
  process.env.NODE_ENV === "production"
    ? "https://tasktracker-client-yuyo.onrender.com"
    : "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

connectDB();

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Task Tracker App listening on port ${port}`);
});

// Redirect root URL to login.html
app.get("/", (req, res) => {
  res.redirect("/welcome.html");
});

app.use("/api/auth", userAuthRouter);
app.use("/api/profile", profileRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/admin", adminRouter);

app.use(errorHandler); // very important to place it at the very end to catch all errors.
