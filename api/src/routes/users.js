import express from "express";
import { getUsersById, deleteUser, updateUser, registerUser, loginUser } from "../controllers/user.js";
import jwt from "jsonwebtoken";

function ckeckToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({ message: "Acesso negado" })
    }

    try {
        const secret = process.env.SECRET
        const tokem = jwt.verify(token, secret)
        console.log(tokem)
        next()

    } catch (error) {
        res.status(400).json({ message: "Token inválido!" });
    }
}

const router = express.Router()

router.get("/user/:id", getUsersById)

router.post("/auth/register", registerUser);

router.post("/auth/login", loginUser);

router.put("/user/:id", updateUser);

router.delete("/user/:id", deleteUser);

export default router