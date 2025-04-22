const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Task Tracker App listening on port ${port}`)
});

const userRouter = require('./routes/user_tasks');
app.use('/:userName/tasks',userRouter);