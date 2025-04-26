import mongoose from 'mongoose';

const taskSchema = mongoose.Schema(
    {
        desc: {
            type: String,
            required: true,
            unique: true
        },
        time: {
            type: Date,
            default: Date.now()
        },
        status: {
            type: String,
            default: 'pending'
        }
    },
    {
        timestamps: true,
    }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;