import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
        settings: {
            option1: {type: String, default: "normal"},
            option2: {type: String, default: "med"},
            option3: {type: String, default: "high"},
        }
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;