import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const TaskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    priority: { type: String, required: true },
    date: { type: Date, required: true },
    active: { type: Boolean, default: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});


export const User = mongoose.model("User", UserSchema)
export const Task = mongoose.model("Task", TaskSchema)