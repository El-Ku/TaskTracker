import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';
import taskRouter from './routes/taskRouter.js';
import errorHandler from './middleware/errorMiddleware.js';

const app = express();
const port = 3000;

dotenv.config();
connectDB();

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Task Tracker App listening on port ${port}`)
});

app.use('/:userName/tasks',taskRouter);
app.use(errorHandler);  // very important to place it at the very end to catch all errors.
