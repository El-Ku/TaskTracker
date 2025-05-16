import express from "express";
import connectDB from "./config/db.js";
import taskRouter from "./routes/taskRouter.js";
import errorHandler from "./middleware/errorMiddleware.js";
import userAuthRouter from "./routes/userAuthRouter.js";
import profileRouter from "./routes/profileRouter.js";

const app = express();
const port = 3000;

connectDB();

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Task Tracker App listening on port ${port}`);
});

// Redirect root URL to login.html
app.get("/", (req, res) => {
  res.redirect("/login.html");
});

app.use("/api/auth", userAuthRouter);
app.use("/api/profile", profileRouter);
app.use("/api/tasks", taskRouter);
//app.use('/api/:userName/profile',profileRouter);
app.use(errorHandler); // very important to place it at the very end to catch all errors.
